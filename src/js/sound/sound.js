import { Loader, sound } from "pixi.js";
import { ressound } from "../../res";
import "pixi-sound";
import { mapBgUrl, defaultCardBgUrl } from "./util";
import { closeAllBg } from "../boot";

export class SoundManager {
    constructor() { }
    /**
     * @param {function} proc 
     * @param {function} cb 
     */
    init(proc, cb) {
        this.loader = new Loader().add(ressound).on('progress', l => {
            proc(l.progress);
        }).load(_ => {
            cb();
            this.initExtra();
        });
    }
    initExtra() {
        this.mapBg = this.loader.resources[mapBgUrl].sound.play();
        this.mapBg.paused = true;
        this.mapBg.volume = 0.3;
        this.mapBg.loop = true;
    }
    /**
     * @param {string} path 
     */
    get(path) {
        return this.loader.resources[path].sound;
    }
    showMapBg() {
        if (closeAllBg) return;
        this.mapBg.paused = false;
    }
    /**
     * @param {import("../anxi/define/type").CardData} carddata 
     */
    showCardBg(carddata) {
        this.mapBg.paused = true;
        this.cardBg = this.get(carddata.bgmusic ?? defaultCardBgUrl).play();
        this.cardBg.volume = carddata.bgvolume ?? 0.5;
        this.cardBg.loop = true;
        if (closeAllBg) this.cardBg.paused = true;
        return this.cardBg;
    }
    closeCardBg() {
        this.cardBg.stop();
        this.mapBg.paused = false;
    }
    /**
     * @type {sound.IMediaInstance[]}
     */
    inCardMusics = []
    showInCard(url) {
        let instance = this.get(url).play(_ => {
            instance.complete = true;
        });
        instance.complete = false;
        this.inCardMusics.push(instance);
        return instance;
    }
    stopInCard() {
        this.refreshInCard();
        for (let m of this.inCardMusics) {
            m.paused = true;
        }
    }
    runInCard() {
        this.refreshInCard();
        for (let m of this.inCardMusics) {
            m.paused = false;
        }
    }
    refreshInCard() {
        this.inCardMusics = this.inCardMusics.filter(m => !m.complete);
    }

}