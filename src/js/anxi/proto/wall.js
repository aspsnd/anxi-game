export class WallProto {
    index
    constructor(index, name = '墙体') {
        this.index = index;
        this.name = name;
    }

    /**
     * @param {number} width 
     * @param {number} height 
     */
    size(width, height) {
        this.width = width;
        this.height = height;
        return this;
    }

    up = false;
    /**
     * 可以从下往上跳
     */
    canup() {
        this.up = true;
        return this;
    }

    down = false;
    /**
     * 可以从上往下跳
     * 如果true 那么一定可以从下往上
     */
    candown() {
        this.down = true;
        this.up = true;
        return this;
    }

    _glue = false;
    /**
     * 缚地
     */
    glue() {
        this._glue = true;
        return this;
    }

    /** 
     * @param {string} url 
     */
    src(url) {
        this.url = url;
        return this;
    }

    repeat() {
        this._repeat = true;
        return this;
    }

}
export var groundUrl = name => `./res/util/scene/ground/${name}.png`;
export var boardUrl = name => `./res/util/scene/board/${name}.png`;