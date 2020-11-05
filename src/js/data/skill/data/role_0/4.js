import { Affect } from "../../../../anxi/affect";
import { ShadowController } from "../../../../anxi/controller/skill/shadow";
import { ItemEvent } from "../../../../anxi/event";
import { SkillProto } from "../../../../anxi/proto/skill";
import { Circle } from "../../../../anxi/shape/shape";
import { gameSound } from "../../../../util";

/**
 * 技能5 【被动】残影的滞留时间增加为5秒
 *          所有残影化为剑气，向自身飞回对途径敌人造成伤害，残影数量越多伤害越高，一个敌人可以被多个残影打中
 *          若残影数量为0，则由自身向外发出9只残影，造成伤害
 */
export default new SkillProto(4, '魔影杀', `【被动】残影的滞留时间增加为5秒。\n所有残影化为剑气，向自身飞回对途径敌人造成伤害，残影数量越多伤害越高，一个敌人可以被多个残影打中。若残影数量为0，则由自身向外发出9只残影，造成伤害`)
    .active(true)
    .lost(100)
    .freezing(10)
    .init(function () {
        this.vita.shadowContinueTime = 300;
        this.vita.shadowController && (this.vita.shadowController.continueTime = 300);
    })
    .execute(function () {
        let sc = this.vita.getController('shadowController', ShadowController);
        let num = sc.shadows.length;
        if (num > 0) {
            let affectProto = {
                harm: {
                    common: 20 + (8 + num) * 0.1 * this.vita.prop.atk,
                    absolute: 0
                }
            }
            sc.worsen(affectProto);
            gameSound.showInCard('./res/util/role/0/sound/41.m4a');
        } else {
            let role = this.vita;
            let sum = 9;
            let each_angle = 2 * Math.PI / 9;
            let shadows = Array.from(new Array(sum), (e, i) => {
                let shadow = role.shadowController.create(role.x - 10, role.centerY);
                shadow.rotation = -each_angle * i + Math.PI * 0.5;
                shadow.vx = role.face * 15 * Math.sin(i * each_angle);
                shadow.vy = role.face * 15 * Math.cos(i * each_angle);
                return shadow;
            });
            role.on(`timer_${role.timer + 20}`, e => {
                shadows.forEach(shadow => {
                    shadow.vx = 0;
                    shadow.vy = 0;
                })
                return true;
            });
            let shootedVitas = [];
            for (let i = 0; i < 11; i++) {
                role.on(`timer_${role.timer + i * 3}`, e => {
                    shadows.forEach(shadow => {
                        let x = shadow.x;
                        let y = shadow.y;
                        let hitarea = new Circle(x, y, 70);
                        let shoots = role.world.selectableVitas().filter(vita => Boolean(vita)).filter(vita => vita.group != role.group)
                            .filter(vita => !shootedVitas.includes(vita.id))
                            .filter(vita => hitarea.hit(vita.getHitGraph()));
                        if (shoots.length > 0) {
                            this.vita.on(new ItemEvent('hitenemys', shoots, this));
                        }
                        shoots.forEach(vita => {
                            shootedVitas.push(vita.id);
                            /**
                             * 这是单位之间一对一的效果 可以包括伤害和debuff
                             */
                            let affect = new Affect(this, role, vita);
                            affect.harm.absolute = 100 + role.level * 5;
                            affect.setout();
                        });
                    })
                    return true;
                });
            }
            gameSound.showInCard('./res/util/role/0/sound/40.wav');
        }
    })