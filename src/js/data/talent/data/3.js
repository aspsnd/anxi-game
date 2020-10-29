import { AnimatedSprite } from "pixi.js";
import { Affect } from "../../../anxi/affect";
import { Flyer } from "../../../anxi/atom/flyer";
import { Vita } from "../../../anxi/atom/vita";
import { SkillProto } from "../../../anxi/proto/skill";
import { Point, Polygon } from "../../../anxi/shape/shape";
import { directBy } from "../../../util";

export default new SkillProto(3, '雷劫', '每造成10次伤害，会在最后一次伤害的敌人引发雷击，3s冷却')
    .active(false)
    .init(data => {
        data.power = 0;
        data.lastExecute = -180;
        data.freeze = 180;
    })
    .initListen('resAffect', (vita, skill) => e => {
        if (skill.data.lastExecute + skill.data.freeze > vita.timer) return;
        /**
         * @type {Affect}
         */
        let affect = e.value;
        if (affect.finalHarm == 0) return;
        if (++skill.data.power == 10) {
            skill.data.power = 0;
            skill.data.lastExecute = vita.timer;
            skill.execute(affect.to);
        }
    })
    .execute(function (enemy) {
        /**
         * @type {Vita}
         */
        let target = enemy;
        let { vita } = this;
        let { x, centerY: y } = target;
        let thunder = new AnimatedSprite(Array.from(new Array(6), (v, k) => directBy(`talent/3/${k + 1}.png`)), true);
        thunder.position.set(x, y);
        thunder.anchor.set(0.5, 0.5);
        thunder.animationSpeed = 5;
        thunder.play();
        new Flyer(thunder).from(vita).useLiveTime(15).onTime(timer => {
            let scale = timer / 5 + 1;
            thunder.scale.set(scale, scale);
            thunder.alpha = 1 - timer / 15;
        }).useFilter(vitas => vitas.filter(v => v.group != vita.group))
            .checkFromArray([5, 10]).useHitAreaGetter((x, y) => new Polygon(
                new Point(x - 20, y - 50),
                new Point(x - 20, y + 50),
                new Point(x + 20, y + 50),
                new Point(x + 20, y - 50)
            )).useAffectGetter((from, to) => {
                let affect = new Affect(this, from, to);
                affect.debuff = [];
                affect.harm.common = 50 + vita.level * 10 + vita.prop.atk * 0.4 + vita.prop.mp * 0.075;
                return affect;
            });
    })