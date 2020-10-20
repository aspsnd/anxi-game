import { StateCache } from "../../state";
import { Instruct } from "../instruct";
import { BehaviorTree } from "./base";
import { FreeNode } from "./node/free";
import { InCtrlNode } from "./node/inctrl";

export const AnxiMonstBehaviorTree = new BehaviorTree(vita => {
    //是否为自身施法，攻击状态
    if (vita.stateController.includes(StateCache.attack)) {
        return NullNode.getNextInstruct(vita);
    } else if (vita.stateController.includes(StateCache.dizzy, StateCache.beHitBehind)) {//被控制状态
        return InCtrlNode.getNextInstruct(vita);
    } else {//自由状态
        return FreeNode.getNextInstruct(vita);
    }
})
export const NullNode = new BehaviorTree(vita => {
    // throw new Error();
    return new Instruct();
});