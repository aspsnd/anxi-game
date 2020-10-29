import { GodrayFilter } from "pixi-filters";
import { Circle, Container, Graphics, GraphicsGeometry, Sprite, Texture } from "pixi.js";
import { oldFilmFilter } from "../../data/ffilter/filter";
import { findBranchIndex, SuperTalentIndexs, TalentTree } from "../../data/talent/const";
import { Role } from "../../po/atom/role";
import { by, getTalentIcon } from "../../util";
import { TextButton } from "../guis/base/button";
import { ToolGUI } from "./base";
import { ActSprite } from "./talent/act";
import { CommonTalentSprite } from "./talent/common";

export class TalentPane extends ToolGUI {
    static INSTANCE = new TalentPane();
    center = new Graphics();
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
        this.initRoleSelector();
    }
    constructor() {
        super();
    }
    talentStars = 0
    selectedTalents = []
    init() {
        super.init();
        this.initCommon();
    }
    initCommon() {
        this.initCenter();
        this.roleSelectWrap.position.set(80, 35);
        this.container.addChild(this.roleSelectWrap);
        this.initComt();
    }
    initCenter() {
        this.center.position.set(80, 85);
        this.center.beginFill(0x00ffff, 0.6);
        this.center.drawRect(0, 0, 800, 420);
        this.center.endFill();
        this.container.addChild(this.center);
    }
    /**
     * @type {ActSprite[]}
     */
    mainBtns
    /**
     * @type {CommonTalentSprite[]}
     */
    superTalents = []
    /**
     * @type {CommonTalentSprite[]}
     */
    commomTalents = []
    /**
     * @type {CommonTalentSprite[]}
     */
    commomTalents2 = []
    initComt() {
        let main1 = this.main1 = new ActSprite(Array.from(new Array(5), (v, k) => by(getTalentIcon(0))), TalentTree.map(t => t.name));
        main1.position.set(60, 40);
        main1.mask = new Graphics().beginFill(0xffffff, 1).drawCircle(0, 0, 30).endFill();
        main1.mask.position.set(60, 40);
        this.center.addChild(main1.mask);
        this.center.addChild(main1);
        let main2 = this.main2 = new ActSprite(Array.from(new Array(5), (v, k) => by(getTalentIcon(0))), TalentTree.map(t => t.name));
        main2.position.set(460, 40);
        main2.mask = new Graphics().beginFill(0xffffff, 1).drawCircle(0, 0, 30).endFill();
        main2.mask.position.set(460, 40);
        this.center.addChild(main2.mask);
        this.center.addChild(main2);
        this.mainBtns = [main1, main2];
        main1.pointerChange = mainBranch => {
            if (mainBranch == main2.pointer) {
                main1.pointer++;
            }
            this.selectedTalents = [];
            this.refreshShow();
        }
        main2.pointer++;
        main2.pointerChange = subBranch => {
            if (subBranch == main1.pointer) {
                main2.pointer++;
                return;
            }
            this.selectedTalents = this.selectedTalents.filter(t => findBranchIndex(t) == main1.pointer);
            this.refreshShow();
        }
        for (let j = 0; j < 2; j++) {
            let mainTalent = new CommonTalentSprite();
            this.center.addChild(mainTalent);
            mainTalent.position.set(60 + j * 50, 110);
            mainTalent.useMask(new Circle(0, 0, 20));
            this.superTalents.push(mainTalent);
            mainTalent.tap = _ => {
                if (!this.selectedTalents.includes(mainTalent.talentProto.index)) {
                    this.selectedTalents = this.selectedTalents.filter(v => !SuperTalentIndexs.includes(v));
                    this.selectedTalents.push(mainTalent.talentProto.index);
                    this.refreshShow();
                }
            }
        }
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {

            }
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
    refresh() {
        this.talentStars = this.role.talentStars;
        this.selectedTalents = Array.from(this.role.talents);
        this.refreshShow();
    }
    refreshShow() {
        let mainIndex = this.selectedTalents.find(v => SuperTalentIndexs.includes(v));
        let mainBranchIndex = findBranchIndex(mainIndex);
        let subBranchIndex = this.selectedTalents.map(findBranchIndex).find(v => v != mainBranchIndex);
        if (mainIndex != undefined) {
            this.main1.pointer = mainBranchIndex;
            this.superTalents.forEach((st, index) => {
                let talentIndex = TalentTree[mainBranchIndex].super[index];
                st.useTalent(talentIndex);
                if (this.selectedTalents.includes(talentIndex)) {
                    st.filters = [];
                } else {
                    st.filters = [oldFilmFilter]
                }
            });
            if (subBranchIndex > -1) {
                this.main2.pointer = subBranchIndex;

            }
        } else {
            this.superTalents.forEach((st, index) => {
                st.useTalent(TalentTree[this.main1.pointer].super[index]);
                st.filters = [oldFilmFilter];
            });
        }
    }
}
export const SingleTalent = TalentPane.INSTANCE;