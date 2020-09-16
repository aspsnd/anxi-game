import { ItemEvent } from "../event";
// import { AI } from "./ai";
export const Instructer = {
    player(_keys = 'wsadjkyuiol h') {
        let keys = typeof _keys == 'string' ? _keys.split('') : _keys;
        return function (vita) {
            //从冻结模式改为节流模式 ??? 没改啊
            let downing = {};
            document.addEventListener('keydown', function (e) {
                if (downing[e.keyCode]) return;
                downing[e.keyCode] = true;
                down(e);
            });
            document.addEventListener('keyup', function (e) {
                downing[e.keyCode] = false;
                up(e);
            });
            function down(e) {
                if (vita.dead || !vita?.world?.running) return;
                let index = findIndex(keys, e);
                let key = e.key;
                switch (index) {
                    case 0: vita.on(new ItemEvent('finishcard', key)); break;
                    case 2: vita.on(new ItemEvent('wantleft', key)); break;
                    case 3: vita.on(new ItemEvent('wantright', key)); break;
                    case 4: vita.on(new ItemEvent('wantattack', key)); break;
                    case 5: vita.on(new ItemEvent(downing[keys[1]] ? 'wantdown' : 'wantjump', key)); break;
                    case 6: vita.on(new ItemEvent('wantskill', 1)); break;
                    case 7: vita.on(new ItemEvent('wantskill', 2)); break;
                    case 8: vita.on(new ItemEvent('wantskill', 3)); break;
                    case 9: vita.on(new ItemEvent('wantskill', 4)); break;
                    case 10: vita.on(new ItemEvent('wantskill', 5)); break;
                    case 11: vita.on(new ItemEvent('wantura', 6)); break;
                    case 12: vita.on(new ItemEvent('wantskill', 0)); break;
                }
            }
            function up(e) {
                if (vita.dead || !vita?.world?.running) return;
                let index = findIndex(keys, e);
                let key = e.key;
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
            }
            let inter = setInterval(() => {
                if (!vita.live) {
                    clearInterval(inter);
                    return;
                }
                for (let key in downing) {
                    if (downing[key]) {
                        let index = keys.indexOf(key);
                        switch (index) {
                            case 2: vita.on(new ItemEvent('continueleft', key)); break;
                            case 3: vita.on(new ItemEvent('continueright', key)); break;
                        }
                    }
                }
            }, 200);
        }
    },
    defaultPlayer_old: 'wsadjkyuiol h',
    defaultPlayer: [87, 83, 65, 68, 74, 75, 89, 85, 73, 79, 76, 32, 72],
    extraPlayer_old: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', '1', '2', '8', '4', '5', '6', '3', '0', '7'],
    extraPlayer: [18, 40, 37, 39, 97, 98, 104, 100, 101, 102, 99, 96, 103],
    testPlayer: [-1, -1, 78, 77, 188, 190, 191, 186, 222, 220],
    artificialIntelligence(_intelli) {
        let intelli = _intelli;
        return function (vita) {
            vita.ai = new AI(vita, intelli ?? vita.intelli ?? vita.manager?.ai?.intelli ?? 3);
        }
    }
};
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