import { forbidFullScreenFunc, isMobile } from "../boot";

const { myAler } = ZY;
const { Aler } = myAler;
/**
 * @param {HTMLDivElement} dom 
 */
export function checkFullScreen(dom = allPages) {
    if(forbidFullScreenFunc)return;
    if (isMobile) {
        let [width, height] = [screen.availHeight, screen.availWidth].sort().reverse();
        if (screen.orientation.angle == 0) {
            dom.style.transform = `rotate(90deg) translateY(-100%)`;
            dom.style.width = '100vh';
            dom.style.height = '100vw';
        } else {
            dom.style.transform = 'initial';
            dom.style.width = '100vw';
            dom.style.height = '100vh';
        }
        dom.style.margin = 'initial';
        new Aler('检测到手机应用，点击全屏显示', () => {
            document.documentElement.requestFullscreen().then(function () {
                window.addEventListener('orientationchange', e => {
                    if (screen.orientation.angle == 0) {
                        dom.style.transform = `rotate(90deg) translateY(-100%)`;
                        dom.style.width = '100vh';
                        dom.style.height = '100vw';
                    } else {
                        dom.style.transform = 'initial';
                        dom.style.width = '100vw';
                        dom.style.height = '100vh';
                    }
                }, false);
            }).catch(err => {
                alert('当前浏览器不支持全屏,请更换浏览器');
                window.close();
                document.documentElement.innerHTML = '当前浏览器不支持全屏,请更换浏览器';
            })
        });
    }
}