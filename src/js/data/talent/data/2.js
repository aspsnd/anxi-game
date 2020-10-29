import { Container, Rectangle, Sprite, Texture } from "pixi.js";
import { Affect } from "../../../anxi/affect";
import { Flyer } from "../../../anxi/atom/flyer";
import { Vita } from "../../../anxi/atom/vita";
import { StateCache, StateItem } from "../../../anxi/controller/state";
import { SkillProto } from "../../../anxi/proto/skill";
import { Circle } from "../../../anxi/shape/shape";
import { directBy } from "../../../util";

export default new SkillProto(2, '超凡', '每击杀一个敌人，会获得1层魔能，当角色开启无双时会消耗所有魔能，每个魔能为角色提供0.5s霸体状态，并使角色无双结束前第一次造成伤害时对目标所在区域造成高额伤害。')
    .active(false)
    .init(data => {
        data.power = 0;
    })
    .initListen('killenemy', (vita, skill) => e => {
        skill.data.power++;
    })
    .initListen('getura', (vita, skill) => e => {
        skill.execute();
    })
    .execute(function () {
        let { vita } = this;
        let power = this.data.power;
        this.data.power = 0;
        if (power > 0) {
            let last = power * 30;
            vita.stateController.insertState(StateCache.URA, new StateItem(last));
        };
        let comt = vita.once('resAffect', e => {
            /**
             * @type {Vita}
             */
            let enemy = e.from;
            let { x, centerY: y } = enemy;
            let container = new Container();
            let arrow = new Sprite(directBy('talent/2/0.png'));
            arrow.anchor.set(1, 0.5);
            let light1 = new Sprite(new Texture(directBy('talent/2/1.png'),
                new Rectangle(0, 0, 100, 21)));
            let light2 = new Sprite(new Texture(directBy('talent/2/1.png'),
                new Rectangle(40, 0, 100, 21)));
            light1.anchor.set(1, 0.5);
            light2.anchor.set(1, 0.5);
            light1.x = -65;
            light2.x = -65;
            container.addChild(arrow, light1, light2);
            let goleft = vita.x > x;
            let lefter1 = 0;
            let lefter2 = 40;
            new Flyer(container, c => {
                c.position.set((goleft ? 450 : -450) + x, y - 450);
            }).useConstAngle(goleft ? 135 : 45).useConstSpeed(12)
                .useLiveTime(90).onTime(timer => {
                    lefter1 += 2;
                    lefter2 += 2;
                    if (lefter1 > 100) lefter1 -= 100;
                    if (lefter2 > 100) lefter2 -= 100;
                    light1.texture.frame = new Rectangle(lefter1, 0, 100, 21);
                    light2.texture.frame = new Rectangle(lefter2, 0, 100, 21);
                }).from(vita).checkFromBool(true).useHitAreaGetter((x, y) => new Circle(x, y, 20))
                .useAffectGetter((from, to) => {
                    let affect = new Affect(this, from, to);
                    affect.debuff = [];
                    affect.harm.absolute = (120 + from.prop.atk) * (0.15 + 0.08 * power);
                    affect.harm.common = (120 + from.prop.atk) * (0.15 + 0.08 * power);
                    return affect;
                }).useFilter(vitas => vitas.filter(v => v.group != vita.group));
        });
        vita.once('lostura', e => {
            vita.removeHandler(comt);
        })
    })