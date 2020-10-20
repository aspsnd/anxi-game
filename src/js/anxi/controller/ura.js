import { URAProtos } from "../../data/ura/all";
import { Affect } from "../affect";
import { typicalProp } from "../atom/vita";
import { ItemEvent } from "../event";
const { Controller } = require("../controller")

export class URAController extends Controller {
    constructor(role) {
        super(role);
        let index = role.proto.uraIndex;
        this.proto = URAProtos[index];
        this.caculate = this.proto.caculater;
        role.on('timing', this.onTimer.bind(this), true);
        this.init();
    }
    uring = false;
    uras = 0
    init() {
        typicalProp.forEach(prop => {
            this.belonger.computeFunctions[prop].push(bv => this.caculate(prop, bv));
        })
        this.belonger.on('wantura', e => {
            if (this.uring || this.uras < 1) return;
            this.uring = true;
            this.belonger.on('getura');
            this.proto.getHandler.call(this);
            this.belonger.needCompute = true;
        })
        this.belonger.on('resAffect', e => {
            if (this.uras == 1 && !this.uring) return;
            /**
             * @type {Affect}
             */
            let affect = e.value;
            if (affect.bedoded) return;
            let harm = affect.finalHarm;
            let balance = this.belonger.level * 1 + this.belonger.baseProp.atk * 0.1 + e.from.prop.hp * 0.1;
            let svr = harm / balance;
            let getbit = svr <= 1 ? 0.02 * svr : 0.02 * svr + 0.01 * svr ** 2;
            if (this.uring) {
                getbit *= 0.25;
            }
            this.uras = Math.min(this.uras + getbit, 1);
            if (this.uras == 1 && !this.uring) {
                this.belonger.on('urafull');
            }
        }, true);
    }
    onTimer() {
        if (this.uras == 1 && !this.uring) return;
        this.uras -= this.uring ? 0.0012 : 0.0004;
        if (this.uras <= 0) {
            this.uras = 0;
            if (this.uring) {
                this.uring = false;
                this.belonger.on(new ItemEvent('lostura'));
                this.proto.lostHandler.call(this);
                this.belonger.needCompute = true;
            }
        }
    }
    caculate() {
        return 0;
    }
    refresh() {
        this.uring = false;
        this.uras = 0;
    }
}