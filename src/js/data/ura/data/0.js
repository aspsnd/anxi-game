import { StateCache, StateItem } from "../../../anxi/controller/state";
import { URAProto } from "../../../anxi/proto/ura";

export const commonUra = new URAProto(0).useCaculater(function (prop, bv) {
    if (!this.uring) return 0;
    if (prop == 'speed') return 0.8;
    return ['atk', 'def'].includes(prop) ? bv : 0;
}).onGet(function () {
    this.targetItemId = this.belonger.stateController.insertState(StateCache.URA, new StateItem(0, true));
}).onLost(function () {
    this.belonger.stateController.removeStateItem(StateCache.URA, this.targetItemId);
})
export const unURAura = new URAProto(1).useCaculater(function (prop, bv) {
    if (!this.uring) return 0;
    if (prop == 'atk') return bv * 1.2;
    if (prop == 'def') return bv * 0.8;
    return 0;
}).onGet(function () {
    this.targetItemId = this.belonger.stateController.insertState(StateCache.fast, new StateItem(0, true, 1.5));
}).onLost(function () {
    this.belonger.stateController.removeStateItem(StateCache.fast, this.targetItemId);
})