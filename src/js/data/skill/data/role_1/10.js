import { Sprite } from "pixi.js";
import { Affect } from "../../../../anxi/affect";
import { StateCache } from "../../../../anxi/controller/state";
import { Attack } from "../../../../anxi/hurt/attack";
import { SkillProto } from "../../../../anxi/proto/skill";
import { Circle, Line, Point } from "../../../../anxi/shape/shape";
import { a2r, by, gameDust, tween } from "../../../../util";

export default new SkillProto(10, '天选', '每第三次攻击伤害减半，但会向前方射出一支额外的箭，随机带有以下某些效果[随暴击率提升概率]，瞄准/爆炸/眩晕/斩杀/中毒。【在空中时视为第三次且必定触发瞄准】')
    .execute(function (attack) {
        attack.harm.common >>= 1;
        let smallGoldArrowTextrue = by('./res/util/role/1/shadow/11.png');
        let role = this.vita;
        let face = role.face;
        let inair = role.inair();
        let { timer } = role;
        let { crt } = role.prop;
        let findAngle = inair || (Math.random() <= crt * 0.3);
        let willBoom = Math.random() < 0.4 + crt * 0.6;
        let boomRad = 50;
        let letDizzy = Math.random() < 0.15 + crt * 0.15;
        let killWeak = Math.random() < 0.1 + 0.4 * crt;
        let setPoison = Math.random() < 0.05 + crt * 0.65;
        let arrow = new Sprite(smallGoldArrowTextrue);
        let preTime = 15;
        let findTime = 4;
        let flyTime = 16;
        role.once(`timer_${timer + preTime}`, e => {
            if (attack.interrupted) return;
            let rx = role.x + 20 * face, ry = role.centerY + 15;
            arrow.anchor.set(1, 0.5);
            arrow.position.set(rx, ry);
            let speed = 25;
            arrow.angle = face == 1 ? 0 : 180;
            let vx = speed * face, vy = 0;
            if (findAngle) {
                let target = role.world.selectableVitas().filter(v => v.group != role.group).filter(v => ((v.x - rx) ^ face) > 0)[0];
                if (target) {
                    let cy = target.centerY - ry;
                    let cx = target.x - rx;
                    let tan = cy / cx;
                    let angle = Math.round(Math.atan(tan) * 180 / Math.PI);
                    if (face < 0) angle += 180;
                    arrow.angle = angle;
                    let r = a2r(angle);
                    vx = Math.cos(r) * 25;
                    vy = Math.sin(r) * 25;
                }
            };
            role.world.vitaContainer.addChild(arrow);
            let hit = false;
            for (let i = 1; i <= flyTime; i++) {
                role.once(`timer_${timer + preTime + findTime + i}`, e => {
                    if (hit) return;
                    arrow.x += vx;
                    arrow.y += vy;
                    let hitarea = new Line(new Point(arrow.x, arrow.y), new Point(arrow.x - vx * 2, arrow.y - vy * 2));
                    let enemys = role.world.selectableVitas().filter(v => v.group != role.group);
                    let hits = enemys.filter(v => hitarea.hit(v.getHitGraph()));
                    if (hits.length == 0) return;
                    hit = true;
                    role.once(`timer_${role.timer + 5}`, e => {
                        arrow._destroyed || arrow.destroy();
                    });
                    if (willBoom) {
                        let trueArea = new Circle(arrow.x, arrow.y, boomRad);
                        hits = enemys.filter(v => trueArea.hit(v.getHitGraph()));
                        gameDust.create(arrow.x, arrow.y, () => new Sprite(by('./res/util/role/1/shadow/12.png')), role.world.vitaContainer, 30, 0.05, true, 0, 360, 5, 30, 0, 3, undefined, undefined, 0.02, 0.08);
                    };
                    hits.forEach(vita => {
                        let affect = new Affect(this, role, vita);
                        affect.harm.common = role.prop.atk * 0.5;
                        if (killWeak) {
                            affect.harm.absolute = role.prop.atk * 3 * (1 - vita.varProp.hp / vita.prop.hp);
                        }
                        affect.debuff.push({
                            state: StateCache.beHitBehind,
                            last: 25
                        });
                        letDizzy && affect.debuff.push({
                            state: StateCache.dizzy,
                            last: 60
                        });
                        setPoison && affect.debuff.push({
                            state: StateCache.poison,
                            last: 60 * 5
                        });
                        affect.setout();
                    })
                })
            }
            role.once(`timer_${timer + preTime + findTime + flyTime + 1}`, e => {
                arrow._destroyed || arrow.destroy();
            })
        })
    })
    .init(function (data) {
        data.attackCount = 0;
    })
    .initListen(`createAttack`, (role, skill) => e => {
        if (role.stickingWall == null) {
            skill.data.attackCount = 3;
            skill.execute(e.value);
            return;
        }
        if (++skill.data.attackCount % 3 == 0) {
            skill.execute(e.value);
        }
    })