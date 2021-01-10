import { Application, Container, Sprite } from "pixi.js";
import * as PIXI from "pixi.js";
import { WallProtos } from "../../data/wall/wall";
import { Role } from "../../po/atom/role";
import { by, GameHeight, gameSound } from "../../util";
import { Atom } from "../atom";
import { StepManager } from "../card/step";
import { Vita } from "./vita";
import { Wall } from "../conster/wall";
import { Monst } from "../../po/atom/monst";
import { MonstProtos } from "../../data/monst/all";
import { QuickOpen } from "../../po/gui/open";
import { RealWorld } from "../../po/world";
import { HPBarController } from "../controller/hp.view";
import Dust from "pixi-dust";
import { SuperInstructor } from "../instruct/inst";
import { GlobalEventCaster } from "../instruct/global";
import { exposeToWindow, isMobile, openDropMonst } from "../../boot";

export class ForeverWorld extends Atom {
    /**
     * @param {Application} app 
     */
    constructor(app) {
        super({});
        app.ticker.add(this.onTimer.bind(this));
    }
}
export class World extends Atom {
    /**
     * 相对掉宝倍率
     */
    dropRate = 1
    /**
     * @type {Wall[]}
     */
    walls = []
    /**
     * @type {Wall}
     */
    ground
    container
    parallelContainer = new Container()
    baseContainer = new Container()
    handContainer = RealWorld.instance.handContainer
    /**
     * @type {World}
     */
    static instance
    dust = new Dust(PIXI);
    /**
     * @param {Role[]} roles 
     * @param {Container} container 
     */
    constructor(carddata, roles, container) {
        super();
        this.on('timing', e => {
            this.dust.update();
        })
        this.on('runchange', e => {
            if (e.value) {
                gameSound.runInCard();
            } else {
                gameSound.stopInCard();
            }
        }, true)
        World.instance = this;
        this.bg = gameSound.showCardBg(carddata);
        QuickOpen.bind(this);
        this.container = container;
        this.container.addChild(this.baseContainer, this.parallelContainer, this.handContainer, this.guiContainer, this.toolContainer);
        this.baseContainer.addChild(this.wallContainer, this.vitaContainer);
        this.initCard(carddata);
        this.stepManager = new StepManager(this).bind(roles);
        roles.forEach((role, index) => this.initRole(role, index));
        /**
         * @test
         */
        if (openDropMonst) {
            let comt = GlobalEventCaster.on('keydown', ee => {
                if (!this.running) return;
                let e = ee.value;
                if (48 <= e.keyCode && e.keyCode <= 57) {
                    e.preventDefault();
                    let monst = new Monst(MonstProtos[parseInt(e.key) - 1]);
                    if (exposeToWindow) {
                        window.monst = monst;
                    }
                    new HPBarController(monst);
                    this.vitaContainer.addChild(monst.viewController.view);
                    monst.link(this);
                    monst.use(e.ctrlKey ? SuperInstructor.artificialIntelligence() : SuperInstructor.player(SuperInstructor.testPlayer));
                    this.vitas[monst.id] = monst;
                    monst.x = 600 + this.stepManager.screenLeft;
                    monst.y = 250;
                    monst.landIn(this);
                }
            });
            this.once('die', e => {
                GlobalEventCaster.removeHandler(comt);
            })
        }
        this.once('die', e => {
            gameSound.closeCardBg();
            this.vitas.forEach(vita => {
                vita instanceof Monst && vita.viewController.view.destroy({
                    children: true
                });
                vita?.viewController?.toDestory.forEach(s => s._destroyed || s.destroy());
            })
            this.vitas = [];
            World.instance = null;
            QuickOpen.debind();
            this.roles.forEach(role => {
                this.vitaContainer.removeChild(role.viewController.view);
                this.guiContainer.removeChild(role.gui.basebar);
                this.guiContainer.removeChild(role.gui.detailContainer);
            });
            this.toDestory.forEach(s => s._destroyed || s.destroy());
            this.container.removeChildren();
        })
    }
    wallContainer = new Container();
    guiContainer = new Container();
    vitaContainer = new Container();
    toolContainer = new Container();
    /**
     * @type {Vita[]}
     */
    vitas = []
    /**
     * @type {Role[]}
     */
    roles = []
    /**
     * @type {Atom[]}
     */
    elseAtoms = []
    /**
     * @type {import("../define/type").CardData}
     */
    carddata
    /**
     * @param {Role} role 
     */
    initCard(carddata) {
        this.carddata = carddata;
        let back = new Sprite(by(carddata.back));
        this.wallContainer.addChild(back);
        this.initGround(carddata.ground);
        carddata.walls?.forEach(_wall => this.initWall(_wall));
    }
    /**
     * 初始化地面【特殊墙体】 也可以全用墙体实现地面
     * @param {number} _ground 
     */
    initGround(_ground) {
        let ground = new Wall(WallProtos[_ground]);
        ground.x = -50;
        ground.y = GameHeight - ground.height;
        this.wallContainer.addChild(ground.sprite);
        this.walls.push(ground);
        this.ground = ground;
    }
    /**
    * 初始化普通墙体
    * @param [number,number,number] _wall 
    */
    initWall(_wall) {
        let wall = new Wall(WallProtos[_wall[0]]);
        wall.x = _wall[1];
        wall.y = _wall[2];
        this.wallContainer.addChild(wall.sprite);
        this.walls.push(wall);
    }
    /**
     * @param {Role} role 
     * @param {number} index 
     */
    initRole(role, index) {
        this.vitaContainer.addChild(role.viewController.view);
        this.guiContainer.addChild(role.gui.basebar);
        isMobile || this.guiContainer.addChild(role.gui.detailContainer);
        role.refresh();
        role.link(this);
        this.vitas[role.id] = role;
        this.roles.push(role);
        role.x = 100 + index * 50;
        role.y = 180;
        role.landIn(this);
    }
    /**
     * 存活且可选中的角色 不可选中 == 不会受到任何效果， 但不会防止曾经受到的持续效果
     */
    selectableVitas() {
        return this.vitas.filter(vita => vita?.selectable && !vita.dead);
    }
    win = false
    /**
     * 打开退出通道
     */
    openQuit() {
        this.win = true;
    }
    cross() {
        let cards = this.carddata.crossOpen;
        cards.forEach(c => {
            this.carddata.whenCross?.();
            if (!RealWorld.instance.record.opened.includes(c)) {
                RealWorld.instance.record.opened.push(c);
                this.carddata.whenFirstCross?.();
            }
        })
    }

    end(save) {
        if (save) {
            RealWorld.instance.save();
        }
        this.running = false;
        this.roles.forEach(role => role.refresh());
        this.die();
        RealWorld.instance.quitCard();
    }
    /**
     * @type {Sprite[]}
     */
    toDestory = []
}