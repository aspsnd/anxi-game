export function initMouse(tickerFunc) {
    var canvas = mouseCanvas;
    var ctx = canvas.getContext("2d");
    var x, y, w, h, cx, cy, l;
    var y = [];
    var b = {
        n: 100,
        c: false,    //  颜色  如果是false 则是随机渐变颜色
        bc: '#000',   //  背景颜色
        r: 0.9,
        o: 0.05,
        a: 1,
        s: 20,
    }
    var p = 0;
    re();
    var color, color2;
    if (b.c) {
        color2 = b.c;
    } else {
        color = Math.random() * 360;
    }
    window.addEventListener('resize', re);
    function begin() {
        ctx.clearRect(0, 0, w, h);
        var distance = 40;
        if (!b.c) {
            color += .1;
            color2 = 'hsl(' + color + ',100%,80%)';
        }
        p += 5;
        ctx.globalAlpha = 1;
        ctx.fillStyle = color2;
        ctx.beginPath();
        ctx.shadowBlur = 20;
        ctx.shadowColor = color2;
        ctx.arc(cx + distance * Math.cos(p * Math.PI / 180), cy + distance * Math.sin(p * Math.PI / 180), 10, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx + distance * Math.cos((p + 180) * Math.PI / 180), cy + distance * Math.sin((p + 180) * Math.PI / 180), 10, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx + distance * Math.cos((p + 90) * Math.PI / 180), cy + distance * Math.sin((p + 90) * Math.PI / 180), 10, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx + distance * Math.cos((p + 270) * Math.PI / 180), cy + distance * Math.sin((p + 270) * Math.PI / 180), 10, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
    }
    function re() {
        w = window.innerWidth;
        h = window.innerHeight;
        canvas.width = w;
        canvas.height = h;
        cx = w / 2;
        cy = h / 2;
    };
    document.addEventListener('mousemove', function (e) {
        cx = e.pageX - canvas.offsetLeft;
        cy = e.pageY - canvas.offsetTop;
    });
    tickerFunc(begin);
};
export var mouseUtil = {
    now: 'auto',
    relapos: {
        auto: [10, 10],
        pointer: [16, 16]
    }
}