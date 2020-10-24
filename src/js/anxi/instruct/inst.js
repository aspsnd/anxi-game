import { Role } from "../../po/atom/role";
import { AIController } from "../controller/ai/ai";
import { ItemEvent } from "../event";
import { GlobalDowning, GlobalEventCaster } from "./global";

export const SuperInstructor = {
    player(_keys = 'wsadjkyuiol h') {
        let keys = typeof _keys == 'string' ? _keys.split('') : _keys;
        return function (vita) {
            let comt1 = GlobalEventCaster.on('keydown', e => {
                if (!vita?.world?.running) return;
                /**
                 * @type {KeyboardEvent}
                 */
                let event = e.value;
                let downing = e.from;
                let key = event.key;
                let index = findIndex(keys, event);
                if (!downing) {
                    switch (index) {
                        case 0: vita.on(new ItemEvent('finishcard', key)); break;
                        case 2: vita.on(new ItemEvent('wantleft', key)); break;
                        case 3: vita.on(new ItemEvent('wantright', key)); break;
                        case 4: vita.on(new ItemEvent('wantattack', key)); break;
                        case 5: vita.on(new ItemEvent(GlobalDowning[keys[1]] ? 'wantdown' : 'wantjump', key)); break;
                        case 6: vita.on(new ItemEvent('wantskill', 1)); break;
                        case 7: vita.on(new ItemEvent('wantskill', 2)); break;
                        case 8: vita.on(new ItemEvent('wantskill', 3)); break;
                        case 9: vita.on(new ItemEvent('wantskill', 4)); break;
                        case 10: vita.on(new ItemEvent('wantskill', 5)); break;
                        case 11: vita.on(new ItemEvent('wantura', 6)); break;
                        case 12: vita.on(new ItemEvent('wantskill', 0)); break;
                    }
                } else {
                    switch (index) {
                        case 2: vita.on(new ItemEvent('continueleft', key)); break;
                        case 3: vita.on(new ItemEvent('continueright', key)); break;
                    }
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
                    case 2: vita.on(new ItemEvent('cancelleft', key)); break;
                    case 3: vita.on(new ItemEvent('cancelright', key)); break;
                    case 6: vita.on(new ItemEvent('cancelskill', 1)); break;
                    case 7: vita.on(new ItemEvent('cancelskill', 2)); break;
                    case 8: vita.on(new ItemEvent('cancelskill', 3)); break;
                    case 9: vita.on(new ItemEvent('cancelskill', 4)); break;
                    case 10: vita.on(new ItemEvent('cancelskill', 5)); break;
                    case 12: vita.on(new ItemEvent('cancelskill', 0)); break;
                }
            })
            if (vita instanceof Role) return;
            let comt3 = vita.once('dead', e => {
                GlobalEventCaster.removeHandler(comt1);
                GlobalEventCaster.removeHandler(comt2);
                vita.world.removeHandler(comt4);
            })
            let comt4 = vita.world.once('die', e => {
                GlobalEventCaster.removeHandler(comt1);
                GlobalEventCaster.removeHandler(comt2);
                vita.removeHandler(comt3);
            })
        }
    },
    defaultPlayer_old: 'wsadjkyuiol h',
    defaultPlayer: [87, 83, 65, 68, 74, 75, 89, 85, 73, 79, 76, 32, 72],
    extraPlayer_old: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', '1', '2', '8', '4', '5', '6', '3', '0', '7'],
    extraPlayer: [18, 40, 37, 39, 97, 98, 104, 100, 101, 102, 99, 96, 103],
    testPlayer: [-1, -1, 78, 77, 188, 190, 191, 186, 222, 220],
    artificialIntelligence() {
        return function (vita) {
            vita.aiController = new AIController(vita);
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