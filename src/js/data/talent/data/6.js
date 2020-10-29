import { Container, Sprite } from "pixi.js";
import { Affect } from "../../../anxi/affect";
import { Flyer } from "../../../anxi/atom/flyer";
import { StateCache } from "../../../anxi/controller/state";
import { SkillProto } from "../../../anxi/proto/skill";
import { Point, Polygon } from "../../../anxi/shape/shape";
import { directBy } from "../../../util";

export default new SkillProto(6, '钢铁化身', '每累计损失20%生命值，增加自身4-12防御，并由自身产生一次使敌人眩晕的爆炸，防御最多增加8次。')
    .active(false)
    .init(data => {
        data.lostHP = 0;
        data.power = 0;
        data.full = false;
    })
    .whenReCacu(['addlevel'])
    .initProp('def', (value, vita, skill) => skill.data.power * Math.min(12, ((vita.level / 3) | 0) * 2 + 2))
    .initListen('nhpchange', (vita, skill) => e => {
        if (!e.value) return;
        let [rhp, nhp] = e.value;
        let lost = rhp - nhp;
        if (lost > 0) {
            skill.data.lostHP += lost;
            if (skill.data.lostHP >= vita.prop.hp * 0.2) {
                skill.data.lostHP = 0;
                let full = false;
                if (!skill.data.full) {
                    skill.data.power++;
                    if (skill.data.power == 8) {
                        skill.data.full = true;
                        full = true;
                    }
                }
                vita.compute();
                skill.execute(full);
            }
        }
    })
    .execute(function (fullact = false) {
        let { vita } = this;
        let { x } = vita;
        let y = vita.y + vita.height;
        if (fullact) {
            let sprite = window.ear = new Sprite(directBy('talent/6/1.png'));
            sprite.anchor.set(1, 1);
            sprite.alpha = 0;
            sprite.position.set(-1, 3);
            this.vita.viewController.blocks.head.addChild(sprite);
            this.vita.viewController.toDestory.push(sprite);
            let tick = 1;
            this.vita.on('timing', e => {
                sprite.alpha = tick / 30;
                let scale = 3 - tick / 15;
                sprite.scale.set(scale, scale);
                return ++tick > 30;
            })
        }
        new Flyer(new Container(), function (c) {
            c.position.set(x, y);
            vita.world.vitaContainer.addChild(c);
            vita.viewController.toDestory.push(c);
            for (let i = 0; i < 4; i++) {
                let index = i;
                let big = [0, 3].includes(index);
                new Flyer(new Sprite(directBy('talent/6/0.png')), s => {
                    s.alpha = 0;
                    let scale = big ? 1 : 0.65;
                    s.scale.set(scale, scale);
                    s.position.set((1.5 - i) * 60, -40);
                    s.anchor.set(0.5, 1);
                    c.addChild(s);
                }).useLiveTime(30).bindTo(vita).onTime(function (timer) {
                    if (timer <= 10) {
                        this.root.alpha = timer / 10;
                    };
                    if ((timer == 10) && !big) {
                        this.useConstSpeed([0, 3]);
                    }
                    if ((timer == 15) && big) {
                        this.useConstSpeed([0, 4]);
                    }
                    if (timer > 20) {
                        this.root.alpha = 3 - timer / 10;
                    }
                })
            }
        }).useLiveTime(30).bindTo(vita).checkFromArray([15])
            .useNoGroupFilter()
            .useHitAreaGetter((x, y) => new Polygon(
                new Point(x - 90, y),
                new Point(x + 90, y),
                new Point(x + 90, y - 80),
                new Point(x - 90, y - 80),
            )).useAffectGetter((from, to) => new Affect(this, from, to, affect => {
                affect.debuff = [{
                    state: StateCache.dizzy,
                    last: 60
                }];
                affect.harm.common = 20 + vita.level * 5 + vita.prop.hp * 0.08 + vita.prop.def * 0.25;
            }));
    })