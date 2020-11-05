import { Sprite } from "pixi.js";
import { Affect } from "../../../../anxi/affect";
import { StateCache } from "../../../../anxi/controller/state";
import { SkillProto } from "../../../../anxi/proto/skill";
import { Circle } from "../../../../anxi/shape/shape";
import { Flyer } from "../../../../anxi/atom/flyer";
import { a2r, by, gameSound } from "../../../../util";

export default new SkillProto(9, '厄夜糜行', '光枪射击').lost(30).freezing(60).active().lost(40)
    .execute(function () {
        let skill = this;
        let vita = this.vita;
        let face = vita.face;
        let x = vita.x;
        let y = vita.y;
        let arrowCount = 5;
        let preTime = 10;
        let findTime = 30;
        let flyTime = 40;

        let sawEnemys, len, targets;
        Array.from(new Array(arrowCount), (v, flyerIndex, index = flyerIndex) => new Flyer(new Sprite(by('./res/util/monst/5/10.png')), function (s) {
            s.alpha = 0;
            s.anchor.set(1, 0.5);
            s.position.set(x - face * (100 - 8 * index), y + 65 - index * 20);
            s.angle = 90 + (-90 + 12 * index) * face;
        }).onTime(function (timer) {
            if (timer <= preTime) {
                this.root.alpha = timer / preTime;
                if (this.belonger.dead) {
                    this.die();
                    return;
                }
            }
            if (timer == preTime) {
                sawEnemys = vita.world.selectableVitas().filter(v => v.group != vita.group);
                len = sawEnemys.length;
                targets = Array.from(new Array(arrowCount), (v, k) => len > 0 ? sawEnemys[k % len] : vita);
            }
            if (timer > preTime && timer <= preTime + findTime) {
                let target = targets[flyerIndex];
                if (target.dead) return;
                let angle = this.angle;
                let cy = target.centerY - this.root.y;
                let cx = target.x - this.root.x;
                let tan = cy / cx;
                let a = Math.round(Math.atan(tan) * 180 / Math.PI);
                if (cx < 0) a += 180;
                if (a < 0) a += 360;
                if (a > angle) {
                    angle += Math.max(1, (a - angle) * 0.2);
                } else if (a < angle) {
                    angle -= Math.max(1, (angle - a) * 0.2);
                }
                this.useConstAngle(angle);
            }
            if (timer == preTime + findTime) {
                gameSound.showInCard('./res/audio/wing/0.wav');
                this.speed = 10;
                this.useSpeedGetter(timer => this.speed + 0.5);
                this.useLiveTime(preTime + findTime + flyTime + 1);
            }
        }).from(vita).checkFromHandler(timer => timer > preTime + findTime).useNoGroupFilter()
            .useHitAreaGetter((x, y) => new Circle(x, y, 20)).useAffectGetter((from, to) => new Affect(skill, from, to, affect => {
                affect.harm.common = vita.prop.atk * 0.65 + 10;
                affect.debuff.push({
                    state: StateCache.beHitBehind,
                    last: 25
                });
            })).createFrom(this));
    });