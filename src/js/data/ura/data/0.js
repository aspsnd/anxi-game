import { StateCache, StateItem } from "../../../anxi/controller/state";
import { URAProto } from "../../../anxi/proto/ura";

export const commonUra = new URAProto(0).useCaculater(function (prop, bv) {
    if (!this.uring) return 0;
    return ['atk', 'def'].includes(prop) ? bv * 0.8 : 0;
}).onGet(function () {
    this.targetItemIdURA = this.belonger.stateController.insertState(StateCache.URA, new StateItem(0, true));
    this.targetItemIdSpeed = this.belonger.stateController.insertState(StateCache.fast, new StateItem(0, true, 0.5));
}).onLost(function () {
    this.belonger.stateController.removeStateItem(StateCache.URA, this.targetItemIdURA);
    this.belonger.stateController.removeStateItem(StateCache.fast, this.targetItemIdSpeed);
});
export const unURAura = new URAProto(1).useCaculater(function (prop, bv) {
    if (!this.uring) return 0;
    if (prop == 'atk') return bv * 1;
    if (prop == 'def') return bv * 0.6;
    return 0;
}).onGet(function () {
    this.targetItemId = this.belonger.stateController.insertState(StateCache.fast, new StateItem(0, true, 1));
}).onLost(function () {
    this.belonger.stateController.removeStateItem(StateCache.fast, this.targetItemId);
})