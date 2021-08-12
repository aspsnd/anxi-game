import { Role } from "../../po/atom/role";
import { AIController } from "../controller/ai/ai";
import { ItemEvent } from "../event";
import { GlobalDowning, GlobalEventCaster } from "./global";

export const SuperInstructor = {
    player(_keys = 'wsadjkyuiol h') {
        let keys = typeof _keys == 'string' ? _keys.split('') : _keys;
        return function (vita) {
            let comt1 = GlobalEventCaster.on('realkeydown', e => {
                if (!vita?.world?.running) return;
                /**
                 * @type {KeyboardEvent}
                 */
                let event = e.value;
                let key = event.key;
                let index = findIndex(keys, event);
                switch (index) {
                    case 0: vita.on(new ItemEvent('finishcard')); break;
                    case 2: vita.on(new ItemEvent('wantleft')); break;
                    case 3: vita.on(new ItemEvent('wantright')); break;
                    case 4: vita.on(new ItemEvent('wantattack')); break;
                    case 5: vita.on(new ItemEvent(GlobalDowning[keys[1]] ? 'wantdown' : 'wantjump')); break;
                    case 6: vita.on(new ItemEvent('wantskill', 1)); break;
                    case 7: vita.on(new ItemEvent('wantskill', 2)); break;
                    case 8: vita.on(new ItemEvent('wantskill', 3)); break;
                    case 9: vita.on(new ItemEvent('wantskill', 4)); break;
                    case 10: vita.on(new ItemEvent('wantskill', 5)); break;
                    case 11: vita.on(new ItemEvent('wantura')); break;
                    case 12: vita.on(new ItemEvent('wantskill', 0)); break;
                }
            });
            let comt2 = GlobalEventCaster.on('keyup', e => {
                if (!vita?.world?.running) return;
                /**
                 * @type {KeyboardEvent}
                 */
                let event = e.value;
                let key = event.key;
                let index = findIndex(keys, event);
                switch (index) {
                    case 2: vita.on(new ItemEvent('cancelleft')); break;
                    case 3: vita.on(new ItemEvent('cancelright')); break;
                    case 6: vita.on(new ItemEvent('cancelskill', 1)); break;
                    case 7: vita.on(new ItemEvent('cancelskill', 2)); break;
                    case 8: vita.on(new ItemEvent('cancelskill', 3)); break;
                    case 9: vita.on(new ItemEvent('cancelskill', 4)); break;
                    case 10: vita.on(new ItemEvent('cancelskill', 5)); break;
                    case 12: vita.on(new ItemEvent('cancelskill', 0)); break;
                }
            })
            let comt3 = GlobalEventCaster.on('keycontinue', e => {
                if (!vita?.world?.running) return;
                /**
                 * @type {KeyboardEvent}
                 */
                let event = e.value;
                let index = findIndex(keys, event);
                switch (index) {
                    case 2: vita.on(new ItemEvent('continueleft')); break;
                    case 3: vita.on(new ItemEvent('continueright')); break;
                }
            })
            if (vita instanceof Role) return;
            let comt4 = vita.once('dead', e => {
                GlobalEventCaster.removeHandler(comt1);
                GlobalEventCaster.removeHandler(comt2);
                GlobalEventCaster.removeHandler(comt3);
                vita.world.removeHandler(comt5);
            })
            let comt5 = vita.world.once('die', e => {
                GlobalEventCaster.removeHandler(comt1);
                GlobalEventCaster.removeHandler(comt2);
                GlobalEventCaster.removeHandler(comt3);
                vita.removeHandler(comt4);
            })
        }
    },
    defaultPlayer_old: 'wsadjkyuiol h',
    defaultPlayer: [87, 83, 65, 68, 74, 75, 89, 85, 73, 79, 76, 32, 72],
    extraPlayer_old: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', '1', '2', '8', '4', '5', '6', '3', '0', '7'],
    extraPlayer: [38, 40, 37, 39, 97, 98, 104, 100, 101, 102, 99, 96, 103],
    testPlayer: [-1, -1, 78, 77, 188, 190, 191, 186, 222, 220],
    artificialIntelligence() {
        return function (vita) {
            vita.aiController = new AIController(vita);
        }
    },
    mobilePlayer() {
        return function (vita) {
            let comt = GlobalEventCaster.on(e => e.type.startsWith('wantmobile'), e => {
                if (!vita?.world?.running) return;
                vita.on(e);
            });
            let comt1 = GlobalEventCaster.on('copymobile', e => {
                if (!vita?.world?.running) return;
                vita.on(e.value());
            });
            if (vita instanceof Role) return;
            let comt4 = vita.once('dead', e => {
                GlobalEventCaster.removeHandler(comt);
                GlobalEventCaster.removeHandler(comt1);
                vita.world.removeHandler(comt5);
            })
            let comt5 = vita.world.once('die', e => {
                GlobalEventCaster.removeHandler(comt);
                GlobalEventCaster.removeHandler(comt1);
                vita.removeHandler(comt4);
            })
        }
    }
}
/**
 * 
 * @param {[]} keys 
 * @param {KeyboardEvent} e 
 */
function findIndex(keys, e) {
    return keys.findIndex(condition => {
        let type = typeof condition;
        if (type == 'string') {
            return condition == e.key;
        } else if (type == 'number') {
            return condition == e.keyCode;
        }
        throw new Error('键盘设置有误');
    })
}