import { getWS } from "../../net/net";
import { RealWorld } from "../../po/world";
import { ItemEvent } from "../event";
import { World } from "./world";

export class NetWorld extends World {
    notNet = false
    a
    b
    seeds
    random() {
        let res = (this.a * this.seeds + this.b) % this.c;
        this.seeds = res;
        return res;
    }
    randomInt(min, max) {
        return (min + this.random() * (max + 1 - min)) | 0;
    }
    randomNode(arr) {
        return arr[(arr.length * this.random()) | 0];
    }
    constructor(carddata, roles, container) {
        super(carddata, roles, container);
        this.ws = getWS();
        this.ws.once('init', e => {
            let value = e.value;
            this.a = value.a;
            this.b = value.b;
            this.c = value.c;
            this.seeds = value.baseSeeds;
            this.ws.on('gm', e => {
                let { name, value, roleIndex } = e.value;
                this.roles[roleIndex].on(new ItemEvent(name, value));
            })
            setTimeout(_ => {
                this.ws.send({
                    global: true,
                    name: 'ready'
                });
            }, 1000);
        });
    };
    /**
     * 
     * @param {RealWorld} realWorld 
     * @param {*} timespeed 
     */
    landIn(realWorld, timespeed = 1) {
        this.world = realWorld;
        this.btimespeed = timespeed;
        return realWorld.ws.on('timing', e => {
            this.onFrame();
            return this.realDead;
        });
    }
}