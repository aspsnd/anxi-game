import { Affect } from "../../../../anxi/affect";
import { ShadowController } from "../../../../anxi/controller/skill/shadow";
import { StateCache } from "../../../../anxi/controller/state";
import { SkillProto } from "../../../../anxi/proto/skill";
import { Point, Polygon } from "../../../../anxi/shape/shape";
import { IFC } from "../../../../util";
/**
* 技能2 向前挥剑，发出自己的残影，对路过敌人造成伤害，并在终点滞留3秒
*/
export default new SkillProto(1,'轻斩', '发出自己的残影，对路过敌人造成伤害，并在终点滞留')
    .active(true)
    .lost(20)
    .standing(30)
    .execute(function () {
        let role = this.vita;
        role.stateController.removeState(StateCache.run, StateCache.go);
        let shadow = role.getController('shadowController', ShadowController).create(role.x - 10, role.centerY);
        shadow.vx = role.face * 10;
        role.on(`timer_${role.timer + 30}`, e => {
            shadow.vx = 0;
            return true;
        });
        let shootedVitas = [];
        for (let i = 0; i < 11; i++) {
            role.on(`timer_${role.timer + i * 3}`, e => {
                let x = shadow.x;
                let y = shadow.y;
                let hitarea = new Polygon(new Point(x - 35, y - 50), new Point(x + 35, y - 50), new Point(x - 35, y + 50), new Point(x + 35, y + 50));
                let shoots = role.world.selectableVitas().filter(vita => vita.group != role.group)
                    .filter(vita => !shootedVitas.includes(vita.id))
                    .filter(vita => hitarea.hit(vita.getHitGraph()));
                shoots.forEach(vita => {
                    shootedVitas.push(vita.id);
                    /**
                     * 这是单位之间一对一的效果 可以包括伤害和debuff
                     */
                    let affect = new Affect(this, role, vita);
                    affect.harm.common = 30 + role.prop.atk * 1.5;
                    affect.setout();
                });
                return true;
            });
        }
    })
    .useCommonActionData({
        weapon: {
            len: 11,
            changedFrame: 3,
            value: [
                [34, 45, 185],
                [31, 46, 218],
                [29, 48, 249],
                [26, 50, 280],
                [26, 50, 280],
                [26, 50, 280],
                [26, 50, 280],
                [26, 50, 280],
                [29, 48, 249],
                [31, 46, 218],
                [34, 45, 185],
            ]
        },
        leg_l: {
            changedFrame(ps) {
                return new IFC(ps.timer).less(5, 0).less(10, 1).more(30, 3).more(25, 0).more(20, 1).null(2).value;
            },
            len: 3,
            value: [
                [9, 73, 20],
                [6, 73, 10],
                [3, 73, 0],
                [12, 73, 20]
            ]
        },
        body: {
            changedFrame(ps) {
                return new IFC(ps.timer).less(5, 0).less(10, 1).more(25, 0).more(20, 1).null(2).value;
            },
            len: 3,
            value: [
                [10, 56],
                [7, 56],
                [4, 56]
            ]
        },
        leg_r: {
            changedFrame(ps) {
                return new IFC(ps.timer).less(5, 0).less(10, 1).more(30, 3).more(25, 0).more(20, 1).null(2).value;
            },
            len: 3,
            value: [
                [14, 73, -40],
                [11, 73, -50],
                [9, 73, -60],
                [17, 73, -30]
            ]
        },
        hand_l: {
            changedFrame(ps) {
                return new IFC(ps.timer).less(5, 0).less(10, 1).more(25, 0).more(20, 1).null(2).value;
            },
            len: 3,
            value: [
                [11, 40, 105],
                [8, 40, 105],
                [5, 40, 105]
            ]
        },
        hand_r: {
            changedFrame(ps) {
                return new IFC(ps.timer).less(5, 0).less(10, 1).more(25, 0).more(20, 1).null(2).value;
            },
            len: 3,
            value: [
                [10, 42, 19],
                [7, 42, 22],
                [4, 42, 25]
            ]
        },
        head: {
            changedFrame(ps) {
                return new IFC(ps.timer).less(5, 0).less(10, 1).more(25, 0).more(20, 1).null(2).value;
            },
            len: 3,
            value: [
                [13, 25],
                [10, 26],
                [8, 26]
            ]
        }
    });