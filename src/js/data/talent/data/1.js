import { Sprite } from "pixi.js";
import { Flyer } from "../../../anxi/atom/flyer";
import { SkillProto } from "../../../anxi/proto/skill";
import { directBy, IFC } from "../../../util";

export default new SkillProto(1, '成神之路', '每击杀一个单位会增加自身1--5攻击力，最多10次，满层后自身造成伤害后会回复伤害值5%的血量')
    .active(false)
    .init(data => {
        data.killed = 0;
        data.beengod = false;
    })
    .initProp('atk', (bv, vita, skill) => Math.min(6, Math.floor(vita.level / 3)) * skill.data.killed)
    .initListen('killenemy', (vita, skill) => e => {
        if (skill.data.killed == 10) return;
        skill.data.killed += 1;
        vita.needCompute = true;
        if (skill.data.killed == 10) {
            skill.data.beengod = true;
            skill.execute();
        }
    })
    .initListen('resAffect', (vita, skill) => e => {
        if (!skill.data.beengod) return;
        let affect = e.value;
        vita.getHP(affect.finalHarm * 0.05, vita);
    })
    .execute(function () {
        let sprite = new Sprite(directBy('talent/1/0.png'));
        sprite.anchor.set(0.5, 0.5);
        sprite.alpha = 0;
        sprite.position.set(5, -5);
        this.vita.viewController.blocks.head.addChild(sprite);
        this.vita.viewController.toDestory.push(sprite);
        let tick = 1;
        this.vita.on('timing', e => {
            sprite.alpha = tick / 30;
            let scale = 3 - tick / 15;
            sprite.scale.set(scale, scale);
            return ++tick > 30;
        })
    })