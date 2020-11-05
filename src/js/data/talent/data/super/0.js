import { Sprite } from "pixi.js";
import { Affect } from "../../../../anxi/affect";
import { Flyer } from "../../../../anxi/atom/flyer";
import { Vita } from "../../../../anxi/atom/vita";
import { Attack } from "../../../../anxi/hurt/attack";
import { SkillProto } from "../../../../anxi/proto/skill";
import { directBy } from "../../../../util";

export default new SkillProto(0, '强攻', '对每个敌人造成第三次普攻后，对其造成此次伤害110%的真实伤害, 永久降低其5+自身等级*50%的防御。')
    .initListen('resAffect', (vita, skill) => e => {
        let { atkedEnemys } = skill.data;
        let target = e.from;
        /**
         * @type {Affect}
         */
        let affect = e.value;
        let isAttack = affect?.proto instanceof Attack;
        if (affect.finalHarm == 0) return;
        if (isAttack) {
            atkedEnemys[target.id] = (atkedEnemys[target.id] ?? 0) + 1;
            if (atkedEnemys[target.id] == 3) {
                skill.execute(target, affect.harm.absolute + affect.harm.common, affect.proto);
            }
        }
    })
    .active(false)
    .init(data => {
        data.atkedEnemys = [];
    })
    .execute(function (target, harmBefore, attack) {
        // console.log(`enemy ${target.id} is hurt by ${harmBefore * 1.1}`);
        /**
         * @type {Vita}
         */
        let enemy = target;
        let s = new Sprite(directBy('talent/0/0.png'))
        new Flyer(s, s => {
            s.anchor.set(0.5, 0.5);
            s.position.set(0, enemy.height >> 1);
            enemy.viewController.toDestory.push(s);
            enemy.viewController.view.addChild(s);
            s.alpha = 0;
        }).useLiveTime(30).bindTo(enemy).onTime(timer => {
            if (timer <= 15) {
                s.alpha = timer / 15;
                s.angle += 8;
            } else {
                s.alpha = (30 - timer) / 15;
                s.scale.set(timer / 15, timer / 15);
            }
        }).once(`timer_${15}`, e => {
            let affect = new Affect(attack, this.vita, enemy);
            affect.harm = {
                absolute: harmBefore * 1.1,
                common: 0
            };
            affect.debuff = [];
            affect.setout();
            let defd = 5 + this.vita.level >> 1;
            enemy.computeFunctions['def'].push(_ => -defd);
            enemy.needCompute = true;
        })
    })