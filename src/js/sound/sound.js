import { Loader, sound } from "pixi.js";
import { ressound } from "../../res";
import "pixi-sound";
import { mapBgUrl, defaultCardBgUrl } from "./util";
import { closeAllBg } from "../boot";

export class SoundManager {

    jumped = true

    constructor() { }
    /**
     * @param {function} proc 
     * @param {function} cb 
     */
    init(proc, cb) {
        if(this.jumped)return cb(); 
        this.loader = new Loader().add(ressound).on('progress', l => {
            proc(l.progress);
        }).load(_ => {
            cb();
            this.initExtra();
        });
    }
    initExtra() {
        if(this.jumped)return;
        this.mapBg = this.loader.resources[mapBgUrl].sound.play();
        this.mapBg.paused = true;
        this.mapBg.volume = closeAllBg ? 0 : 0.3;
        this.mapBg.loop = true;
    }
    /**
     * @param {string} path 
     */
    get(path) {
        return this.loader.resources[path].sound;
    }
    showMapBg() {
        if(this.jumped)return;
        if (closeAllBg) return;
        this.mapBg.paused = false;
    }
    /**
     * @param {import("../anxi/define/type").CardData} carddata 
     */
    showCardBg(carddata) {
        if(this.jumped)return;
        this.mapBg.paused = true;
        this.cardBg = this.get(carddata.bgmusic ?? defaultCardBgUrl).play();
        this.cardBg.volume = carddata.bgvolume ?? 0.5;
        this.cardBg.loop = true;
        if (closeAllBg) this.cardBg.paused = true;
        return this.cardBg;
    }
    closeCardBg() {
        if(this.jumped)return;
        this.cardBg.stop();
        this.mapBg.paused = false;
    }
    /**
     * @type {sound.IMediaInstance[]}
     */
    inCardMusics = []
    showInCard(url) {
        if(this.jumped)return {};
        let instance = this.get(url).play(_ => {
            instance.complete = true;
        });
        instance.complete = false;
        this.inCardMusics.push(instance);
        return instance;
    }
    stopInCard() {
        if(this.jumped)return;
        this.refreshInCard();
        for (let m of this.inCardMusics) {
            m.paused = true;
        }
    }
    runInCard() {
        if(this.jumped)return;
        this.refreshInCard();
        for (let m of this.inCardMusics) {
            m.paused = false;
        }
    }
    refreshInCard() {
        if(this.jumped)return;
        this.inCardMusics = this.inCardMusics.filter(m => !m.complete);
    }

}