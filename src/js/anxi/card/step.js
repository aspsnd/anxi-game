import { MonstProtos } from "../../data/monst/all"
import { getWS } from "../../net/net"
import { Monst } from "../../po/atom/monst"
import { Role } from "../../po/atom/role"
import { RealWorld } from "../../po/world"
import { GameWidth, CardWidth, IFC } from "../../util"
import { Exit } from "../atom/exit"
import { World } from "../atom/world"
import { BigHPBarController, HPBarController } from "../controller/hp.view"
import { SuperInstructor } from "../instruct/inst"

export class StepManager {
    screenLeft = 0
    step = -0.5
    stepNum = 4
    limit = [0, 1300]
    static defaultLimits = [
        [0, 1300],
        [0, 2100],
        [0, 2900],
        [0, 3700],
        [0, 4500]
    ]
    /**
     * @param {World} world 
     */
    constructor(world) {
        this.world = world;
        /**
         * @type {import("../define/type").CardData}
         */
        this.carddata = world.carddata;
        this.container = world.baseContainer;
        world.on('timing', this.onTimer.bind(this));
        this.init();
        window.step = this;
    }
    init() {
        this.stepNum = this.carddata.step ?? this.stepNum;
        this.limits = this.carddata.limits ?? StepManager.defaultLimits;
        if (this.world.isNet) {
            getWS().on('jumpStep', e => {
                this.goToStep(e.value);
            })
        }
    }
    onTimer() {
        this.attach();
    }
    /**
     * @type {Role[]}
     */
    pointer
    get role() {
        return this.pointer[0];
    }
    netRole
    get extraRole() {
        return this.pointer[1];
    }
    get multiPlayer() {
        return this.pointer.length > 1;
    }
    /**
     * @param {Role[]} roles 
     */
    bind(roles) {
        this.pointer = roles;
        this.lastX = this.role.x;
        this.lastXs = roles.map(role => role.x);
        this.attach = this.world.isNet ? this.attachNet
            : (this.multiPlayer ? this.attachRoles : this.attachRole);
        if (this.world.isNet) {
            this.netRole = RealWorld.instance.record.isHomer ? roles[0] : roles[1];
        }
        return this;
    }
    attach() {
        throw new Error('unimplements!');
    }
    attachRole() {
        let { role, container } = this;
        if (!role.viewController.view.worldVisible) return;
        let nowX = role.x;
        let gx = role.viewController.view.getGlobalPosition().x;
        let goto = nowX - this.lastX;
        if (gx < 220 && goto < 0) {
            this.screenLeft = Math.max(this.screenLeft + goto, this.limit[0]);
            container.x = - this.screenLeft;
        } else if (gx > GameWidth - 290 && goto > 0) {
            this.screenLeft = Math.min(this.screenLeft + goto, this.limit[1] - GameWidth);
            container.x = -this.screenLeft;
        }
        if (this.step % 1 != 0 && this.step < 4.5) {
            if (this.screenLeft >= this.limits[this.step + 0.5][1] - GameWidth) {
                this.goToStep(this.step + 0.5);
            }
        }
        this.lastX = nowX;
    }
    attachNet() {
        let { netRole, container } = this;
        if (!netRole.viewController.view.worldVisible) return;
        let nowX = netRole.x;
        let gx = netRole.viewController.view.getGlobalPosition().x;
        let goto = nowX - this.lastX;
        if (gx < 220 && goto < 0) {
            this.screenLeft = Math.max(this.screenLeft + goto, this.limit[0]);
            container.x = - this.screenLeft;
        } else if (gx > GameWidth - 290 && goto > 0) {
            this.screenLeft = Math.min(this.screenLeft + goto, this.limit[1] - GameWidth);
            container.x = -this.screenLeft;
        }
        if (this.step % 1 != 0 && this.step < 4.5) {
            if (this.screenLeft >= this.limits[this.step + 0.5][1] - GameWidth) {
                getWS().send({
                    global: true,
                    name: 'jumpStep',
                    value: this.step + 0.5
                });
            }
        }
        this.lastX = nowX;
    }
    attachRoles() {
        let { role, extraRole, container } = this;
        if (role.dead) {
            this.pointer = [this.extraRole];
            this.attach = this.attachRole;
        }
        if (extraRole.dead) {
            this.attach = this.attachRole;
        }
        let nowX = role.x;
        let nowX2 = extraRole.x;
        let leftLimit = 220;
        let rightLimit = GameWidth - 290;
        let gx1 = role.viewController.view.getGlobalPosition().x;
        let gx2 = extraRole.viewController.view.getGlobalPosition().x;
        let goto = [nowX - this.lastXs[0], nowX2 - this.lastXs[1]];
        let wantLeft1 = gx1 < leftLimit && goto[0] < 0;
        let wantLeft2 = gx2 < leftLimit && goto[1] < 0;
        let wantRight1 = gx1 > rightLimit && goto[0] > 0;
        let wantRight2 = gx2 > rightLimit && goto[1] > 0;
        let wantLeft = (wantLeft1 && !wantRight2) || (wantLeft2 && !wantRight1);
        let wantRight = (wantRight1 && !wantLeft2) || (wantRight2 && !wantLeft1);
        if (wantLeft) {
            if (wantLeft1 && gx2 < GameWidth + goto[0]) {
                this.screenLeft = Math.max(this.screenLeft + goto[0], this.limit[0]);
                container.x = - this.screenLeft;
            } else if (gx1 < GameWidth + goto[1]) {
                this.screenLeft = Math.max(this.screenLeft + goto[1], this.limit[0]);
                container.x = - this.screenLeft;
            }
        } else if (wantRight) {
            if (wantRight1 && gx2 > goto[0]) {
                this.screenLeft = Math.min(this.screenLeft + goto[0], this.limit[1] - GameWidth);
                container.x = -this.screenLeft;
            } else if (gx1 > goto[1]) {
                this.screenLeft = Math.min(this.screenLeft + goto[1], this.limit[1] - GameWidth);
                container.x = -this.screenLeft;
            }
        }
        if (this.step % 1 != 0 && this.step < 4.5) {
            if (this.screenLeft >= this.limits[this.step + 0.5][1] - GameWidth) {
                this.goToStep(this.step + 0.5);
            }
        }
        this.lastXs = [nowX, nowX2];
    }
    dropMonst(step) {
        let { timer, carddata } = this.world;
        let deadCount = {
            monstNum: 0,
            deadNum: 0
        }
        if (step == this.stepNum) {
            let _boss = carddata.boss;
            _boss.forEach((arr, index) => {
                deadCount.monstNum++;
                this.world.on(`timer_${timer + arr[1]}`, e => {
                    this.place(arr, deadCount, index);
                })
            })
            return;
        }
        carddata.monsts[step].forEach(arr => {
            deadCount.monstNum += arr[1];
            this.world.once(`timer_${timer + arr[2]}`, e => {
                for (let i = 0; i < arr[1]; i++) {
                    this.drop(arr, deadCount);
                }
            })
        });
    }
    goToStep(step) {
        this.step = step;
        if (step % 1 == 0) {
            this.limit = this.limits[step];
            this.dropMonst(step);
        } else {
            this.limit = [0, CardWidth];
        }
    }
    /**
     * @param {{
     *       monstNum: number,
     *       deadNum: number
     *   }} deadCount 
    */
    drop(arr, deadCount) {
        let monst = new Monst(MonstProtos[arr[0]], this.world);
        new HPBarController(monst);
        this.world.vitaContainer.addChild(monst.viewController.view);
        monst.use(SuperInstructor.artificialIntelligence());
        monst.face = arr[4] || (arr[3] > 480 ? -1 : 1);
        this.world.vitas[monst.id] = monst;
        monst.x = (arr[3] ?? 300) + this.screenLeft;
        monst.y = 250;
        monst.landIn(this.world);
        monst.on('dead', e => {
            if (++deadCount.deadNum == deadCount.monstNum) {
                this.goToStep(this.step + 0.5);
            }
        })
    }
    bossNum = 0
    place(_boss, deadCount, index) {
        let monst = new Monst(MonstProtos[_boss[0]], this.world);
        this.world.vitaContainer.addChild(monst.viewController.view);
        new BigHPBarController(monst, 0xff0000, index);
        monst.isBoss = true;
        monst.use(SuperInstructor.artificialIntelligence());
        monst.face = _boss[3] || -1;
        this.world.vitas[monst.id] = monst;
        monst.x = (_boss[2] ?? 300) + this.screenLeft;
        monst.y = 250;
        monst.landIn(this.world);
        monst.on('dead', e => {
            if (++deadCount.deadNum == deadCount.monstNum) {
                new Exit(monst).landIn(this.world);
            }
        })
    }
}