import { BagMenu, PageCtrl } from "./ctrl";
import { BagUtil } from "./bagUitl";
import { Container } from "pixi.js";
import { Role } from "../../../po/atom/role";
import { ThingType } from "../../../anxi/define/util";

export class SingleBag extends Container {
    bagCtrl = new BagMenu();
    pageCtrl = new PageCtrl();
    /**
     * @type {BagUtil[]}
     */
    bagUtil
    get bagType() {
        return this.bagCtrl.nowIndex;
    }
    bagCenter = new Container();
    constructor() {
        super();
        this.bagUtil = Array.from(new Array(3), (v, k) => new BagUtil(k));
        this.bagCtrl.onSelect(index => {
            this.bagUtil[index].visible = true;
        }).onClose(index => {
            this.bagUtil[index].visible = false;
        });
        this.pageCtrl.onChange(index => this.bagUtil.forEach(bu => bu.page = index));
        this.bagCtrl.position.set(0, 15);
        this.addChild(this.bagCenter, this.bagCtrl);
        this.bagCenter.addChild(...this.bagUtil);
        this.bagCenter.position.set(0, 55);
        this.bagUtil[0].visible = true;
        this.pageCtrl.position.set(195, 373);
        this.addChild(this.pageCtrl);
    }
    refresh() {
        this.bagCtrl.refresh();
        this.bagUtil.forEach(bu => bu.refresh());
    }
    /**
     * @param {Role} role 
     */
    load(role) {
        this.role = role;
        this.bagUtil.forEach((bu, index) => bu.load(role.bag[ThingType[index]]));
        this.refresh();
    }

}