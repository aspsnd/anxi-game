import { BaseGui } from "./gui";
import { Container, Graphics, Text, TextStyle } from "pixi.js";
import { Fight } from "../../po/fight";
import { SmallVita } from "./smallVita";
import { ObjWrap } from "./base/block";
import { EquipTypeIntro, getSpriteFromThing, EquipType, getProto } from "../../data/bag/util";
import { WholePropBar, PropBar } from "./base/porpbar";
import { SingleBag } from "./base/singleBag";
import { TextButton } from "./base/button";
import { gameTink } from "../../util";
import { Role } from "../../po/role";
import { EquipProtos } from "../../data/equip/all";
import { SimpleOperator } from "./base/operate";
import { equipExtraProps } from "../../po/vita";
import { SimpleDetail } from "./base/detail";

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
    constructor(roles) {
        super(roles);
        this.roles = roles;
        this.roleIndex = 0;
        this.init();
    }
    init() {
        let container = new Graphics();
        this.baseContainer = container;
        container.beginFill(0x000000);
        container.drawRect(0, 0, 700, 450);
        container.endFill();
        container.position.set(130, 80);
        container.visible = false;
        Fight.elseContainer.addChild(container);
        this.initCommon();
        this.initSV();
        this.initRealBag();
        this.initRoleSelector();
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

        this.wholePropBar = new WholePropBar(this.roles[0]);
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
        this.smallVita = new SmallVita(this.roles[0]);
        this.smallVita.show();
        this.baseContainer.beginFill(0x555555);
        this.baseContainer.drawRect(45, 55, 150, 150);
        this.baseContainer.endFill();
        this.baseContainer.addChild(this.smallVita.view);
        this.smallVita.view.position.set(150, 80);
        window.svv = this.smallVita.view;
        this.smallVita.refresh(this.roles[0]);
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
    initRoleSelector() {
        this.roles.forEach((role, index) => {
            let nameBtn = new TextButton(role.name, -42, 100 + 60 * index, {}, 85, 30);
            this.baseContainer.addChild(nameBtn);
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
}