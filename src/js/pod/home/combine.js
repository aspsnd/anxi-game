import { ToolGUI } from "./base";
import { Graphics, Container } from "pixi.js";
import { ObjWrap } from "../guis/base/block";
import { TextButton } from "../guis/base/button";
import { SingleBag } from "../guis/base/singleBag";
import { by, GameHeight, GameWidth } from "../../util";
import { SingleThing } from "../guis/base/bagUitl";
import { SimpleDetail } from "../guis/base/detail";
import { CombineUtil } from "../../data/combine/util";
// import { ThingProto } from "../../data/bag/base";
// import { Game } from "../../po/game";
import { getDisUrl, MaterialKind, getProto, getSprite } from "../../anxi/define/util";
import { Role } from "../../po/atom/role";

class Combine extends ToolGUI {
    static INSTANCE = new Combine();
    get role() {
        return this.roles[this.roleIndex];
    }
    /**
     * @type {Role[]}
     */
    roles = []
    roleIndex = 0
    load(roles) {
        this.roles = roles;
        this.roleIndex = 0;
        this.bag.load(roles[0]);
        this.initRoleSelector();
    }
    constructor() {
        super();
    }
    init() {
        super.init();
        this.container.texture = by(this.textureUrl);
        this.initCommon();
    }
    /**
     * @type {ObjWrap[]}
     */
    tempWrap = []
    selectedThing = []
    addToSelect(sprite) {
        this.selectedThing.push(sprite);
        if (this.selectedThing.length == 3) {
            this.checkProduct();
        } else {
            this.clearProduct();
        }
    }
    checkProduct() {
        let result = CombineUtil.getProduct(this.selectedThing.map(sprite => getProto(sprite.thing)._id).sort());
        if (!result) return;
        this.nowThingProto = result.product;
        this.preWork.addChild(getSprite(result.product));
    }
    /**
     * @type {ThingProto}
     */
    nowThingProto = null;
    clearProduct() {
        this.preWork.removeChildren();
        this.preWork.addChild(this.preWork.text);
        this.nowThingProto = null;
    }
    initCommon() {
        let all = this;
        let wrap = new Graphics();
        wrap.position.set((GameWidth - 680) >> 1, (GameHeight - 400) >> 1);
        wrap.lineStyle(2, 0xefefda);
        wrap.beginFill(0x000000);
        wrap.drawRoundedRect(0, 0, 680, 400, 4);
        wrap.endFill();
        this.container.addChild(wrap);
        let temp1 = new ObjWrap('材 料');
        let temp2 = new ObjWrap('材 料');
        let temp3 = new ObjWrap('材 料');
        temp1.position.set(140, 25);
        temp2.position.set(40, 200);
        temp3.position.set(240, 200);
        this.tempWrap.push(temp1, temp2, temp3);
        wrap.addChild(...this.tempWrap);
        let preWork = new ObjWrap('产 物\n预 览');
        preWork.position.set(40, 300);
        wrap.addChild(preWork);
        let work = new ObjWrap('产 物');
        work.position.set(140, 130);
        wrap.addChild(work);
        let cbnBtn = new TextButton('合  成', 165, 310, {}, 100, 30).overColor();
        wrap.addChild(cbnBtn);
        this.preWork = preWork;
        this.work = work;
        let bag = new SingleBag();
        bag.position.set(350, 10);
        bag.pageCtrl.position.set(195, 360);
        bag.bagUtil.forEach(bu => bu.onTap(function () {
            if (all.selectedThing.length >= 3) return;
            if (this.count > 1) {
                this.count = this.count - 1;
            } else {
                bu.removeThing(this);
            }
            let tempThingSprite = new SingleThing(by(getDisUrl(this.thing)), { ...this.thing, count: 1 });
            tempThingSprite.baseThing = this.thing;
            tempThingSprite.removeChildren();
            tempThingSprite.over = _ => {
                SimpleDetail.show(tempThingSprite.thing, getProto(this.thing), tempThingSprite, all.container);
                tempThingSprite.out = _ => {
                    SimpleDetail.hide();
                }
            }
            all.addToSelect(tempThingSprite);
            tempThingSprite.onTap(_ => {
                all.selectedThing.splice(all.selectedThing.indexOf(tempThingSprite), 1);
                if (this.thing.kind == MaterialKind) {
                    this.count = this.count + 1;
                } else {
                    bu.addThing(this);
                }
                all.clearProduct();
                all.reDisplay();
            })
            all.reDisplay();
        }))
        this.bag = bag;
        wrap.addChild(bag);
        this.roleSelectWrap.position.set(140, 45);
        this.container.addChild(this.roleSelectWrap);
        cbnBtn.tap = _ => {
            let proto = this.nowThingProto;
            if (!proto) return;
            this.selectedThing.forEach(sprite => {
                this.role.reduceThing(sprite.baseThing, 1);
            })
            let thing = proto.new();
            this.role.getThing(thing);
            this.selectedThing = [];
            this.refreshTempCube();
            let workSprite = new SingleThing(by(proto.disUrl), thing);
            workSprite.over = _ => {
                SimpleDetail.show(thing, proto, workSprite, this.container);
                workSprite.out = _ => {
                    SimpleDetail.hide();
                }
                workSprite.out = undefined;
            }
            workSprite.tap = _ => {
                this.refresh();
            }
            this.work.addChild(workSprite);
            this.nowThingProto = null;
            Game.save();
        }
    }
    roleSelectWrap = new Container();
    initRoleSelector() {
        this.roleSelectWrap.removeChildren();
        this.roles.forEach((role, index) => {
            let nameBtn = new TextButton(role.name, 105 * index, 0, {}, 85, 30);
            this.roleSelectWrap.addChild(nameBtn);
            nameBtn.tap = () => {
                this.roleIndex = index;
                this.refresh();
            }
        })
    }
    reDisplay() {
        this.bag.bagUtil.forEach(bu => bu.reDisplay());
        this.tempWrap.forEach((wrap, index) => {
            wrap.removeChildren();
            wrap.addChild(wrap.text);
            if (this.selectedThing[index]) {
                wrap.addChild(this.selectedThing[index]);
            }
        });
    }
    refresh() {
        this.bag.load(this.role);
        this.refreshTempCube();
        this.preWork.removeChildren();
        this.preWork.addChild(this.preWork.text);
        this.work.removeChildren();
        this.work.addChild(this.work.text);
        this.nowThingProto = null;
        this.selectedThing = [];
    }
    refreshTempCube() {
        this.tempWrap.forEach(wrap => {
            wrap.removeChildren();
            wrap.addChild(wrap.text);
        })
    }

}
export const simpleCombine = Combine.INSTANCE;