import * as PIXI from "pixi.js";
const { Application, Text, Graphics, Sprite } = PIXI;
import { Tink } from "../js/anxi/lib/tink"
import { res } from "../res";
import Dust from "pixi-dust";
import { PIXIRouter } from "./lib/router";
export const jumpContinue = {
    jump: 30,
    jumpSec: 30
};
export const jumpSpeed = {
    jump: (jumpTime, speed) => (2.25 - 0.0025 * jumpTime * jumpTime) * speed,
    jumpSec: (jumpTime, speed) => (2.25 - 0.0025 * jumpTime * jumpTime) * speed
};
export const GameWidth = 960;
export const GameHeight = 590;
export const CardWidth = 4500;
export const gameWindow = appCanvas;
export const gameApp = new Application({
    view: appCanvas,
    width: GameWidth,
    height: GameHeight,
    transparent: true,
    autoStart: false,
    antialias: true,
});
export const gameRouter = new PIXIRouter();
const Bump = require('pixi-plugin-bump');
export const gameBump = new Bump();
export const gameTink = new Tink(PIXI, appCanvas);
export const gameDust = new Dust(PIXI);
gameApp.ticker.add(() => gameDust.update());
gameApp.ticker.add(() => gameTink.update());
export function formatDate(date, fmt) {
    var o = {
        "M+": date.getMonth() + 1,                 //月份 
        "d+": date.getDate(),                    //日 
        "h+": date.getHours(),                   //小时 
        "m+": date.getMinutes(),                 //分 
        "s+": date.getSeconds(),                 //秒 
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
        "S": date.getMilliseconds()             //毫秒 
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (const k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}
export const DynamicLoadMode = true;
export function by(...url) {
    return baseBy(url.find(u => res.includes(u)));
}
export function directBy(durl, url = './res/util/' + durl) {
    // return res.includes(url) ? gameApp.loader.resources[url].texture : null;
    return baseBy(url);
}
function baseBy(url) {
    if (url == undefined) return null;
    return DynamicLoadMode ? PIXI.Texture.from(url) : gameApp.loader.resources[url].texture;
}
const baseDefaultViewSrc = './res/util/role';
export const getDefaultView = function (index) {
    return {
        head: `${baseDefaultViewSrc}/${index}/1.png`,
        body: `${baseDefaultViewSrc}/${index}/2.png`,
        hand_l: `${baseDefaultViewSrc}/${index}/3.png`,
        hand_r: `${baseDefaultViewSrc}/${index}/4.png`,
        leg_l: `${baseDefaultViewSrc}/${index}/5.png`,
        leg_r: `${baseDefaultViewSrc}/${index}/6.png`,
        weapon: `${baseDefaultViewSrc}/${index}/7.png`,
    }
}
const baseMonstDefaultViewSrc = './res/util/monst';
export const getDefaultMonstView = function (index) {
    return {
        head: `${baseMonstDefaultViewSrc}/${index}/1.png`,
        body: `${baseMonstDefaultViewSrc}/${index}/2.png`,
        hand_l: `${baseMonstDefaultViewSrc}/${index}/3.png`,
        hand_r: `${baseMonstDefaultViewSrc}/${index}/4.png`,
        leg_l: `${baseMonstDefaultViewSrc}/${index}/5.png`,
        leg_r: `${baseMonstDefaultViewSrc}/${index}/6.png`,
        weapon: `${baseMonstDefaultViewSrc}/${index}/7.png`,
        wing: `${baseMonstDefaultViewSrc}/${index}/8.png`
    }
}
export class IFC {
    final = false
    constructor(cdt) {
        this.cdt = cdt;
    }
    set(value) {
        this.value = value;
        return this;
    }
    less(v, value) {
        if (this.cdt < v && !this.final) {
            this.value = value;
            this.final = true;
        }
        return this;
    }
    more(v, value) {
        if (this.cdt > v && !this.final) {
            this.value = value;
            this.final = true;
        }
        return this;
    }
    eLess(v, value) {
        if (this.cdt <= v && !this.final) {
            this.value = value;
            this.final = true;
        }
        return this;
    }
    eMore(v, value) {
        if (this.cdt >= v && !this.final) {
            this.value = value;
            this.final = true;
        }
        return this;
    }
    equal(v, value) {
        if (this.cdt == v && !this.final) {
            this.value = value;
            this.final = true;
        }
        return this;
    }
    if(bool, value) {
        if (bool && !this.final) {
            this.value = value;
            this.final = true;
        }
        return this;
    }
    null(value) {
        this.value ?? (this.value = value);
        this.final = true;
        return this;
    }
}
export const GTip = ZY.myAler('zy-aler g-tip', {}, function () {
    this.cover.classList.add('pon');
    setTimeout(n => {
        this.remove();
    }, 1000);
});
export const GDanger = ZY.myAler('zy-aler g-tip danger', {}, function () {
    this.cover.classList.add('pon');
    setTimeout(n => {
        this.remove();
    }, 1000);
});
export function tween() {
    return (typeof arguments[1] == 'number' ? complexTween : simpleTween)(...arguments);
}
function simpleTween(begin, end, length) {
    let len = begin.length;
    let addrate = 1 / (length - 1);
    let added = begin.map((v, i) => (end[i] - v) * addrate);
    return Array.from(new Array(length), (v, k) => Array.from(new Array(len), (a, b) => begin[b] + added[b] * k));
}
export function complexTween(...args) {
    let results = [];
    results.push(args[0]);
    let len = args.length;
    let arrlen = args[0].length;
    for (let i = 0; i < len - 2; i += 2) {
        let begin = args[i];
        let end = args[i + 2];
        let addrate = 1 / args[i + 1];
        let added = begin.map((v, c) => (end[c] - v) * addrate);
        results.push(...Array.from(new Array(args[i + 1]), (v, k) => Array.from(new Array(arrlen), (a, b) => begin[b] + added[b] * (k + 1))));
    }
    return results;
}
export const defaultBackGroundMusicPath = "./res/audio/bg.mp3";
export const defaultGameBackGroundMusicPath = './res/audil/bg.mp3';
export const r2a = r => r * 180 / Math.PI;
export const a2r = a => a * Math.PI / 180;
export const randomInt = (min, max) => (min + Math.random() * (max + 1 - min)) | 0
export const randomNode = arr => arr[(arr.length * Math.random()) | 0];
export const getSkillIcon = index => res.includes(`./res/util/icon/skill/${index}.png`) ? `./res/util/icon/skill/${index}.png` : './res/util/icon/skill/default.png';
export const getTalentIcon = index => res.includes(`./res/util/icon/talent/${index}.png`) ? `./res/util/icon/talent/${index}.png` : './res/util/icon/talent/default.png';
export const loadAndAfter = callback => {
    gameApp.loader.add(['./res/util/_load/sec.png']).load(_ => {
        let i = 0;
        const loadingFunction = () => {
            gameDust.update();
            if (i++ % 25 == 0) {
                gameDust.create(
                    480, 650,
                    // 480,295,
                    () => new Sprite(gameApp.loader.resources['./res/util/_load/sec.png'].texture),
                    gameApp.stage,
                    50,
                    -0.05,
                    true,
                    undefined, undefined,
                    // -Math.PI*0.75,-Math.PI*0.25,
                    50, 75,
                    1, 2,
                    0, 10,
                    0, 0.05,
                    0.1, 0.1
                );
            }
        };
        gameApp.ticker.add(loadingFunction);
        var style = {
            fontFamily: 'Arial',
            fontSize: '150px',
            fontWeight: 'bold',
            fill: 'transparent',
            stroke: '#00dddd',
            strokeThickness: 3,
            dropShadow: true,
            dropShadowColor: '#00ddaa',
            dropShadowAlpha: 0.35,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 13,
            dropShadowBlur: 10,
            wordWrap: false,
        }
        var t = new Text('火柴人之梦', style);
        t.x = (GameWidth - t.width) / 2;
        t.y = 100;
        gameApp.stage.addChild(t);
        var g = new Graphics();
        g.lineStyle(1, 0xaaaaaa);
        g.beginFill(0xff3333);
        g.drawRect(-GameWidth, GameHeight - 180, GameWidth, 10);
        g.endFill();
        gameApp.stage.addChild(g);
        var perw = GameWidth * 0.01;
        if (DynamicLoadMode) {
            gameApp.ticker.remove(loadingFunction);
                setTimeout(_ => {
                    gameApp.stage.removeChildren();
                    callback();
                })
        } else {
            gameApp.loader.add(res).on('progress', function (p) {
                g.x = p.progress * perw;
            }).load(() => {
                gameApp.ticker.remove(loadingFunction);
                setTimeout(_ => {
                    gameApp.stage.removeChildren();
                    callback();
                })
            });
        }

    });
}