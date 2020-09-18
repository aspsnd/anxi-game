import { Container, Sprite, TextStyle, Text } from "pixi.js";
import { ForeverWorld, World } from "../anxi/atom/world";
import { PIXIRouter } from "../lib/router";
import { directBy, gameTink, gameApp, by } from "../util";
import { cardDatas } from "../data/card/card";
import { Role } from "./atom/role";
import { simpleCombine } from "../pod/home/combine";
import { RoleProto } from "../anxi/proto/role";
import { Instructer } from "../anxi/instruct/instructor";
import { GUI } from "./gui";
import { Monst } from "./atom/monst";

export class RealWorld extends ForeverWorld {
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
        window.RealWorld = this;
        this.container = container;
        /**
         * @test
         */
        document.addEventListener('keydown', e => {
            if (e.key == 'p') {
                this.running ? this.stop() : this.start();
            }
        });
        setTimeout(_ => {
            this.loadCard(cardDatas[0]);
        }, 100)
    }
    record
    init(record) {
        let all = this;
        this.record = record;
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
                cardDatas.forEach(cd => {
                    let s = gameTink.button([
                        gameApp.loader.resources[cd.card[0]].texture,
                        gameApp.loader.resources[cd.card[1]].texture,
                        gameApp.loader.resources[cd.card[2]].texture,
                    ], ...cd.position);
                    data.mapCards[cd.index] = s;
                    s.anchor.x = 0.5;
                    s.anchor.y = 0.5;
                    s.tap = e => {
                        if (!all.record.opened.includes(cd.index)) return;
                        all.loadCard(cd);
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
                        sprite._textures[1] = gameApp.loader.resources[srcs[1]].texture;
                        sprite._textures[2] = gameApp.loader.resources[srcs[2]].texture;
                    } else {
                        sprite._textures[1] = gameApp.loader.resources[srcs[0]].texture;
                        sprite._textures[2] = gameApp.loader.resources[srcs[0]].texture;
                    }
                })
            }
        });
        router.register('world', {
            initer(container, data) {
                all.container.addChild(container);
            },
            refresher(container, data) {
                let carddata = data.carddata;
                let world = data.world = new World(carddata, all.roles, container);
                window.world = world;
                container.visible = true;
                world.landIn(all);
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
        window.simpleCombine = simpleCombine;
        this.loadRoles(record.roles);
        router.start();
    }
    /**
     * @type {Role[]} roles 
     */
    roles
    /**
     * @param {RoleProto[]} roles 
     */
    loadRoles(roles) {
        this.roles = [];
        roles.forEach((_role, index) => {
            let role = new Role(_role);
            new GUI(role, index == 0);
            this.roles.push(role);
            role.use(Instructer.player(index == 0 ? Instructer.defaultPlayer : Instructer.extraPlayer));
        });
        window.role = this.roles[0];
        simpleCombine.load(this.roles);
        // new QuickOpen(this.roles);
    }
    loadCard(carddata) {
        this.router.pageHandlers['world'].data = {
            carddata
        }
        this.router.to('world');
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