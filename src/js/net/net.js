import { ItemEvent, ItemEventDispatcher } from "../anxi/event";
import { netBaseUrl } from "../boot";
import { Role } from "../po/atom/role";

export class WSNet extends ItemEventDispatcher {
    /**
     * @type {Role[]}
     */
    roles = []
    ws = new WebSocket(netBaseUrl.replace('http', 'ws'));
    constructor() {
        super();
        this.ws.onopen = _ => {
            this.on(new ItemEvent('connection'));
        };
        this.ws.onmessage = e => {
            /**
             * @type {{
             *  global:boolean
             *  role:number,
             *  name:string,
             *  value:any,
             *  from:any
             * }}
             */
            let data = JSON.parse(e.data);
            if (data.global) {
                this.on(new ItemEvent(data.name, data.value, data));
            } else {
                this.on(new ItemEvent('gm', data));
            };
        };
    }
    send(data){
        this.ws.send(JSON.stringify(data));
    }
}
let cache = undefined;
/**
 * @returns {WSNet}
 */
export function getWS() {
    if (!cache) {
        cache = new WSNet();
    }
    return cache;
}