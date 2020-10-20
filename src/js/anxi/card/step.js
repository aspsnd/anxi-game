import { Role } from "../../po/atom/role"
import { GameWidth } from "../../util"
import { World } from "../atom/world"

export class StepManager {
    screenLeft = 0
    step = -0.5
    stepNum = 4
    limit = [0, 1300]
    static defaultLimits = [
        [0, 1300],
        [800, 2100],
        [1600, 2900],
        [2400, 3700],
        [3200, 4500]
    ]
    /**
     * @param {World} world 
     */
    constructor(world) {
        this.world = world;
        this.container = world.baseContainer;
        world.on('timing', this.onTimer.bind(this));
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
        this.attach = this.multiPlayer ? this.attachRoles : this.attachRole;
        return this;
    }
    attach() {
        throw new Error('unimplements!');
    }
    attachRole() {
        let { role, container } = this;
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
            if (this.screenLeft >= StepManager.defaultLimits[this.step + 0.5][1] - GameWidth) {
                this.goToStep(this.step + 0.5);
            }
        }
        this.lastX = nowX;
    }
    attachRoles() {
        let { role, extraRole, container } = this;
        if(role.dead){
            this.pointer = [this.extraRole];
            this.attach = this.attachRole;
        }
        if(extraRole.dead){
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
            if (this.screenLeft >= StepManager.defaultLimits[this.step + 0.5][1] - GameWidth) {
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
        if (step == 4) {
            let _boss = carddata.boss;
            _boss.forEach(arr => {
                deadCount.monstNum++;
                this.world.on(`timing_${timer + arr[1]}`, e => {
                    this.place(arr, deadCount);
                })
            })
            return;
        }
        carddata.monsts[step].forEach(arr => {
            deadCount.monstNum += arr[1];
            this.world.on(`timing_${timer + arr[2]}`, e => {
                for (let i = 0; i < arr[1]; i++) {
                    this.drop(arr, deadCount);
                }
            })
        });
    }
    goToStep(step) {
        this.step = step;
        if (step % 1 == 0) {
            this.limit = StepManager.defaultLimits[step];
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
        // let monst = new Monst(arr[0]);
        // Fight.container.addChild(monst.viewController.view);
        // monst.link(this.fight);
        // monst.use(Instructer.artificialIntelligence());
        // monst.viewController.useHPBar();
        // monst.face = arr[4] || (arr[3] > 480 ? -1 : 1);
        // this.fight.vitas[monst.id] = monst;
        // monst.x((arr[3] ?? 300) + this.screenLeft).y(250);
        // monst.on('dead', e => {
        // if (++deadCount.deadNum == deadCount.monstNum) {
        // this.goToStep(this.step + 0.5);
        // }
        // })
    }
    bossNum = 0
    place(_boss, deadCount) {
        // let monst = new Monst(_boss[0]);
        // Fight.container.addChild(monst.viewController.view);
        // monst.link(this.fight);
        // monst.isBoss = true;
        // monst.use(Instructer.artificialIntelligence());
        // monst.viewController.useBigHPbar(this.bossNum++);
        // monst.face = _boss[3] || -1;
        // this.fight.vitas[monst.id] = monst;
        // monst.x((_boss[2] ?? 300) + this.screenLeft).y(250);
        // monst.on('dead', e => {
        //     if (++deadCount.deadNum == deadCount.monstNum) {
        //         this.fight.openQuit();
        //     }
        // })
    }
    dropTest(arr) {
        // let monst = new Monst(arr[0]);
        // Fight.container.addChild(monst.viewController.view);
        // monst.link(this.fight);
        // monst.use(Instructer.artificialIntelligence());
        // monst.viewController.useHPBar();
        // monst.face = arr[4] || (arr[3] > 480 ? -1 : 1);
        // this.fight.vitas[monst.id] = monst;
        // monst.x((arr[3] ?? 300) + this.screenLeft).y(250);
    }
}