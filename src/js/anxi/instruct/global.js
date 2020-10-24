import { ItemEvent, ItemEventDispatcher } from "../event";

export const GlobalEventCaster = new ItemEventDispatcher();
export const GlobalDowning = {};

let timerfreeze = {};
setInterval(_ => {
    for (let key in timerfreeze) {
        timerfreeze[key] = false;
    }
}, 20);
document.addEventListener('keydown', e => {
    if (timerfreeze[e.keyCode]) return;
    timerfreeze[e.keyCode] = true;
    GlobalEventCaster.on(new ItemEvent('keydown', e, GlobalDowning[e.keyCode]));
    if (GlobalDowning[e.keyCode]) {
        GlobalDowning[e.keyCode] = true;
        GlobalEventCaster.on(new ItemEvent(`dckey_${e.key.toLowerCase()}`, e));
        GlobalEventCaster.on(new ItemEvent(`dccode_${e.keyCode}`, e));
    } else {
        GlobalDowning[e.keyCode] = true;
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