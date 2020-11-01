import { Circle, Container, Graphics, GraphicsGeometry, Sprite, Texture } from "pixi.js";
import { res } from "../../../res";
import { oldFilmFilter } from "../../data/ffilter/filter";
import { findBranchIndex, findFairArray, SuperTalentIndexs, TalentTree, FairArray } from "../../data/talent/const";
import { Role } from "../../po/atom/role";
import { RealWorld } from "../../po/world";
import { by, gameTink, getTalentIcon, GTip, IFC } from "../../util";
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
        this.initCtrl();
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
     * @type {CommonTalentSprite[][]}
     */
    commomTalents = []
    /**
     * @type {CommonTalentSprite[][]}
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
            }
            this.selectedTalents = this.selectedTalents.filter(t => findBranchIndex(t) == main1.pointer);
            this.refreshShow();
        }
        for (let j = 0; j < 2; j++) {
            let mainTalent = new CommonTalentSprite();
            this.center.addChild(mainTalent);
            mainTalent.position.set(60 + j * 80, 130);
            mainTalent.useMask(new Circle(0, 0, 20));
            this.superTalents.push(mainTalent);
            mainTalent.tap = _ => {
                if (this.talentStars == 0) return;
                if (!this.selectedTalents.includes(mainTalent.talentProto.index)) {
                    this.selectedTalents = this.selectedTalents.filter(v => !SuperTalentIndexs.includes(v));
                    this.selectedTalents.push(mainTalent.talentProto.index);
                    this.refreshShow();
                }
            }
        }
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                let talents = [];
                for (let k = 0; k < 3; k++) {
                    let commonTalent = new CommonTalentSprite();
                    this.center.addChild(commonTalent);
                    commonTalent.position.set(60 + i * 400 + k * 80, 220 + j * 80);
                    commonTalent.useMask(new Circle(0, 0, 20));
                    talents.push(commonTalent);
                    commonTalent.tap = _ => {
                        if (!this.selectedTalents.includes(commonTalent.talentProto.index)) {
                            let result = this.ifSelectThenResult(commonTalent.talentProto.index);
                            if (result.length > this.talentStars) return;
                            this.selectedTalents = result;
                            this.refreshShow();
                        }
                    }
                }
                if (i == 0) {
                    this.commomTalents.push(talents);
                } else {
                    this.commomTalents2.push(talents);
                }
            }
        }
    }
    roleSelectWrap = new Container();
    initRoleSelector() {
        this.roleSelectWrap.removeChildren();
        this.roles.forEach((role, index) => {
            let nameBtn = new TextButton(role.name, 105 * index, 0, {}, 85, 30).overColor();
            this.roleSelectWrap.addChild(nameBtn);
            nameBtn.tap = () => {
                if (this.roleIndex == index) return;
                this.roleIndex = index;
                this.refresh();
            }
        })
    }
    initCtrl() {
        let refresher = new Sprite(by('./res/util/gui/refresh.png'));
        refresher.anchor.set(0.5, 0.5);
        refresher.position.set(700, 50);
        this.container.addChild(refresher);
        gameTink.makeInteractive(refresher);
        refresher.tap = _ => {
            this.selectedTalents = [];
            this.refreshShow();
        }
        let save = new TextButton('save', 760, 35, {}, 60, 30).overColor();
        this.container.addChild(save);
        save.tap = _ => {
            this.role.talents = Array.from(this.selectedTalents);
            RealWorld.instance.save();
            this.refreshShow();
        }
        let tip = this.tip = new TextButton(`可选天赋数：${this.role.talentStars}`, 350, 35, undefined, 135, 30, 0xeeeeee);
        this.container.addChild(tip);
    }
    refresh() {
        this.talentStars = this.role.talentStars;
        this.selectedTalents = Array.from(this.role.talents);
        this.tip.text.text = `可选天赋数：${this.role.talentStars}`;
        if (!this.checkOutBound() || !this.checkFollowRule()) {
            this.role.talents = [];
            this.selectedTalents = [];
            RealWorld.instance.save();
            new ZY.myAler.Aler('自身天赋错乱，已自动清空');
        }
        this.refreshShow();
    }
    refreshShow() {
        let mainIndex = this.selectedTalents.find(v => SuperTalentIndexs.includes(v));
        let mainBranchIndex = mainIndex != undefined ? findBranchIndex(mainIndex) : this.main1.pointer;
        let subBranchIndex = this.selectedTalents.map(findBranchIndex).find(v => v != mainBranchIndex) ?? this.main2.pointer;
        if (subBranchIndex == -1) {
            subBranchIndex = this.main2.pointer;
        }
        let treeNode = TalentTree[mainBranchIndex];
        this.main1.pointer = mainBranchIndex;
        this.superTalents.forEach((st, index) => {
            let talentIndex = treeNode.super[index];
            st.useTalent(talentIndex);
            if (this.selectedTalents.includes(talentIndex)) {
                st.filters = [];
            } else {
                st.filters = [oldFilmFilter];
            }
        });
        this.commomTalents.forEach((sts, row) => {
            sts.forEach((st, col) => {
                let talentIndex = treeNode.common[row][col];
                if (talentIndex == undefined) {
                    st.visible = false;
                } else {
                    st.useTalent(talentIndex);
                    st.visible = true;
                    if (this.selectedTalents.includes(talentIndex)) {
                        st.filters = [];
                    } else {
                        st.filters = [oldFilmFilter];
                    }
                }
            })
        })
        let treeNode2 = TalentTree[subBranchIndex];
        this.main2.pointer = subBranchIndex;
        this.commomTalents2.forEach((sts, row) => {
            sts.forEach((st, col) => {
                let talentIndex = treeNode2.common[row][col];
                if (talentIndex == undefined) {
                    st.visible = false;
                } else {
                    st.useTalent(talentIndex);
                    st.visible = true;
                    if (this.selectedTalents.includes(talentIndex)) {
                        st.filters = [];
                    } else {
                        st.filters = [oldFilmFilter];
                    }
                }
            })
        })
    }
    checkOutBound() {
        return this.talentStars >= this.selectedTalents.length;
    }
    checkFollowRule() {
        if (this.selectedTalents.filter(i => SuperTalentIndexs.includes(i)).length > 1) return false;
        let branchIndexs = new Set(this.selectedTalents.map(i => findBranchIndex(i)));
        if (branchIndexs.size > 2) return false;
        for (let arr of FairArray) {
            if (this.selectedTalents.filter(v => arr.includes(v)).length > 1) return false;
        }
        return true;
    }
    ifSelectThenResult(talentIndex, fairArray = findFairArray(talentIndex)) {
        return [...Array.from(this.selectedTalents).filter(v => !fairArray.includes(v)), talentIndex];
    }
}
export const SingleTalent = TalentPane.INSTANCE;