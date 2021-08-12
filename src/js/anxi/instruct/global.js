import { ItemEvent, ItemEventDispatcher } from "../event";

export const GlobalEventCaster = new ItemEventDispatcher();
export const GlobalDowning = {};
setInterval(_ => {
    for (let key in GlobalDowning) {
        if (!GlobalDowning[key]) continue;
        GlobalEventCaster.on(new ItemEvent('keycontinue', { keyCode: key }, GlobalDowning[key]));
    }
}, 20);
document.addEventListener('keydown', e => {
    GlobalEventCaster.on(new ItemEvent('keydown', e, GlobalDowning[e.keyCode]));
    if (GlobalDowning[e.keyCode]) {
        GlobalEventCaster.on(new ItemEvent(`dckey_${e.key.toLowerCase()}`, e));
        GlobalEventCaster.on(new ItemEvent(`dccode_${e.keyCode}`, e));
    } else {
        GlobalDowning[e.keyCode] = true;
        GlobalEventCaster.on(new ItemEvent('realkeydown', e, GlobalDowning[e.keyCode]));
        GlobalEventCaster.on(new ItemEvent(`dkey_${e.key.toLowerCase()}`, e));
        GlobalEventCaster.on(new ItemEvent(`dcode_${e.keyCode}`, e));
    }
})
document.addEventListener('keyup', e => {
    GlobalDowning[e.keyCode] = false;
    GlobalEventCaster.on(new ItemEvent('keyup', e));
    GlobalEventCaster.on(new ItemEvent(`ukey_${e.key.toLowerCase()}`, e));
    GlobalEventCaster.on(new ItemEvent(`ucode_${e.keyCode}`, e));
})
window.GlobalDowning = GlobalDowning;
