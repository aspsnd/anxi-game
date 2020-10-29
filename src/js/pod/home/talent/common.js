import { Graphics, GraphicsData, Sprite } from "pixi.js";
import { TalentProtos } from "../../../data/talent/all";
import { by, gameTink, getTalentIcon } from "../../../util";
import { SingleTalentDetail } from "./detail";

export class CommonTalentSprite extends Sprite {
    constructor() {
        super(by(getTalentIcon()));
        gameTink.makeInteractive(this);
        this.anchor.set(0.5, 0.5);
        this.over = _ => {
            if (!this.talentProto) return;
            SingleTalentDetail.show({
                name: this.talentProto._name,
                describe: this.talentProto._describe
            }, this.parent, this.x, this.y, this);
        };
        this.out = _ => {
            SingleTalentDetail.hide(this);
        }
    }
    useTalent(talentIndex) {
        this.texture = by(getTalentIcon(talentIndex));
        this.talentProto = TalentProtos[talentIndex];
    }
    useMask(shape) {
        let graphics = new Graphics();
        graphics.beginFill(0x000000);
        graphics.drawShape(shape);
        graphics.endFill();
        graphics.position.set(this.x, this.y);
        this.parent.addChild(graphics);
        this.mask = graphics;
        return this;
    }
}