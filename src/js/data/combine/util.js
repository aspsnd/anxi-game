import { CombineRules } from "./rule";

class CombineUtilClass {
    constructor() {

    }
    /**
     * @param {{kind:number,id:number}[]} things 
     */
    getProduct(thing_Ids) {
        let result = CombineRules.find(rule => {
            let canCombine = false;
            if (Array.isArray(rule.thing)) {
                canCombine = rule.thing.some(onerule => {
                    return onerule.every((value,index)=>value == thing_Ids[index]);
                })
            } else {
                canCombine = rule.thing(thing_Ids);
            }
            return canCombine;
        })
        return result || false;
    }
}
export const CombineUtil = new CombineUtilClass();