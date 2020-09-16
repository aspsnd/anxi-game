import { Container } from "pixi.js"
import { TextButton } from "./button";

export class BagMenu extends Container {
    btns = []
    _nowIndex = 0
    get nowIndex() {
        return this._nowIndex;
    }
    set nowIndex(index) {
        this.closeHandler(this._nowIndex);
        this.selectHandler(index);
        this._nowIndex = index;
    }
    constructor(opts = ['装 备', '材 料', '待 定']) {
        super();
        opts.forEach((on, index) => {
            let btn = new TextButton(on, index * 90, 0).overColor();
            btn.tap = () => {
                this.nowIndex = index;
            }
            this.btns.push(btn);
        })
        this.addChild(...this.btns);
    }
    refresh() {
        this.nowIndex = 0;
    }
    selectHandler = () => { }
    closeHandler = () => { }
    /**
     * @param {(index:number)=>void} handler 
     */
    onSelect(handler) {
        this.selectHandler = handler;
        return this;
    }
    /**
     * @param {(index:number)=>void} handler 
     */
    onClose(handler) {
        this.closeHandler = handler;
        return this;
    }
}
export class PageCtrl extends Container {
    btns = []
    _nowIndex = 0
    get nowIndex() {
        return this._nowIndex;
    }
    set nowIndex(index) {
        this.changeHandler(index);
        this._nowIndex = index;
    }
    constructor(maxPage = 3) {
        super();
        for (let i = 0; i < maxPage; i++) {
            let pageBtn = new TextButton(i + 1, i * 35, 0, {}, 25, 20);
            pageBtn.tap = _ => {
                this.nowIndex = i;
            }
            this.addChild(pageBtn);
        }
    }
    changeHandler = index => { }
    /**
     * @param {(index:number)=>void} handler 
     */
    onChange(handler) {
        this.changeHandler = handler;
        return this;
    }
    refresh(){
        this.nowIndex = 0;
    }
}