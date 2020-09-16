export class ActionData {
    constructor(actionData) {
        Object.assign(this, actionData);
    }
    /**
     * @return {(actionData:import("../define/type").CertainActionData | import("../define/type").AllActionData)=>this}
     * @param {import("../define/type").ComtName} comt 
     * @param {number} stateName
     */
    bind(stateName, comt) {
        return comt ? (actionData => {
            if (!this[stateName]) {
                this[stateName] = {};
            }
            this[stateName][comt] = actionData;
            return this;
        }) : (actionData => {
            this[stateName] = actionData;
            return this;
        })
    }
}
