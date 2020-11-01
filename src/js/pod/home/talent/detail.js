import { Graphics, Text, TextStyle } from "pixi.js";

class TalentDetail {
    static INSTANCE = new TalentDetail()
    container = new Graphics()
    static defaultOptions = _ => ({
        name: '————',
        describe: '—————',
    })
    constructor() {
        this.init();
    }
    init() {
        this.container.addChild(this.title, this.describe);
        this.title.position.set(10, 10);
        this.describe.position.set(10, 40);
        this.container.visible = false;
    }
    title = new Text('---', new TextStyle({
        fontSize: 18,
        fill: 0xffffff
    }))
    describe = new Text('---', new TextStyle({
        fill: 0xffffff,
        fontSize: 14,
        wordWrap: true,
        breakWords: true,
        wordWrapWidth: 135,
        letterSpacing: 1,
        lineHeight: 18
    }))
    show(options, parent, x, y, sprite) {
        this.target = sprite;
        parent.addChild(this.container);
        this.container.position.set(x, y);
        this.container.visible = true;
        this.title.text = options.name;
        this.describe.text = options.describe;
        this.container.clear();
        this.container.beginFill(0x000000, 0.5);
        this.container.lineStyle(2, 0x000000, 0.8);
        this.container.drawRect(0, 0, 180, 60 + this.describe.height);
        this.container.endFill();
    }
    hide(sprite) {
        if (sprite != this.target) return;
        this.container.visible = false;
        this.container?.parent?.removeChild(this.container);
    }
}
export const SingleTalentDetail = TalentDetail.INSTANCE;