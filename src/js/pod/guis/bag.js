import { BaseGui } from "./gui";
import { Container, Graphics, Rectangle, Text, TextStyle } from "pixi.js";
import { SmallVita } from "./smallVita";
import { ObjWrap } from "./base/block";
import { WholePropBar, PropBar } from "./base/porpbar";
import { SingleBag } from "./base/singleBag";
import { TextButton } from "./base/button";
import { gameTink } from "../../util";
// import { EquipProtos } from "../../data/equip/all";
import { SimpleOperator } from "./base/operate";
// import { equipExtraProps } from "../../po/vita";
import { SimpleDetail } from "./base/detail";
import { Role } from "../../po/atom/role";
import { EquipTypeIntro, EquipType, } from "../../anxi/define/util";
import { World } from "../../anxi/atom/world";
import { getProto, getSpriteFromThing } from "../../data/thing/all";
import { EquipProtos } from "../../data/thing/equip/all";

export class BagController extends BaseGui {

    /**
     * @type {Role[]}
     */
    roles

    roleIndex = 0

    get role() {
        return this.roles[this.roleIndex];
    }
    /**
     * @type {SmallVita}
     */
    smallVita = undefined

    /**
     * @type {WholePropBar}
     */
    wholePropBar

    realBag = new SingleBag()

    saleBtn = new TextButton('出售白装', 500, 383, {
        fontSize: 12
    }, 60, 20)

    equipBlocks = [
        new ObjWrap(EquipTypeIntro.weapon),
        new ObjWrap(EquipTypeIntro.body),
        new ObjWrap(EquipTypeIntro.dcrt),
        new ObjWrap(EquipTypeIntro.wing),
    ]
    constructor() {
        super();
        this.roleIndex = 0;
        this.init();
    }
    init() {
        let container = new Graphics();
        container.interactive = true;
        container.accessiblePointerEvents = 'none';
        this.baseContainer = container;
        container.beginFill(0x000000);
        container.drawRect(0, 0, 700, 450);
        container.endFill();
        container.position.set(130, 80);
        container.visible = false;
        this.initCommon();
        this.initSV();
        this.initRealBag();
        this.baseContainer.addChild(this.roleSelectorContainer);
    }
    initCommon() {
        let bagtext = new Text('背 包', new TextStyle({
            stroke: 0xffffff,
            strokeThickness: 2,
            fill: [0xffff88, 0xff8800],
            fontSize: 40,
        }))
        bagtext.x = 28;
        bagtext.y = -25;
        this.baseContainer.addChild(bagtext);

        this.equipBlocks.forEach((block, index) => {
            block.position.set(index > 1 ? 280 : 210, (index & 1 == 1) ? 150 : 80);
            this.baseContainer.addChild(block);
        })

        this.wholePropBar = new WholePropBar();
        this.wholePropBar.position.set(40, 240);
        this.baseContainer.addChild(this.wholePropBar);
        this.baseContainer.addChild(this.saleBtn);
        gameTink.makeInteractive(this.saleBtn);
        this.saleBtn.tap = _ => {
            if (this.realBag.bagType != 0) return;
            let role = this.roles[this.roleIndex];
            role.bag.equip = role.bag.equip.filter(equip => {
                let proto = EquipProtos[equip.id];
                if (proto.quality == 0) {
                    let money = proto.money;
                    role.getMoney(money, 'sale');
                    return false;
                }
                return true;
            });
            this.refresh();
        }
    }
    initSV() {
        this.smallVita = new SmallVita();
        this.smallVita.show();
        this.baseContainer.beginFill(0x555555);
        this.baseContainer.drawRect(45, 55, 150, 150);
        this.baseContainer.endFill();
        this.baseContainer.addChild(this.smallVita.view);
        this.smallVita.view.position.set(150, 80);
    }
    initRealBag() {
        let all = this;
        this.realBag.position.set(375, 10);
        this.baseContainer.addChild(this.realBag);
        this.realBag.bagUtil.forEach(bu => {
            bu.onTap(function () {
                let thing = this.thing;
                SimpleOperator.whenRefresh(_ => {
                    all.refresh();
                })
                SimpleOperator.show(thing, getProto(thing), this, all);
            })
        })
    }
    roleSelectorContainer = new Container()
    refreshRoleSelector() {
        this.roles.forEach((role, index) => {
            let nameBtn = new TextButton(role.name, -42, 100 + 60 * index, {}, 85, 30);
            this.roleSelectorContainer.addChild(nameBtn);
            nameBtn.tap = () => {
                this.roleIndex = index;
                this.refresh();
            }
        })
    }
    refresh() {
        let role = this.roles[this.roleIndex];
        role.compute();
        this.smallVita.refresh(role);
        this.wholePropBar.refresh(role);
        this.refreshEquipInRole();
        this.refreshRoleSelector();
        this.realBag.load(role);
    }
    refreshEquipInRole(role = this.roles[this.roleIndex]) {
        this.equipBlocks.forEach((block, index) => {
            block.removeChildren();
            block.addChild(block.text);
            let equip = role.equip[EquipType[index]];
            if (!equip) return;
            let sprite = getSpriteFromThing(equip);
            gameTink.makeInteractive(sprite);
            sprite.tap = _ => {
                role.equipController.unfix(index);
                this.refresh();
            }
            sprite.over = _ => {
                SimpleDetail.show(equip, getProto(equip), sprite, this.baseContainer);
                sprite.out = _ => {
                    SimpleDetail.hide();
                }
            }
            block.addChild(sprite);
        })
    }
    /**
     * @param {World} world 
     */
    bind(world) {
        this.world = world;
        this.roles = this.world.roles;
        world.toolContainer.addChild(this.baseContainer);
    }
}