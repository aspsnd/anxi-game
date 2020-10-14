import { Matrix, RenderTexture, Sprite } from "pixi.js";
import { Flyer } from "../../../../anxi/atom/flyer";
import { ItemEvent } from "../../../../anxi/event";
import { SkillProto } from "../../../../anxi/proto/skill";
import { gameApp } from "../../../../util";

export default new SkillProto(13, '时空仓库', '使用自己的时空仓库。激活后，每秒失去10+1%最大蓝量的蓝，使自己时间速度加快。【少于10%最大蓝量或100无法使用】')
    .active(true)
    .lost(0)
    .freezing(60)
    .init(function (data) {
        data.opened = false;
        data.lastOpenTime = -1;
        data.timeRate = 0.5;
    })
    .execute(function () {
        let data = this.data;
        let vita = this.vita;
        let timer = vita.timer;
        if (data.opened) {
            data.opened = false;
            vita.timeChangeRates.splice(vita.timeChangeRates.indexOf(data.timeRate), 1);
        } else {
            if (vita.varProp.mp < vita.prop.mp * 0.1 || vita.varProp.mp < 100) return;
            data.opened = true;
            data.lastOpenTime = timer;
            vita.timeChangeRates.push(data.timeRate);
        }
        vita.needCompute = true;
    })
    .initListen('timing', (vita, skill) => e => {
        let timer = vita.timer;
        let data = skill.data;
        let { opened, lastOpenTime } = data;
        if (!opened) return;
        let oneTime = 60;
        let behaveTime = oneTime * 3;

        if ((timer - lastOpenTime) % oneTime == 10) {
            let container = vita.viewController.view;
            let renderer = gameApp.renderer;
            const rt = RenderTexture.create({
                width: 300,
                height: 300,
            })
            let sprite = new Sprite(rt);
            sprite.position.set(container.x - 150, container.y);
            new Flyer(sprite).useLiveTime(behaveTime).onTime(timer => {
                sprite.alpha = 0.5 - 0.5 * timer / behaveTime;
            }).from(vita);
            renderer.render(container, rt, true, new Matrix().translate(-container.x + 150, -container.y));
        }
        if ((timer - lastOpenTime) % 60 != 2) return;
        let nmp = vita.varProp.mp;
        let mp = vita.prop.mp;
        if (nmp < 100 || nmp < mp * 0.1) {
            data.opened = false;
            vita.timeChangeRates.splice(vita.timeChangeRates.indexOf(data.timeRate), 1);
            vita.needCompute = true;
        } else {
            let needmp = (10 + nmp * 0.01) | 0;
            if (needmp > nmp) throw new Error('you must to find this bug!');
            vita.varProp.mp -= needmp;
            vita.on(new ItemEvent('nmpchange', [nmp, vita.varProp.mp], skill));
        }
    })