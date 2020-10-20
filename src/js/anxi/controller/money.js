import { Sprite, Container } from "pixi.js";
import { Role } from "../../po/atom/role";
import { by } from "../../util";
import { World } from "../atom/world";
import { Controller } from "../controller";
const moneyUrls = [
    './res/util/role/money/1.png',
    './res/util/role/money/2.png',
    './res/util/role/money/3.png',
];
const moneyUrlLength = moneyUrls.length;
export class MoneyController extends Controller {
    /**
     * @type {Role}
     */
    role
    /**
     * @type [Sprite]
     */
    moneys = []
    constructor(role) {
        super(role);
        this.role = role;
        role.on('timing', this.onTimer.bind(this), true);
    }
    onTimer() {
        let x = this.role.x;
        let y = this.role.centerY;
        this.moneys = this.moneys.filter(money => {
            if (money.stay > 0) {
                money.stay--;
                if (money.stay == 0) {
                    let distance = ((money.x - x) ** 2 + (money.y - y) ** 2) ** 0.5;
                    money.last = Math.round(distance * 0.35);
                }
                return true;
            }
            let ex = x - money.x;
            let ey = y - money.y;
            money.x += ex / money.last;
            money.y += ey / money.last;
            money.last--;
            money.alpha += money.__nextAlpha ? 0.02 : -0.02;
            let alpha = money.alpha;
            if (alpha <= 0.3) {
                money.__nextAlpha = true;
            } else if (alpha >= 0.99) {
                money.__nextAlpha = false;
            }
            if (money.last == 0) {
                this.role.getMoney(money.__value || 0, 0);
                money.destroy();
                return false;
            }
            return true;
        });
    }
    addMoney(_money, ...pos) {
        let money = new Container();
        let ss = Math.ceil(Math.random() * 4) + 1;
        for (let i = 0; i < ss; i++) {
            let s = new Sprite(by(moneyUrls[Math.floor(Math.random() * moneyUrlLength)]));
            s.x = (Math.random() - 0.5) * 20;
            s.y = (Math.random() - 0.5) * 20;
            money.addChild(s);
        }
        money.__value = _money;
        money.alpha = 0.3 + Math.floor(Math.random() * 30) * 0.02;
        money.__nextAlpha = Math.random() > 0.5;
        money.position.set(...pos);
        money.stay = 50;
        World.instance.vitaContainer.addChild(money);
        this.moneys.push(money);
    }
    refresh() {
        this.moneys = [];
    }
}