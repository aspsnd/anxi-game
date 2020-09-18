import { Application, Container, Sprite } from "pixi.js";
import { WallProtos } from "../../data/wall/wall";
import { Role } from "../../po/atom/role";
import { by, GameHeight } from "../../util";
import { Atom } from "../atom";
import { StepManager } from "../card/step";
import { Vita } from "./vita";
import { Wall } from "../conster/wall";
import { Monst } from "../../po/atom/monst";
import { MonstProtos } from "../../data/monst/all";
import { Instructer } from "../instruct/instructor";

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
     * @type {Wall[]}
     */
    walls = []
    /**
     * @type {Wall}
     */
    ground
    container
    /**
     * @param {Role[]} roles 
     * @param {Container} container 
     */
    constructor(carddata, roles, container) {
        super();
        this.container = container;
        container.addChild(this.wallContainer, this.guiContainer, this.vitaContainer, this.toolContainer);
        this.initCard(carddata);
        roles.forEach((role, index) => this.initRole(role, index));
        this.stepManager = new StepManager(this).bind(roles);
        /**
         * @test
         */
        document.addEventListener('keydown', e => {
            if (!this.running) return;
            if (48 <= e.keyCode && e.keyCode <= 57) {
                e.preventDefault();
                let monst = new Monst(MonstProtos[parseInt(e.key) - 1]);
                window.monst = monst;
                this.vitaContainer.addChild(monst.viewController.view);
                monst.link(this);
                monst.use(e.ctrlKey ? Instructer.artificialIntelligence() : Instructer.player(Instructer.testPlayer));
                this.vitas[monst.id] = monst;
                monst.x = 600 + this.stepManager.screenLeft;
                monst.y = 250;
                monst.landIn(this);
            }
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
        role.link(this);
        role.refresh();
        this.vitas[role.id] = role;
        this.roles.push(role);
        role.x = 100 + index * 50;
        role.y = 180;
        role.landIn(this);
    }
}