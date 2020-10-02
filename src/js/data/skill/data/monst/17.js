import { Graphics, Matrix, Texture } from "pixi.js";
import { Affect } from "../../../../anxi/affect";
import { Flyer } from "../../../../anxi/atom/flyer";
import { StateCache } from "../../../../anxi/controller/state";
import { SkillProto } from "../../../../anxi/proto/skill";
import { Circle } from "../../../../anxi/shape/shape";
import { a2r, directBy, tween } from "../../../../util";

export default new SkillProto(17, '月之降临', '在前方释放一个月轮，月轮能量爆破眩晕敌人并造成大量伤害').active().standing(100)
    .execute(function () {
        let vita = this.vita;
        let { face, timer } = vita;
        let x = vita.x;
        let y = vita.centerY;
        let targetX = x + 300 * face;
        let targetY = y;
        let graphics = new Graphics();
        graphics.position.set(targetX, targetY);
        graphics.scale.set(face, 1);
        let texture = new Texture(directBy('monst/6/skill/1.png'));
        let matrix = new Matrix().translate(80, 80);
        let flyer = new Flyer(graphics).useLiveTime(120).onTime(timer => {
            if (timer >= 100) {
                let proc = (timer - 100) / 20;
                graphics.scale.set(proc + 1, 1 + proc);
                graphics.alpha = 1 - proc;
                return;
            }
            console.log(timer, this.executing, vita.stateController.getSingleState(StateCache.attack).last);
            if (!this.executing) return flyer.die();
            if (timer > 60) {
                if (timer == 70) {
                    graphics.clear();
                } else if (timer > 70) {
                    let proc = timer - 70;
                    graphics.clear();
                    graphics.lineStyle(3, 0xff0011, 0.3);
                    graphics.drawCircle(0, 0, 80);
                    graphics.lineStyle(3, 0xee2211, 0.3);
                    graphics.drawCircle(0, 0, 60);
                    graphics.lineStyle(3, 0x55dd11, 0.3);
                    graphics.drawCircle(0, 0, 30);
                    graphics.lineStyle(0);
                    graphics.beginFill(0xff0000, 0.5);
                    graphics.drawStar(0, 0, 3, 40 + proc * 1.8, 10 + proc * 0.5, a2r(proc * 3));
                    graphics.drawStar(0, 0, 3, 40 + proc * 1.8, 10 + proc * 0.5, a2r(-proc * 3));
                    graphics.endFill();
                }
                return;
            }
            graphics.clear();
            for (let i = 0; i < 3; i++) {
                graphics.beginTextureFill({
                    texture,
                    matrix
                });
                graphics.arc(0, 0, 80, a2r(timer * 4 + i * 120), a2r(timer * 6 + i * 120));
                graphics.lineTo(0, 0);
                graphics.endFill();
            }
        }).from(vita).checkFromArray([101, 106, 111, 116])
            .useHitAreaGetter(function (x, y) {
                console.log(new Circle(x, y, this.timer - 20));
                return new Circle(x, y, this.timer - 20)
            })
            .useAffectGetter(enemy => {
                let affect = new Affect(this, vita, enemy);
                affect.harm.common = vita.prop.atk * 2.5;
                affect.debuff = [{
                    state: StateCache.dizzy,
                    last: 2 * 60
                }];
                return affect;
            }).useFilter(enemys => enemys.filter(enemy => enemy.group != vita.group));
    }).useCommonActionData({
        weapon: {
            changedFrame: 1,
            len: 100,
            value: tween([28, 82, -12], 20, [28, 82, -85], 60, [28, 82, -85], 20, [28, 82, -12])
        }
    })