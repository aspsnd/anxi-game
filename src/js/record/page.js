import { Graphics, TextStyle, Text, Sprite, Container } from "pixi.js";
import { gameTink } from "../util";
import { RecordController } from "./record";

export class RecordPage extends Graphics {
    mainContainer = new Container();
    /**
     * @type  {{
     *      closeHandler:()=>void,
     *      selectHandler:()=>void
     * }}
     */
    options = {}
    /**
     * @param {{
     *      closeHandler:()=>void,
     *      selectHandler:()=>void
     * }} options 
     */
    constructor(options = {}) {
        super();
        this.options = options;
        this.beginFill(0x272727);
        this.drawRect(0, 0, 528, 300);
        this.endFill();
        this.beginFill(0x5a5a5a);
        this.drawRect(0, 0, 528, 47);
        this.endFill();
        let title = new Text('我的存档', new TextStyle({
            fontSize: 25,
            fontWeight: 'bold',
            fill: 0xffffff
        }));
        title.position.set(264, 23);
        title.anchor.set(0.5, 0.5);
        this.addChild(title);
        let close = Sprite.from('../libs/zy/res/img/closew.png');
        close.height = close.width = 22;
        close.position.set(494, 12);
        gameTink.makeInteractive(close);
        close.tap = options.closeHandler;
        this.addChild(close);
        this.mainContainer.position.set(0, 47);
        this.addChild(this.mainContainer);
        this.load(options.selectHandler);
    }
    clear() {
        this.mainContainer.removeChildren();
    }
    load(selectHandler = this.options.selectHandler) {
        this.clear();
        let records = RecordController.getRecords();
        for (let index = 0; index < 6; index++) {
            let record = records[index];
            let graphics = new Graphics();
            graphics.position.set((index % 2 == 0) ? 7 : 271, 10 + (index >> 1) * 82);
            graphics.beginFill(0x000000);
            graphics.drawRoundedRect(0, 0, 250, 69, 3);
            graphics.endFill();
            this.mainContainer.addChild(graphics);
            gameTink.makeInteractive(graphics);
            let indexText = new Text(index + 1, new TextStyle({
                fontSize: 65,
                fill: 0xce6532,
                fontWeight: 'bold'
            }));
            indexText.position.set(35, 34);
            indexText.anchor.set(0.5, 0.5);
            graphics.addChild(indexText);
            graphics.tap = selectHandler.bind(this, index, !!record, record);
            if (!record) continue;
            let namet = record.net ? record.roles.map(role => role.name).join(' ') + (record.isHomer ? ' 创建者' : ' 跟随者') : record.roles.map(role => role.name).join(' ');
            let nameText = new Text(namet, new TextStyle({
                fontSize: 18,
                fill: record.net ? 0xeeddff : 0xffffff,
                fontWeight: (record.net && !record.isHomer) ? '200' : 'bold'
            }));
            nameText.position.set(75, 20);
            graphics.addChild(nameText);
            let dataText = new Text(record.updateTime, new TextStyle({
                fontSize: 12,
                fill: 0xffffff
            }));
            dataText.position.set(75, 45);
            graphics.addChild(dataText);
        };
    }
}