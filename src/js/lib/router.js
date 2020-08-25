import { Container } from "pixi.js";
import { AnxiError } from "../anxi/error/base";

export class PIXIRouter {
    static defaultOptions = {
        initer: (container, data) => { },
        refresher: (container, data) => {
            container.visible = true;
        },
        disolver: (container, data) => {
            container.visible = false;
        },
        inited: false,
        data: {}
    }
    nowPage = undefined
    constructor() {

    }
    pageHandlers = {}
    /**
     * @return {Container}
     * @param {string} pageName 
     * @param {{
     *      initer:(container:Container,data:{})=>void,
     *      refresher:(container:Container,data:{})=>void,
     *      disolver:(container:Container,data:{})=>void,
     * }} options 
     * @param {Container} container 
     */
    register(pageName, options = {}, container = new Container()) {
        if (this.pageHandlers[pageName]) throw new AnxiError('this page name has been used!');
        if (!this.nowPage) this.nowPage = pageName;
        options = Object.assign({}, this.__proto__.constructor.defaultOptions, options);
        container.visible = false;
        this.pageHandlers[pageName] = {
            container,
            ...options
        };
        return container;
    }
    to(pageName) {
        if (!(pageName in this.pageHandlers)) throw new AnxiError('page name not exests!');
        if (this.nowPage != undefined) {
            let rcomt = this.pageHandlers[this.nowPage];
            rcomt.disolver(rcomt.container, rcomt.data);
        }
        this.nowPage = pageName;
        let comt = this.pageHandlers[pageName];
        if (!comt.inited) {
            comt.inited = true;
            comt.initer(comt.container, comt.data);
        }
        comt.refresher(comt.container, comt.data);
    }
    start(pageName = this.nowPage) {
        this.to(pageName);
    }
    /**
     * @return {Container}
     */
    getContainer(pageName) {
        return this.pageHandlers[pageName].container;
    }
}