import { Graphics, Text, TextStyle, Sprite, Container } from "pixi.js";
import { gameTink, by, GTip } from "../../util";
import { SkillProtos } from "../../data/skill/all";
import { BaseGui } from "./gui";
import { Role } from "../../po/atom/role";
import { Skill } from "../../po/skill";
import { World } from "../../anxi/atom/world";

export class SkillPanel extends BaseGui{

    container = new Sprite(by('./res/util/gui/bg.png'));
    center = new Graphics();

    /**
     * @type [[Text]]
     */
    sprites = [[], [], [], [], []]

    /**
    * @param {{
    *  bag:boolean,
    *  bagExtra:boolean,
    *  quit:boolean,
    *  skill:boolean
    * }} opened
    * @param {[Role]} roles
    * @param {string} key 
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
    bind(world){
        this.world = world;
        this.roles = world.roles;
        world.parallelContainer.addChild(this.baseContainer);
    }
    ctrlContainer = new Container();
    refreshCtrl() {
        let posx = 150;
        this.roles.forEach((role,index) => {
            let name = SkillPanel.nameText(role.name);
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
        let title = new Text('技能名称     解锁方式      技能蓝耗      技能说明', new TextStyle({
            fill: 0xffffff,
            fontSize: 16
        }));
        title.position.set(18, 10);
        this.center.addChild(title);
        for (let i = 0; i < 5; i++) {
            let name = new Text('技能名称', this.skillDescribeStyle);
            name.anchor.set(0.5, 0.5);
            name.position.set(50, 70 + 80 * i);
            this.center.addChild(name);

            let method = new Text('--/--', {
                ...this.skillDescribeStyle,
                wordWrapWidth: 65
            });
            method.anchor.set(0.5, 0.5);
            method.position.set(135, 70 + 80 * i);
            gameTink.makeInteractive(method);
            this.center.addChild(method);

            let lost = new Text('--/--', this.skillDescribeStyle);
            lost.anchor.set(0.5, 0.5);
            lost.position.set(225, 70 + 80 * i);
            this.center.addChild(lost);

            let intro = new Text('无', this.skillDescribeStyle);
            intro.position.set(285, 45 + 80 * i);
            this.center.addChild(intro);

            this.sprites[i] = [name, method, lost, intro];
        }
    }
    refresh() {
        let role = this.roles[this.roleIndex];
        let fultureSkills = role.proto.fultureSkills;
        let nowSkill = role.skills;
        fultureSkills.forEach((skill, index) => {
            this.sprites[index][0].text = SkillProtos[skill.index]._name;
            if (nowSkill.includes(skill.index)) {
                this.sprites[index][1].text = '已解锁';
                this.sprites[index][1].tap = null;
            } else {
                this.sprites[index][1].text = `点击解锁\r${skill.cost.money}灵魂`;
                this.sprites[index][1].tap = () => {
                    if (role.money < skill.cost.money) return;
                    role.reduceMoney(skill.cost.money);
                    role.skills.push(skill.index);
                    role.skillController.add(new Skill(SkillProtos[skill.index]).link(role));
                    new GTip('学习成功');
                    this.refresh(role);
                };
            }
            this.sprites[index][2].text = SkillProtos[skill.index].mp;
            this.sprites[index][3].text = SkillProtos[skill.index]._describe;
        });
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