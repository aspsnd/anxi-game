import { Graphics, Rectangle, Sprite, Texture } from "pixi.js";
import { World } from "../../../anxi/atom/world";
import { AttackProto, behindDebuff } from "../../../anxi/proto/attack";
import { Point, Polygon } from "../../../anxi/shape/shape";
import { by, tween } from "../../../util";


let ptime = 25;
let atime = 9;
var thunderUrl = './res/util/monst/5/9.png';
export default new AttackProto({
    index: 7,
    time: 30,
    freeze: 45,
    checkTimes: Array.from(new Array(4), (v, k) => k * 2 + ptime + 1),
    debuff: behindDebuff(15),
    getHitGraph(pos, face, vita) {
        let [x, y] = pos;
        return new Polygon(
            new Point(x - 20, y + 230),
            new Point(x - 20, y),
            new Point(x + 20, y),
            new Point(x + 20, y + 230)
        );
    },
    executeProto(){
        let vita = this.belonger;
        let timer = vita.timer;
        let innerCircle = new Graphics();
        let outerCircle = new Graphics();
        let target = vita.world.selectableVitas().filter(v => v.group != vita.group)[0] ?? vita;
        let pos = [Math.max(Math.min(target.x, vita.x + 600), vita.x - 600), vita.y - 150];
        innerCircle.position.set(...pos);
        outerCircle.position.set(...pos);
        innerCircle.scale.set(1, 0.5);
        outerCircle.scale.set(1, 0.5);
        World.instance.vitaContainer.addChild(innerCircle);
        World.instance.vitaContainer.addChild(outerCircle);
        let pangle = 360 / ptime;
        for (let i = 1; i <= ptime; i++) {
            vita.once(`timer_${timer + i}`, e => {
                innerCircle.clear();
                outerCircle.clear();
                innerCircle.lineStyle(6, 0x0055dd);
                outerCircle.lineStyle(4, 0x0000ee);
                innerCircle.alpha = 0.5 + i / ptime * 0.5;
                outerCircle.alpha = 0.7 + i / ptime * 0.3;
                innerCircle.arc(0, 0, 20, 0, Math.PI * pangle * i / 180);
                outerCircle.arc(0, 0, 30, Math.PI - Math.PI * pangle * i / 180, Math.PI);
            });
        }
        vita.once(`timer_${timer + ptime + atime + 10}`, e => {
            innerCircle.destroy();
            outerCircle.destroy();
        })
        vita.once(`timer_${timer + ptime}`, e => {
            if (this.finish) return;
            this.absoluteCheck = true;
            let pillar = new Sprite(new Texture(by(thunderUrl)));
            let { width, height } = by(thunderUrl);
            this.check(pillar);
            pillar.position.set(pos[0], pos[1] + 10);
            pillar.anchor.set(0.5, 0);
            pillar.height = height;
            World.instance.vitaContainer.addChild(pillar);
            pillar.texture.frame = new Rectangle(0, 0, 103, 0);
            for (let i = 1; i <= atime; i++) {
                vita.once(`timer_${timer + ptime + i}`, e => {
                    pillar.texture.frame = new Rectangle(0, 0, 103, height * i / atime);
                })
            }
            vita.once(`timer_${timer + ptime + atime + 10}`, e => {
                pillar.destroy();
            })
        })
    },
    acitonData:{
        weapon: {
            len: 35,
            changedFrame: 1,
            value: [
                ...tween([0, 65, 30], [0, 65, 0], 15),
                ...tween([0, 65, 0], [0, 65, 0], 10),
                ...tween([0, 65, 0], [0, 65, 30], 5)
            ]
        },
    }
})