import { SkillProtos } from "../../data/skill/all";
import { Skill } from "../../po/skill";
import { typicalProp, Vita } from "../atom/vita";
import { Controller } from "../controller";
import { ItemEvent } from "../event";
import { StateCache } from "./state";

export class SkillController extends Controller{
    /**
     * @type [Skill]
     */
    skills = []
    /**
     * @param {Vita} vita 
     * @param {[number]} skills 
     */
    constructor(vita) {
        super(vita);
        this.vita = vita;
        vita.skills.forEach(_s => {
            this.add(new Skill(SkillProtos[_s]).link(this.vita));
        });
        vita.talents.forEach(_s => {
            this.add(new Skill(SkillProtos[_s]).link(this.vita), 2);
        });
        this.init();
    }
    /**
     * @param {Skill} skill 
     */
    add(skill, type = 0) {
        if (this.skills.some(s => s.index == skill.index)) return;
        skill.commonType = type;
        this.skills.push(skill);
        if (!skill.inited) skill.init();
        this.vita.compute();
    }
    initWingSkill(vita = this.belonger){
        if (vita.wingSkill >= 0) this.add(new Skill(SkillProtos[vita.wingSkill]).link(this.vita), 1);
    }
    /**
     * @param {Skill} skill 
     */
    remove(skill) {
        this.skills.splice(this.skills.indexOf(skill), 1);
        skill.remove();
        this.vita.compute();
    }
    /**
     * @param {Number} si 
     */
    removeByIndex(si) {
        let index = this.skills.findIndex(s => s.index == si);
        if (index < 0) return;
        let skill = this.skills[index];
        this.skills.splice(index, 1);
        skill.remove();
        this.vita.compute();
    }
    caculate(prop, bv) {
        let added = 0;
        this.skills.forEach(skill => {
            skill.proto.initedProps[prop]?.forEach(fn => {
                added += fn(bv, this.vita);
            })
        })
        return added;
    }
    /**
     * @param {Skill} skill 
     */
    isExecutableSkill(skill){
        if (!skill || !skill.active || skill.preventing()) return false;
        if (this.belonger.timer < skill.freezeUtil) return false;
        let lostMp = skill.getMp();
        if (lostMp > this.belonger.varProp.mp) return false;
        return true;
    }
    init() {
        this.vita.on('wantskill', e => {
            let timer = this.vita.timer;
            let skill = e.value == 0 ?
                this.skills.filter(s => s.commonType == 1)[0] : this.skills.filter(s => s.commonType == 0)[e.value - 1];
            if(!this.isExecutableSkill(skill))return;
            skill.freezeUtil = timer + skill.proto.freeze;
            /**
             * 以下为该技能可以释放
             */
            skill.executing = true;
            this.vita.varProp.mp -= skill.getMp();
            this.vita.on('nmpchange');
            this.vita.on(new ItemEvent('createskill', skill, this.vita));
            skill.proto.stand > 0 && this.vita.stateController.setStateTime(StateCache.attack, skill.proto.stand);
            this.setActionData(skill._actionData);
            skill.execute();
        }, true);
        this.vita.on(`loststate_${StateCache.attack}`, e => {
            this.onCancel();
        }, true);
        this.vita.on('cancelskill', e => {
            let skill = e.value == 0 ?
                this.skills.filter(s => s.commonType == 1)[0] : this.skills.filter(s => s.commonType == 0)[e.value - 1];
            if (!skill || !skill.active) return;
            if (!skill.executing) return;
            skill.cancel();
        }, true)
    }

    lastActionIndex = -1
    setActionData(actionData) {
        actionData && (this.lastActionIndex = this.vita.viewController.insertAction(actionData));
    }
    onCancel() {
        this.skills.filter(skill => skill.executing).forEach(skill => {
            skill.executing = false;
            skill.on(new ItemEvent('beinterrupt'));
        });
        this.vita.viewController.removeAction(this.lastActionIndex);
    }
    refresh() {
        this.lastActionIndex = -1;
        this.skills.forEach(skill => {
            skill.freezeUtil = -1;
            skill.data = {};
            skill.initfunc(skill.data);
        });
        typicalProp.forEach(prop => {
            this.vita.computeFunctions[prop].push(bv => this.caculate(prop, bv));
        });
    }

    /**
     * @type {Vita}
     */
    target
    message
}