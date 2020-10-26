import { Graphics, Sprite } from "pixi.js";
import { Affect } from "../../../../anxi/affect";
import { Flyer } from "../../../../anxi/atom/flyer";
import { SkillProto } from "../../../../anxi/proto/skill";
import { by, directBy, GameWidth } from "../../../../util";

export default new SkillProto(16, '月之净化', '血量少于一半时召唤出月亮图腾，对敌人造成持续伤害')
    .standing(30)
    .initListen('nhpchange', (vita, skill) => e => {
        if ((e.value[1] << 1) >= vita.prop.hp || skill.data.executed) return;
        skill.data.executed = true;
        skill.execute();
    })
    .init(function (data) {
        data.executed = false;
    })
    .execute(function () {
        let vita = this.vita;
        const flyer = new Flyer(new Graphics(), function (g) {
            g.position.set(GameWidth >> 1, 120);
            let sprite = new Sprite(directBy('monst/6/skill/0.png'));
            sprite.anchor.set(0.5, 0.5);
            sprite.position.set(0, 0);
            sprite.alpha = 0;
            g.addChild(sprite);
            this.sprite2 = sprite;
            let ring = new Sprite(by('./res/util/monst/5/line.png'));
            ring.anchor.set(0.5, 0.5);
            g.addChild(ring);
            this.ring = ring;
        }).from(vita).onTime(function (timer) {
            if (timer > 120) return;
            if (timer > 60) {
                this.sprite2.alpha = (timer - 60) / 60;
                return;
            }
            let g = this.root;
            g.clear();
            g.beginFill(0xff0000, 0.1);
            g.drawCircle(0, 0, timer * 12);
            g.endFill();
            /**
             * @type {Graphics}
             */
            let s = this.ring;
            let scale = timer / 60 * 18;
            s.scale.set(scale, scale);
            s.alpha = (90 - timer) / 90;
        }).onTime(timer => {
            if (timer % 60 != 30) return;
            let hits = vita.world.selectableVitas().filter(v => v.group != vita.group);
            hits.forEach(enemy => {
                let affect = new Affect(this, vita, enemy);
                affect.harm.common = vita.prop.atk * 0.25;
                affect.setout();
            });
        })
        vita.on('dead', e => {
            flyer.die();
        })
        vita.world.parallelContainer.addChild(flyer.root);
    });