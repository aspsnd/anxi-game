import { Container, Sprite, TextStyle, Text } from "pixi.js";
import { ForeverWorld, World } from "../anxi/atom/world";
import { PIXIRouter } from "../lib/router";
import { directBy, gameTink, by, GTip, GDanger } from "../util";
import { cardDatas } from "../data/card/card";
import { Role } from "./atom/role";
import { simpleCombine } from "../pod/home/combine";
import { RoleProto } from "../anxi/proto/role";
import { GUI } from "./gui";
import { RecordController } from "../record/record";
import { SuperInstructor } from "../anxi/instruct/inst";
import { SingleTalent } from "../pod/home/talent";
import { exposeToWindow, isMobile } from "../boot";
import { HandShakeContainer, HandShake } from "./gui/hand";
import { AnxiError } from "../anxi/error/base";
import { getWS } from "../net/net";
import { SuperInstructorNet } from "../anxi/instruct/netinst";
import { NetWorld } from "../anxi/atom/netWrold";

export class RealWorld extends ForeverWorld {
    /**
     * 不确定是否在关卡内时的随机数
     */
    random(){
        return this.incarding ? this.cardWorld.random() : Math.random();
    }
    incarding = false;
    /**
     * @type {World | NetWorld}
     */
    cardWorld
    /**
     * @type {RealWorld}
     */
    static instance
    /**
     * @type {Container}
     */
    container
    constructor(app, container) {
        super(app);
        RealWorld.instance = this;
        this.container = container;
    }
    record
    /**
     * @type {HandShake}
     */
    handContainer = HandShakeContainer()
    init(record) {
        let all = this;
        this.record = record;
        if (record.net) {
            this.ws = getWS();
            let loading = new ZY.myAler.Loading(record.isHomer ? '等待追随者...' : '加入中');
            this.ws.send({
                global: true,
                name: 'enterWorld',
                value: record.rrid,
                isHomer: record.isHomer
            })
            this.ws.once('enterWorld', e => {
                if (e.value) {
                    loading.remove();
                    new GTip('联机成功');
                } else {
                    loading.remove();
                    new ZY.myAler.Aler('联机失败,请刷新重试');
                    this.world.container.visible = false;
                }
            })
            if (!record.isHomer) {
                this.ws.on('wantCard', e => {
                    let cardIndex = e.value;
                    let cardData = cardDatas[cardIndex];
                    let cardName = cardData.name;
                    new ZY.myAler.Question(`【邀请】 是否加入关卡《${cardName}》?`, bool => {
                        if (!bool) {
                            this.ws.send({
                                global: true,
                                value: false,
                                name: 'enterCard'
                            })
                        } else {
                            let role1 = e.from.role;
                            this.loadNetRole(role1, 0, false);
                            all.loadCard(cardData);
                            this.ws.send({
                                global: true,
                                value: true,
                                name: 'enterCard',
                                role: this.netRole
                            });
                        }
                    });
                })
            }
        }
        let router = this.router = new PIXIRouter();
        this.container.removeChildren();
        router.register('map', {
            initer(container, data) {
                data.mapCards = [];
                all.container.addChild(container);
                let bg = new Sprite(directBy('map/bg.png'));
                container.addChild(bg);
                let combineSprite = data.combineSprite = new BaseTool(by('./res/util/gui/combine.png')).useText('合 成').appendTo(container, 50, 530);
                combineSprite.tap = _ => {
                    router.to('combine');
                };
                let talentSprite = new BaseTool(by('./res/util/gui/talent.png')).useText('天 赋').appendTo(container, 140, 530);
                talentSprite.tap = _ => {
                    router.to('talent');
                    // new ZY.myAler.Aler('该功能暂不开放，敬请期待！');
                }
                cardDatas.forEach(cd => {
                    let s = gameTink.button([
                        by(cd.card[0]),
                        by(cd.card[1]),
                        by(cd.card[2]),
                    ], ...cd.position);
                    data.mapCards[cd.index] = s;
                    s.anchor.x = 0.5;
                    s.anchor.y = 0.5;
                    s.tap = e => {
                        if (!all.record.opened.includes(cd.index)) return;
                        if (all.record.net) {
                            if (all.record.isHomer) {
                                all.ws.send({
                                    global: true,
                                    name: 'wantCard',
                                    value: cd.index,
                                    role: all.roles[0].toPlainObject()
                                });
                                let load = new ZY.myAler.Loading('请等待伙伴同意加入');
                                all.ws.once('enterCard', e => {
                                    if (e.value) {
                                        let role2 = e.from.role;
                                        all.loadNetRole(role2, 1, false);
                                        load.remove();
                                        all.loadCard(cd);
                                    }
                                });
                            } else {
                                new ZY.myAler.Aler('您不是存档创建者，无法加入关卡');
                            }
                        } else {
                            all.loadCard(cd);
                        }
                    }
                    container.addChild(s);
                });
            },
            refresher(container, data) {
                container.visible = true;
                data.mapCards.forEach((sprite, index) => {
                    let canIn = all.record.opened.includes(index);
                    let srcs = cardDatas[index].card;
                    if (canIn) {
                        sprite._textures[1] = by(srcs[1]);
                        sprite._textures[2] = by(srcs[2]);
                    } else {
                        sprite._textures[1] = by(srcs[0]);
                        sprite._textures[2] = by(srcs[0]);
                    }
                })
            }
        });
        router.register('world', {
            initer(container, data) {
                all.container.addChild(container);
            },
            refresher(container, data) {
                all.incarding = true;
                let carddata = data.carddata;
                let world = all.cardWorld = data.world = record.net ? new NetWorld(carddata, all.roles, container) : new World(carddata, all.roles, container);
                container.visible = true;
                world.landIn(all);
                world.once('die', e => {
                    data.world = null;
                });
            },
            disolver(container){
                container.visible = false;
                all.incarding = false;
            }
        });
        router.register('combine', {
            initer(container, data) {
                simpleCombine.hide = _ => {
                    router.back();
                }
                all.container.addChild(container);
            },
            refresher(container, data) {
                simpleCombine.show();
            }
        }, simpleCombine.container, _ => {
            simpleCombine.init();
        });
        router.register('talent', {
            initer(container, data) {
                SingleTalent.hide = _ => {
                    router.back();
                }
                all.container.addChild(container);
            },
            refresher() {
                SingleTalent.show();
            }
        }, SingleTalent.container, _ => {
            SingleTalent.init();
        });
        this.record.net ? this.loadNetRole(record.roles[0], record.isHomer ? 0 : 1, true) : this.loadRoles(record.roles);
        router.start();
    }
    /**
     * @type {Role[]} roles 
     */
    roles = [];
    /**
     * @param {RoleProto[]} roles 
     */
    loadRoles(roles) {
        if (isMobile && roles.length > 1) throw new AnxiError('移动端设备不支持多人模式');
        roles.forEach((_role, index) => {
            let role = new Role(_role);
            new GUI(role, index == 0);
            this.roles.push(role);
            role.use(isMobile ? SuperInstructor.mobilePlayer() : SuperInstructor.player(index == 0 ? SuperInstructor.defaultPlayer : SuperInstructor.extraPlayer));
            if (isMobile) {
                this.handContainer.initRole(role);
            }
        });
        if (exposeToWindow) {
            window.role = this.roles[0];
            window.role2 = this.roles[1];
        }
        simpleCombine.load(this.roles);
        SingleTalent.load(this.roles);
    }
    /**
     * @param {RoleProto} roleobj 
     */
    loadNetRole(roleobj, index, self = true) {
        if (self) this.netRole = roleobj;
        let role = new Role(roleobj);
        new GUI(role, index == 0);
        this.roles[index] = role;
        if (self) {
            role.use(isMobile ? SuperInstructorNet.mobilePlayer() : SuperInstructorNet.player(SuperInstructorNet.defaultPlayer));
            simpleCombine.load([role]);
            SingleTalent.load([role]);
        }
        if (exposeToWindow) {
            window['role' + index] = role;
        };
    }
    loadCard(carddata) {
        this.router.pageHandlers['world'].data = {
            carddata
        }
        this.router.to('world');
    }
    save() {
        this.record.roles = this.roles.map(role => role.toPlainObject());
        RecordController.saveRecord(this.record.index, this.record);
    }
    quitCard() {
        this.router.to('map');
    }
}
export class BaseTool extends Sprite {
    constructor() {
        super(...arguments);
        this.anchor.set(0.5, 0.5);
    }
    static textStyle = new TextStyle({
        fontSize: 20,
        fill: 0xffffff,
        stroke: 0xd5ad23,
        strokeThickness: 3
    })
    text
    useText(_text) {
        let text = new Text(_text, BaseTool.textStyle);
        text.anchor.set(0.5, 0.5);
        this.addChild(text);
        this.text = text;
        gameTink.makeInteractive(this);
        text.visible = false;
        this.over = _ => {
            text.visible = true;
        }
        this.out = _ => {
            text.visible = false;
        }
        return this;
    }
    /**
     * @param {PIXI.Container} parent 
     */
    appendTo(parent, x = 0, y = 0) {
        this.position.set(x, y);
        parent.addChild(this);
        return this;
    }
}