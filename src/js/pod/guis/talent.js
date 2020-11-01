import { Graphics, Sprite, Text, TextStyle, Container } from "pixi.js";
import { World } from "../../anxi/atom/world";
import { by, gameTink, GTip } from "../../util";
import { BaseGui } from "./gui";

export class TalentPanel extends BaseGui {
    baseContainer = new Sprite(by('./res/util/gui/bg.png'))
    container = this.baseContainer
    center = new Graphics()
    /**
    * @param {[Role]} roles
    */
    constructor(roles) {
        super();
        this.baseContainer = this.container;
        this.roles = roles;
        this.roleIndex = 0;
        this.init();
    }
    init() {
        this.container.visible = false;
        this.center.beginFill(0x000000, 0.8);
        this.center.drawRect(0, 0, 750, 430);
        this.center.endFill();
        this.center.position.set(105, 80);
        this.container.addChild(this.center);
        this.initCenter();
        this.container.addChild(this.ctrlContainer);
    }
    /**
     * @param {World} world 
     */
    bind(world) {
        this.world = world;
        this.roles = world.roles;
        world.toolContainer.addChild(this.baseContainer);
    }
    ctrlContainer = new Container();
    refreshCtrl() {
        this.ctrlContainer.removeChildren();
        let posx = 150;
        this.roles.forEach((role, index) => {
            let name = TalentPanel.nameText(role.name);
            name.position.set(posx + index * 130, 40);
            this.ctrlContainer.addChild(name);
            name.tap = e => {
                this.roleIndex = index;
                this.refresh();
            }
        })
    }

    skillDescribeStyle = new TextStyle({
        fill: 0xffffff,
        fontSize: 14,
        wordWrap: true,
        breakWords: true,
        whiteSpace: 'normal',
        wordWrapWidth: 450
    })
    initCenter() {

    }
    refresh() {
        // let role = this.roles[this.roleIndex];
        // let fultureSkills = role.proto.fultureSkills;
        // let nowSkill = role.skills;
        // fultureSkills.forEach((skill, index) => {
        //     this.sprites[index][0].text = SkillProtos[skill.index]._name;
        //     if (nowSkill.includes(skill.index)) {
        //         this.sprites[index][1].text = '已解锁';
        //         this.sprites[index][1].tap = null;
        //     } else {
        //         this.sprites[index][1].text = `点击解锁\r${skill.cost.money}灵魂`;
        //         this.sprites[index][1].tap = () => {
        //             if (role.money < skill.cost.money) return;
        //             role.reduceMoney(skill.cost.money);
        //             role.skills.push(skill.index);
        //             role.skillController.add(new Skill(SkillProtos[skill.index]).link(role));
        //             new GTip('学习成功');
        //             this.refresh(role);
        //         };
        //     }
        //     this.sprites[index][2].text = SkillProtos[skill.index].mp;
        //     this.sprites[index][3].text = SkillProtos[skill.index]._describe;
        // });
        this.refreshCtrl();
    }
    static _nameTextStyle = new TextStyle({
        fill: [0xFBE764, 0xFE8611],
        dropShadow: true,
        dropShadowDistance: 0,
        dropShadowColor: 0xffffff,
        dropShadowBlur: 10,
        fontSize: 25,
        fontWeight: 'bold',
        stroke: 0xffffff,
        strokeThickness: 2,
        dropShadowAlpha: 0.5
    })
    static nameText(name) {
        let t = new Text(name, this._nameTextStyle);
        gameTink.makeInteractive(t);
        t.anchor.set(0.5, 0.5);
        return t;
    }
}