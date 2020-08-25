var ZY = {};
ZY.lazyload = function () {
    var screenHeight = window.innerHeight || document.documentElement.clientHeight;
    function reload() {
        var imgs = document.querySelectorAll('img:not([src])');
        imgs.forEach(img => {
            var top = img.getBoundingClientRect().top;
            if (top > 0 && screenHeight - top >= 80) {
                img.src = img.dataset.src;
            }
        })
    }
    window.addEventListener('load', reload);
    document.onscroll = dedou(reload);
    function dedou(callback, timing = 100) {
        var freezing = false;
        return function () {
            if (freezing) return;
            freezing = true;
            setTimeout(function () {
                freezing = false;
            }, timing);
            callback(...arguments);
        }
    }
};
ZY.LSUser = function (key = 'sporter') {
    var base = function () {
        try {
            return JSON.parse(localStorage[key]);
        } catch (e) {
            return {};
        }
    }();
    var user = ZY.timingObject(base, function (target) {
        localStorage[key] = JSON.stringify(base);
    });
    return user;
}
ZY.timingObject = function (object, onChange) {
    const handler = {
        get(target, property, receiver) {
            try {
                return new Proxy(target[property], handler);
                // return target[property];
            } catch (err) {
                return Reflect.get(target, property, receiver);
            }
        },
        defineProperty(target, property, descriptor) {
            var res = Reflect.defineProperty(target, property, descriptor);
            onChange(object);
            return res;
        },
        deleteProperty(target, property) {
            var res = Reflect.deleteProperty(target, property);
            onChange(object);
            return res;
        }
    };
    return new Proxy(object, handler);
};
// !function () {
ZY.myAler_defaultJson = {};
ZY.myAler = function (aler = 'zy-aler', defaultJson = ZY.myAler_defaultJson, extre = function () { }) {
    var body = document.body;
    return function (json = defaultJson, cb2) {
        var defaults = { ...this.__proto__.defaultJson, ...defaultJson };
        if ((typeof json) == 'string') {
            this.json = defaults;
            this.json.text = json;
            this.json.callback = cb2 || defaults.callback;
        } else {
            this.json = { ...defaults, ...json };
        }
        this.bool = false;
        var dom = document.createElement('div');
        dom.className = aler;
        var acover = document.createElement('div');
        acover.className = "zy-acover";
        acover.appendChild(dom);
        var atitle = document.createElement('div');
        atitle.innerText = this.json.title || 'title';
        atitle.className = 'title';
        dom.appendChild(atitle);
        var atext = document.createElement('div');
        atext.innerText = this.json.text || 'content';
        atext.className = 'text';
        dom.appendChild(atext);
        var abo1 = document.createElement('div');
        abo1.innerText = this.json.b1 || '确认';
        abo1.className = 'bo1';
        dom.appendChild(abo1);
        var abo2 = document.createElement('div');
        abo2.innerText = this.json.b2 || '取消';
        abo2.className = 'bo2';
        dom.appendChild(abo2);
        abo1.onclick = () => {
            this.bool = true;
            this.remove();
        }
        abo2.onclick = () => {
            this.bool = false;
            this.remove();
        }
        body.appendChild(acover);
        this.remove = () => {
            acover.remove();
            (this.json.callback || (() => { }))(this.bool);
        }
        this.cover = acover;
        this.aler = dom;
        this.text = atext;
        this.title = atitle;
        this.bo1 = abo1;
        this.bo2 = abo2;
        extre.call(this, ...arguments);
    }
}
ZY.myAler.Question = ZY.myAler('zy-aler');
ZY.myAler.Loading = ZY.myAler('zy-aler zy-only');
ZY.myAler.Aler = ZY.myAler('zy-aler zy-maler');

ZY.TR = {};
ZY.TR.init = (className = 'default') => {
    document.addEventListener('click', (e) => {
        var x = e.pageX, y = e.clientY;
        var dom = document.createElement('div');
        dom.className = 'zy-tr ' + className;
        dom.style.top = y + 'px';
        dom.style.left = x + 'px';
        dom.style.backgroundColor = ZY.randomColor();
        document.body.appendChild(dom);
        setTimeout(() => {
            dom.remove();
        }, 500)
    })
}

ZY.randomColor = function randomColor() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return `rgb(${r},${g},${b})`;
}
ZY.Inputer = ZY.myAler('zy-aler zy-inputer', { title: '请输入' }, function () {
    this.title.innerText = this.json.text || this.json.title;
    this.input = this.json.textarea ? document.createElement('textarea') : document.createElement('input');
    var input = this.input;
    if (arguments[2]) input.value = arguments[2];
    input.className = 'zy-aler-input';
    input.onkeydown = _ => {
        if (_.key == 'Enter') {
            this.bool = true;
            this.remove();
        }
    }
    this.aler.replaceChild(input, this.text);
    this.remove = function () {
        this.cover.remove();
        (this.json.callback || (() => { }))(this.bool, input.value);
    }
    input.focus();
});
ZY.Tip = ZY.myAler('zy-aler zy-only zy-timer', {}, function () {
    setTimeout(n => {
        this.remove();
    }, 1000);
});
//     ZY.myAler = myAler;
//     ZY.TR = TR;
//     ZY.randomColor = randomColor;
//     ZY.Inputer = Inputer;
//     ZY.Tip = Tip;
// }();
// !function () {
/**
 * 该版本所有router的path均视作不带#的 dom元素的path和target都要求没有#
 * 支持多层路由的实现！！！
 */
ZY.Router = class Router {
    static debuger() {
        if (!this.debug) return;
        console.log(...arguments);
    }
    static debug = true;
    static init() {
        this.INSTANCES = [];
        this.len = 0;
        this.index = this.nowPaths = [];
        this.exstate = false;
        this.stoNext = [];
        this.history = [];
    }
    default(path) {
        this.defaultPage = path;
        return this;
    }
    nowPath() {
        return Router.nowPaths[this.index];
    }
    prevent(path) {
        var all = this;
        return (newPreventer) => {
            this.preventFunction[path] = newPreventer;
            return all;
        }
    }
    init(path) {
        var all = this;
        return (newIniter) => {
            this.initFunction[path] = newIniter;
            return all;
        }
    }
    refresh(path) {
        var all = this;
        return (newRefresher) => {
            this.refreshFunction[path] = newRefresher;
            return all;
        }
    }
    change(path) {
        var all = this;
        return newChanger => {
            this.changeFunction[path] = newChanger;
            return all;
        }
    }
    disolve(path) {
        var all = this;
        return newDisolver => {
            this.disolveFunction[path] = newDisolver;
            return all;
        }
    }

    //供Router内部调用的一系列函数
    preventer(path) {
        try {
            return (this.preventFunction[path] || this.defaultPreventer)(path, this.data[path]);
        } catch (e) {
            Router.debuger('prevent false->', e);
        }
    }
    initer(path) {
        try {
            return (this.initFunction[path] || this.defaultIniter)(path, this.data[path]);
        } catch (e) {
            Router.debuger('init false->', e);
        }
    }
    refresher(path) {
        try {
            return (this.refreshFunction[path] || this.defaultRefresher)(path, this.data[path]);
        } catch (e) {
            Router.debuger('refresh false->', e);
        }
    }
    changer(path) {
        try {
            return (this.changeFunction[path] || this.defaultChanger)(path, this.data[path]);
        } catch (e) {
            Router.debuger('change false->', e);
        }
    }
    disolver(path) {
        try {
            return (this.disolveFunction[path] || this.defaultDisolver)(path, this.data[path]);
        } catch (e) {
            Router.debuger('disolve false->', e);
        }
    }

    //初始化router的基本信息
    constructor(dom) {
        if (Router.len === undefined) Router.init();
        this.index = Router.len;
        Router.len = this.index + 1;
        this.rootDom = dom;
        this.page = {};
        this.data = {};
        this.defaultPage = 'main';
        this.defaultPreventer = p => false;
        this.defaultIniter = p => { };
        this.defaultChanger = path => this.page[path].classList.remove('hide');
        this.defaultRefresher = p => { };
        this.defaultDisolver = path => this.page[path].classList.add('hide');
        this.preventFunction = {};
        this.changeFunction = {};
        this.initFunction = {};
        this.disolveFunction = {};
        this.refreshFunction = {};
        Router.INSTANCES.push(this);
    }
    use(func) {
        func(this);
        return this;
    }
    static page(router) {
        var pages = router.rootDom.querySelectorAll('[path]');
        pages.forEach(page => {
            let path = page.attributes.path.value;
            router.page[path] = page;
            router.data[path] = {};
        })
    }
    static state(router) {
        router.page['show'] = router.rootDom;
        router.page['hide'] = router.rootDom;
    }
    //做完所有初始化后才能调用，完成页面hash层面的初始化
    static run() {
        this.initListen();
        var npath = location.hash || '#';
        var paths = this.path2arr(npath);
        var noOneChanged = true;
        for (var i = 0; i < this.len; i++) {
            if (!paths[i] || !this.INSTANCES[i].checkPath(paths[i])) {
                paths[i] = this.INSTANCES[i].defaultPage;
                noOneChanged = false;
            }
        }
        if (noOneChanged) Router.history.push(paths);
        this.INSTANCES.forEach(instance => {
            for (let key in instance.page) {
                instance.disolver(key);
            }
        })
        this.nowPaths = this.path2arr(location.hash);
        Router.to(paths);
        // location.hash = this.arr2path(paths);
        // this.history.push(paths);
        // this.nowPaths = paths;
    }

    //检查path在该实例中的合法性
    checkPath(path) {
        return this.page[path] !== undefined;
    }
    //检查整个hash的合法性
    static checkPath(paths) {
        try {
            paths.forEach((path, index) => {
                if (!this.INSTANCES[index].checkPath(path)) return false;
            })
            return true;
        } catch (e) {
            Router.debuger(e);
            return false;
        }
    }

    //初始化hash监听 
    static initListen() {
        this.INSTANCES.forEach((dom, index) => {
            dom.rootDom.querySelectorAll('[target]').forEach(d => {
                var value = d.attributes.target.value;
                if (value.indexOf('.') === -1) {
                    d.attributes.target.value = index + '.' + value;
                }
            })
        })
        document.addEventListener('click', function (e) {
            var dom = e.target;
            var target = dom.attributes.target;
            var back = dom.attributes.back;
            if (target) {
                var tar = target.value.split('.');
                Router.INSTANCES[tar[0]].to(tar[1]);
            } else if (back) {
                Router.back();
            }
        })
        window.onhashchange = e => {
            var nowHash = location.hash;
            var nowPaths = this.path2arr(nowHash);
            for (const index in this.stoNext) {
                try {
                    // Router.debuger(Router.history[Router.history.length - 1][index]);
                    Router.INSTANCES[index].disolver(Router.history[Router.history.length - 1][index]);
                } catch (e) {
                    Router.debuger(e);
                    Router.debuger('disover false, not important');
                }
            }
            if (nowHash === '#last' || nowHash === '#next') {
                Router.exstate = !Router.exstate;
                Router.debuger(Router.exstate, nowHash);
                if (Router.exstate === (nowHash === '#last')) {
                    Router.debuger('back');
                    history.go(-1);
                } else {
                    // Router.debuger('next');
                    // Router.debuger(Router.stoNext2path(this.stoNext));
                    location.hash = Router.stoNext2path(this.stoNext);
                }
                return;
            }
            try {
                this.getChanged(nowPaths, Router.history[Router.history.length - 1]).forEach(c => {
                    this.stoNext[c] = nowPaths[c];
                })
            } catch (e) {
                Router.debuger('dynamic getChanged false');
            }
            for (let index in this.stoNext) {
                Router.debuger(this.history.toString(), this.history.length, index, this.stoNext[index]);
                Router.debuger(this.indexOFbinArr(this.history, this.stoNext[index]));
                this.INSTANCES[index].changer(this.stoNext[index]);
                if (this.indexOFbinArr(this.history, this.stoNext[index]) === -1) {
                    this.INSTANCES[index].initer(this.stoNext[index]);
                }
                this.INSTANCES[index].changer(this.stoNext[index]);
                this.INSTANCES[index].refresher(this.stoNext[index]);
            }
            Router.nowPaths = nowPaths;
            Router.history.push(nowPaths);
        }
    }
    static indexOFbinArr(arr, el) {
        var res = -1;
        arr.forEach((ele, index) => {
            var ind = ele.indexOf(el);
            if (ind !== -1) {
                res = [index, ind];
            }
        })
        return res;
    }
    static arr2path(paths = []) {
        return '#' + paths.join('&');
    }
    static path2arr(path = '#') {
        return path.substring(1).split('&');
    }
    static stoNext2path(stoN) {
        var paths = Object.assign([], this.nowPaths);
        // Router.debuger(paths, this.nowPaths);
        for (let index in stoN) {
            paths[index] = stoN[index];
        }
        return this.arr2path(paths);
    }
    //从当前hash中得到当前router对应的path
    getSinglePath() {
        try {
            return Router.nowPaths[this.index];
        } catch (e) {
            return null;
        }
    }
    //从前期router的path得到全局的location.hash
    setSinglePath(path) {
        try {
            var paths = Object.assign([], Router.nowPaths);
            paths[this.index] = path;
            return paths;
        } catch (e) {
            Router.debuger(`!!! router err ${e}`);
            return Router.nowPaths;
        }
    }

    //用于router的跳转 在外部调用
    to(path) {
        if (!this.checkPath(path)) return Router.debuger('path false');
        Router.to(this.setSinglePath(path));
    }


    // static exstate = false;

    static to(paths = this.nowPaths) {
        if (!this.checkPath(paths)) return Router.debuger('path false');
        var changed = this.getChanged(paths);
        //没有一个path改变的情况
        if (changed.length === 0) {
            this.INSTANCES.forEach(router => {
                if (router.preventer(router.nowPath())) window.open(location.href.split('#')[0], '_self');
                router.changer(router.nowPath());
                router.initer(router.nowPath());
                router.refresher(router.nowPath());
            })
            return;
        }
        this.stoNext = {};
        changed.forEach(c => {
            this.stoNext[c] = paths[c];
        })
        location.hash = Router.exstate ? '#last' : '#next';
    }
    static back() {
        window.history.back();
    }
    static getChanged(paths, oldPath = Router.nowPaths) {
        try {
            var changed = [];
            var newPath = paths;
            newPath.forEach((p, index) => {
                if (p !== oldPath[index]) changed.push(index);
            })
            return changed;
        } catch (e) {
            Router.debuger(e);
            return [];
        }
    }
    // static stoNext = {};
}

ZY.LeftMenu = {};
ZY.LeftMenu.setCover = (dom) => {
    ZY.LeftMenu.cover = dom;
    dom.classList.add('lm_cover');
    ZY.LeftMenu.cover.style.display = 'none';
    ZY.LeftMenu.cover.onclick = ZY.LeftMenu.shouldHide;
    return ZY.LeftMenu;
}
ZY.LeftMenu.setCoverClick = (callback) => {
    ZY.LeftMenu.cover.onclick = callback;
    return ZY.LeftMenu;
}
ZY.LeftMenu.init = function (dom, main, cover) {
    ZY.LeftMenu.body = main;
    if (cover) ZY.LeftMenu.setCover(cover);
    ZY.LeftMenu.example = dom;
    dom.classList.add('zy-lm');
    var rebo = document.querySelectorAll('.lm-hide');
    Array.prototype.forEach.call(rebo, function (ele) {
        ele.onclick = ZY.LeftMenu.shouldHide;
    })
    var tolm = document.querySelectorAll('.lm-show');
    Array.prototype.forEach.call(tolm, function (ele) {
        ele.onclick = ZY.LeftMenu.shouldShow;
    })
    ZY.LeftMenu.state = false;
    ZY.LeftMenu.refresh();
    var timer;
    document.body.addEventListener('touchstart', function (e) {
        if (!ZY.LeftMenu.state) {
            timer = setTimeout(() => {
                ZY.LeftMenu.shouldShow();
            }, 1000);
        } else {
            ZY.LeftMenu.x = e.changedTouches[0].pageX;
        }
    })
    document.body.addEventListener('touchmove', function (e) {
        if (ZY.LeftMenu.timer) return;
        if (!ZY.LeftMenu.state) {
            clearTimeout(timer);
            return;
        }
        ZY.LeftMenu.timer = true;
        setTimeout(() => {
            ZY.LeftMenu.timer = false;
        }, 20);
        var x = e.changedTouches[0].pageX;
        var per = ZY.LeftMenu.per = ZY.LeftMenu.center(0, 1)((ZY.LeftMenu.x - x) * ZY.LeftMenu.width);
        ZY.LeftMenu.body.style.transform = `translate(${45 * (1 - per)}vw,0)scale(${0.85 + 0.15 * per})`;
    })
    document.body.addEventListener('touchend', function (e) {
        if (!ZY.LeftMenu.state) {
            clearTimeout(timer);
            return;
        }
        ZY.LeftMenu.body.style = '';
        if (ZY.LeftMenu.per > 0.85) {
            ZY.LeftMenu.shouldHide();
            ZY.LeftMenu.per = 0;
        }
    })
    window.oncontextmenu = e => {
        e.preventDefault();
    }
    return ZY.LeftMenu;
}
ZY.LeftMenu.append = function (text, callback, opt = {}) {
    var dom = document.createElement('div');
    dom.className = 'bo';
    dom.innerText = text;
    if (opt.id) dom.id = opt.id;
    dom.onclick = () => {
        callback();
        ZY.LeftMenu.hide();
    };
    ZY.LeftMenu.wrap.appendChild(dom);
    return dom;
}
ZY.LeftMenu.dappend = function (text, callback, opt = {}) {
    var dom = document.createElement('div');
    dom.className = opt.className || 'bo';
    dom.innerText = text;
    if (opt.id) dom.id = opt.id;
    dom.onclick = () => {
        callback();
        ZY.LeftMenu.hide();
    };
    ZY.LeftMenu.example.appendChild(dom);
    return dom;
}
ZY.LeftMenu.show = function () {
    if (ZY.LeftMenu.state) return;
    ZY.LeftMenu.body.classList.add('lm-small');
    ZY.LeftMenu.state = true;
    ZY.LeftMenu.refresh();
}
ZY.LeftMenu.hide = function () {
    if (!ZY.LeftMenu.state) return;
    ZY.LeftMenu.body.classList.remove('lm-small');
    ZY.LeftMenu.state = false;
    ZY.LeftMenu.refresh();
}
ZY.LeftMenu.toggle = function () {
    ZY.LeftMenu.body.classList.toggle('lm-small');
    ZY.LeftMenu.state = !ZY.LeftMenu.state;
    ZY.LeftMenu.refresh();
}
ZY.LeftMenu.refreshFunction = [];
ZY.LeftMenu.refresh = function () {
    ZY.LeftMenu.refreshFunction.forEach((func) => { func(); });
    ZY.LeftMenu.cover.style.display = ZY.LeftMenu.state ? 'block' : 'none';
    if (ZY.LeftMenu.state) {
        document.querySelector('html').style.position = 'fixed';
    } else {
        document.querySelector('html').style.position = 'relative';
    }
}
ZY.LeftMenu.x = 0;
ZY.LeftMenu.width = 1 / (document.querySelector('html').clientWidth * 0.2);
ZY.LeftMenu.timer = false;
ZY.LeftMenu.center = function (min, max) {
    return function (x) {
        return Math.max(min, Math.min(x, max));
    }
}
ZY.LeftMenu.shouldShow = () => {
    ZY.LeftMenu.show();
}
ZY.LeftMenu.shouldHide = () => {
    ZY.LeftMenu.hide();
}
ZY.FloatBall = class {
    // rootDom
    // targetDom
    constructor(dom) {
        this.rootDom = dom;
        ZY.FloatBall.canDrag(dom);
    }
    static canDragMobile(dom) {
        var dragging = false, freezing = false;
        var basex, basey, x0, y0;
        dom.addEventListener('touchstart', e => {
            if (e.target !== dom) return;
            dragging = true;
            x0 = e.changedTouches[0].pageX;
            y0 = e.changedTouches[0].pageY;
            basex = dom.offsetLeft;
            basey = dom.offsetTop;
            document.addEventListener('touchmove', touching, false);
        })
        dom.addEventListener('touchend', e => {
            dragging = false;
            document.removeEventListener('touchmove', touching);
            setTimeout(e => {
                dom.moving = false;
            }, 0)
        })
        function touching(e) {
            e.preventDefault();
            if (!dragging || freezing) return;
            dom.moving = true;
            dom.style.left = basex + e.changedTouches[0].pageX - x0 + 'px';
            dom.style.top = basey + e.changedTouches[0].pageY - y0 + 'px';
            freezing = true;
            setTimeout(n => {
                freezing = false;
            }, 15);
        }
    }
    static canDragPC(dom) {
        var dragging = false, freezing = false;
        var basex, basey, x0, y0;
        dom.addEventListener('mousedown', e => {
            if (e.target !== dom) return;
            dragging = true;
            x0 = e.pageX;
            y0 = e.pageY;
            basex = dom.offsetLeft;
            basey = dom.offsetTop;
            document.addEventListener('mousemove', touching);
        })
        document.addEventListener('mouseup', e => {
            dragging = false;
            document.removeEventListener('mousemove', touching);
            setTimeout(e => {
                dom.moving = false;
            }, 0)
        })
        function touching(e) {
            if (!dragging || freezing) return;
            dom.moving = true;
            dom.style.left = basex + e.pageX - x0 + 'px';
            dom.style.top = basey + e.pageY - y0 + 'px';
            freezing = true;
            setTimeout(n => {
                freezing = false;
            }, 15);
        }
    }
    static canDrag(dom) {
        return ZY.isMobile() ? ZY.FloatBall.canDragMobile(dom) : ZY.FloatBall.canDragPC(dom);
    }
    link(dom) {
        var all = this;
        this.targetDom = dom;
        this.rootDom.addEventListener('click', e => {
            if (e.target !== this.rootDom) return;
            if (all.rootDom.moving) return;
            dom.classList.toggle('hide');
        });
        return this;
    }
}
ZY.isMobile = function () {
    return navigator.userAgent.match((/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i));
}