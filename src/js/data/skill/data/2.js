import { Matrix, RenderTexture, Sprite } from "pixi.js";
import { Flyer } from "../../../anxi/atom/flyer";
import { SkillProto } from "../../../anxi/proto/skill";
import { gameApp } from "../../../util";

/**
 * 技能3 【被动】残影会在3秒后爆炸造成伤害并消失
 *       的
 */
export default new SkillProto('影攻心', '【被动】残影会在3秒后爆炸造成伤害并消失。\n【主动】与眼前最近的敌人互换位置')
    .active(true)
    .lost(60)
    .init(function () {
        this.vita.shadowEndBoom = true;
        this.vita.shadowController && (this.vita.shadowController.endBoom = true);
    })
    .execute(function () {
        let role = this.vita;
        let face = role.face;
        let monsts = role.world.selectableVitas().filter(vita => vita.group != role.group)
            .filter(monst => (monst.x - role.x * face > 0))
            .sort((m1, m2) => (m1.x - m2.x * face));
        if (monsts.length == 0) return;
        let monst = monsts[0];
        let x = role.x;
        let y = role.y;
        role.x = monst.x;
        role.y = monst.y;
        monst.x = x;
        monst.y = y;
        let container = role.viewController.view;
        let renderer = gameApp.renderer;
        const rt = RenderTexture.create({
            width: 300,
            height: 300,
        })
        let sprite = new Sprite(rt);
        sprite.position.set(container.x - 150, container.y);
        let behaveTime = 10;
        new Flyer(sprite, _ => { }).useLiveTime(behaveTime).onTime(timer => {
            sprite.alpha = 0.8 - 0.3 * timer / behaveTime;
        }).from(role).useConstSpeed([(role.x - x) / behaveTime, (role.y - y) / behaveTime]);
        renderer.render(container, rt, true, new Matrix().translate(-container.x + 150, -container.y));
    })