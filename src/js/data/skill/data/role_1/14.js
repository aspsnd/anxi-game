import { Container, Rectangle, Sprite, Texture } from "pixi.js";
import { Affect } from "../../../../anxi/affect";
import { Flyer } from "../../../../anxi/atom/flyer";
import { StateCache } from "../../../../anxi/controller/state";
import { SkillProto } from "../../../../anxi/proto/skill";
import { Point, Polygon } from "../../../../anxi/shape/shape";
import { RealWorld } from "../../../../po/world";
import { by, directBy, gameSound, r2a, tween } from "../../../../util";

export default new SkillProto(14, '弑神星云', '进入最长8秒的蓄力，蓄力中保持浮空状态，结束蓄力时向前发射星云箭，随蓄力时间提升伤害')
    .active(true)
    .lost(180)
    .init(function (data) {
        data.beginTimer = 0;
        data.preparing = false;
    })
    .standing(60 * 8 + 1)
    .execute(function () {
        let data = this.data;
        if (data.preparing) return console.error('使用了不合格的外部设备');
        data.preparing = true;
        let vita = this.vita;
        let { face, timer } = vita;
        vita.stateController.removeState(StateCache.run, StateCache.go, StateCache.jump, StateCache.jumpSec, StateCache.drop);
        vita.stateController.setStateInfinite(StateCache.hover, true);
        this.beginTimer = timer;
        let x = vita.x;
        let y = vita.centerY - 10;
        let [headAppear, lineAppear, lineWait, lightWait, lightMove] = [30, 50, [0, 15, 30], 50, 120];
        let parent = new Flyer(new Container(), container => {
            container.position.set(x, y + 12);
            container.scale.set(face, 1);
            vita.world.vitaContainer.addChild(container);
        }).bindTo(vita);
        let head = new Sprite(by('./res/util/role/1/shadow/53.png'));
        let headFlyer = new Flyer(head, _ => {
            head.anchor.set(0.5, 0.5);
            head.alpha = 0;
            head.scale.set(0, 0);
            head.position.set(120, 0);
        }).bindTo(parent).addTo(parent).useAngleGetter(timer => timer * 3)
            .onTime(time => {
                if (time <= headAppear) {
                    let rate = time / headAppear
                    head.alpha = rate;
                    head.scale.set(rate, rate);
                }
            });
        let baseTexture = directBy('role/1/shadow/55.png');
        let lines = [];
        for (let i = 0; i < 3; i++) {
            let j = i;
            let line = new Flyer(new Sprite(new Texture(baseTexture, new Rectangle(j * 25, 0, 0, baseTexture.height))), g => {
                g.anchor.set(0, 0.5);
                g.scale.set(-1, 1);
                g.position.set(105, 0);
            }).bindTo(parent).addTo(parent).onTime(function (timer) {
                if (timer > headAppear + lineWait[j] && timer <= headAppear + lineAppear + lineWait[j]) {
                    this.root.texture.frame = new Rectangle(j * 25, 0, 250 * (timer - headAppear - lineWait[j]) / lineAppear, baseTexture.height);
                }
            });
            lines.push(line);
        }
        let interval = 75;
        let oneTime = 6;
        let lightTexture = [directBy('role/1/shadow/52.png'), directBy('role/1/shadow/51.png')];
        let lights = [];
        let sound = gameSound.showInCard('./res/util/role/1/sound/40.m4a');
        parent.onTime(function (timer) {
            if (timer > 60 * 8 - lightMove) return;
            if (timer < 60) return;
            for (let i = 0; i < oneTime; i++) {
                let endx = 150 - interval * i - RealWorld.instance.random() * interval;
                let endy;
                if (endx < -220) {
                    let rate = (endx + 220) / -80;
                    endy = (16 - Math.abs(0.5 - rate) * 8) * (rate + (1 - rate) * RealWorld.instance.random()) * (RealWorld.instance.random() > 0.5 ? 1 : -1);
                } else if (endx < 110) {
                    let rate = (endx - 110) / -330;
                    endy = 8 * 2 * (RealWorld.instance.random() - 0.5) * rate;
                } else {
                    endy = 8 * 2 * (RealWorld.instance.random() - 0.5);
                }
                let beginY = 30 * (endy > 0 ? 1 + RealWorld.instance.random() : -1 - RealWorld.instance.random());
                let beginX = (endx - 90) * 0.3 + endx;
                let distance = ((endy - beginY) ** 2 + (endx - beginX) ** 2) ** 0.5;
                let angle = r2a(Math.asin((endy - beginY) / distance));
                if (endx - beginX < 0 && angle != 0) {
                    if (endx > 110) {
                        angle += angle > 0 ? 90 : -90;
                    } else {
                        angle = 180 - angle;
                    }
                }
                let light = new Flyer(new Sprite(lightTexture[0]), lightSprite => {
                    lightSprite.position.set(endx, beginY);
                    lightSprite.angle = endy < 0 ? 90 : -90;
                    lightSprite.alpha = 0;
                    lightSprite.isAdding = false;
                }).bindTo(parent).addTo(parent).useConstSpeed(distance / lightMove).useConstAngle(angle)
                    .onTime(timer => {
                        if (timer <= lightMove) {
                            light.root.alpha = timer / lightMove;
                            return;
                        }
                    });
                light._speed = light.constSpeed;
                light.once(`timer_${lightMove + 1}`, e => {
                    if (light.dead) return;
                    light.root.texture = lightTexture[1];
                    light.useConstSpeed(0);
                    light.root.alpha = 0.8;
                    light.root.anchor.set(0.5, 0.5);
                });
                lights.push(light);
            }
        });
        let ended = false;
        parent.once(`timer_${this.proto.stand - 1}`, e => {
            if (ended) return;
            this.cancel();
        })
        data.onInterrupt = _ => {
            data.preparing = false;
            data.disappear();
            vita.stateController.setStateInfinite(StateCache.hover, false);
        }
        data.disappear = () => {
            sound.paused = true;
            sound.complete = true;
            ended = true;
            parent.timeHandler = [];
            lights.forEach(light => {
                let lasttime = (15 * (1 + RealWorld.instance.random())) | 0;
                light.timeHandler = [];
                light.timer = 0;
                light.onTime(t => {
                    light.root.alpha = 1 - t / lasttime;
                }).useLiveTime(lasttime).useConstAngle(light.constAngle + 180).useConstSpeed(light._speed * (3 + 2 * RealWorld.instance.random()));
            });
            lines.forEach(line => {
                line.die();
            });
            lines = null;
            lights = null;
            headFlyer.timer = 0;
            let lastTime = 30;
            headFlyer.useLiveTime(lastTime).onTime(timer => {
                headFlyer.root.alpha = 1 - timer / lastTime;
                let scale = 1 + timer * 0.08
                headFlyer.root.scale.set(scale, scale);
            }).on('dead', e => {
                headFlyer = null;
            })
            parent.timer = 0;
            parent.useLiveTime(lastTime);
            parent = null;
        }
        data.onendstore = storeTime => {
            this.executing = false;
            let hitrate = 1.1 ** (2 * storeTime / 30);
            vita.stateController.removeState(StateCache.attack);
            vita.stateController.setStateInfinite(StateCache.hover, false);
            let speed = 12;
            let head = new Sprite(directBy('role/1/shadow/56.png'));
            gameSound.showInCard('./res/util/role/1/sound/41.m4a').speed = 0.5;
            new Flyer(new Sprite(directBy('role/1/shadow/57.png')), sprite => {
                sprite.anchor.set(1, 0.5);
                sprite.position.set(x + 120 * face, y + 12);
                head.anchor.set(0.5, 0.5);
                head.position.set(0, 0);
                sprite.addChild(head);
            }).from(vita).useConstSpeed(speed).useConstAngle(face * 90 - 90)
                .useLiveTime(120).onTime(timer => {
                    head.angle += 5;
                }).useHitAreaGetter((x, y) =>
                    new Polygon(
                        new Point(x, y - 55),
                        new Point(x, y + 55),
                        new Point(x - face * 150, y + 55),
                        new Point(x - face * 150, y - 55)
                    ))
                .checkFromBool(true)
                .useFilter(vitas => vitas.filter(v => v.group != vita.group))
                .useAffectGetter((from, to) => {
                    let affect = new Affect(this, from, to);
                    affect.harm.common = (vita.prop.atk * hitrate) | 0;
                    affect.harm.absolute = (20 * hitrate) | 0;
                    affect.debuff.push({
                        state: StateCache.beHitBehind,
                        last: 15
                    }, {
                        state: StateCache.dizzy,
                        last: (storeTime / 5 + 1) | 0
                    });
                    return affect;
                }).createFrom(this);
        }
    })
    .useCommonActionData({
        hand_r: {
            changedFrame(ps) {
                return Math.min(ps.timer, 5)
            },
            value: tween([14, 37, 60], 5, [14, 37, -15])
        },
        hand_l: {
            changedFrame(ps) {
                return Math.min(ps.timer, 5)
            },
            value: tween([14, 35, 105], 5, [14, 37, 10])
        },
        weapon: {
            changedFrame(ps) {
                return Math.min(ps.timer, 5)
            },
            value: tween([14, 33, 60], 5, [34, 33, 0])
        },
        wing: {
            changedFrame(ps) {
                return Math.min(ps.timer, 5)
            },
            value: tween([0, 39, 0], 5, [0, 39, -18])
        },
        head: {
            changedFrame(ps) {
                return Math.min(ps.timer, 5)
            },
            value: tween([16, 20, 0], 5, [16, 20, 10])
        },
    })
    /**
     * 当结束蓄力或最大蓄力时触发
     */
    .cancel(function () {
        let data = this.data;
        if (!data.preparing) return console.error('使用了不合格的外部设备');
        data.preparing = false;
        data.disappear();
        let role = this.vita;
        let timer = role.timer;
        let findTime = timer - this.beginTimer;
        if (findTime <= 0 || findTime > 8 * 60 + 5) return;
        data.onendstore(findTime);
        data.beginTimer = 0;
    })
    .onceInit(skill => {
        skill.on('beinterrupt', e => {
            skill.data.onInterrupt();
        })
    })