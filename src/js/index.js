import { gameApp, loadAndAfter, gameRouter, GameWidth, GTip, GDanger, directBy, gameTink } from "./util";
import { Text, Sprite } from "pixi.js";
import { TextInput, Input, Button, SimpleButton, SpanLine } from "./anxi/lib/input";
import { RecordController } from "./record/record";
import { RecordPage } from "./record/page";
import { MotionBlurFilter, ColorMapFilter, ColorOverlayFilter, RadialBlurFilter, TiltShiftFilter, DotFilter, GodrayFilter } from "pixi-filters";
import { AtomProto } from "./anxi/proto/atom";

export const init = () => {
    gameApp.start();
    loadAndAfter(_ => {
        gameRouter.register('login', {
            initer(container) {
                let unameInput = new Input('用户名');
                let upassInput = new Input('密码', {}, true);
                let loginBtn = new Button('登录');
                unameInput.position.set((GameWidth - unameInput.width) >> 1, 150);
                upassInput.position.set((GameWidth - upassInput.width) >> 1, 210);
                loginBtn.position.set((GameWidth - upassInput.width) >> 1, 320);
                loginBtn.tap = _ => {
                    let uname = unameInput.saveText;
                    let upass = upassInput.saveText;
                    RecordController.login(uname, upass).then(res => {
                        new GTip('登录成功');
                        gameRouter.to('main');
                    }).catch(e => {
                        new GDanger('登录失败', e => {
                            unameInput.value = '';
                            upassInput.value = '';
                        });
                    })
                }
                container.addChild(unameInput, upassInput, loginBtn);
                gameApp.stage.addChild(container);

                /**
                 * @test autologin
                 */
                RecordController.login('aspsnd', 'aspsnd').then(res => {
                    new GTip('登录成功');
                    gameRouter.to('main');
                }).catch(e => {
                    console.log(e);
                    new GDanger('登录失败');
                })

            }
        });
        gameRouter.register('main', {
            initer(container) {
                let sprite = new Sprite(directBy('gui/main.png'));
                sprite.position.set(40, 57);
                container.addChild(sprite);
                for (let k = 0; k < 4; k++) {
                    let line = new SpanLine();
                    line.position.set(760, 305 + 55 * k);
                    container.addChild(line);
                }
                let i = 0;
                let newBegin = new SimpleButton('新的开始');
                newBegin.position.set(770, 258 + (55 * i++));
                let continueGame = new SimpleButton('继续游戏');
                continueGame.position.set(770, 258 + (55 * i++));
                let helpPage = new SimpleButton('游戏帮助');
                helpPage.position.set(770, 258 + (55 * i++));
                let aboutPage = new SimpleButton('关于');
                aboutPage.position.set(770, 258 + (55 * i++));
                let exitLogin = new SimpleButton('退出登录');
                exitLogin.position.set(770, 258 + (55 * i++));
                container.addChild(newBegin, continueGame, helpPage, aboutPage, exitLogin);
                gameApp.stage.addChild(container);
                newBegin.tap = _ => {
                    gameRouter.to('mode');
                }
                continueGame.tap = _ => {
                    gameRouter.to('loadRecord');
                }
            }
        })
        gameRouter.register('mode', {
            initer(container) {
                let sprite = new Sprite(directBy('gui/main.png'));
                sprite.position.set(40, 57);
                container.addChild(sprite);
                let line = new SpanLine();
                line.position.set(760, 305);
                container.addChild(line);
                let mode1 = new SimpleButton('单人模式');
                let mode2 = new SimpleButton('双人模式');
                let rebtn = new SimpleButton('返回主页');
                mode1.position.set(770, 258);
                mode2.position.set(770, 258 + 55);
                rebtn.position.set(770, 258 + 55 * 4);
                container.addChild(mode1, mode2, rebtn);
                mode1.tap = _ => {
                    gameRouter.to('select1');
                }
                mode2.tap = _ => {
                    gameRouter.to('select2');
                }
                rebtn.tap = _ => {
                    gameRouter.to('main');
                }
                gameApp.stage.addChild(container);
            }
        })
        gameRouter.register('select1', {
            initer(container, data) {
                data.roles = [];
                let filter1 = data.filter1 = [new DotFilter(1, 5)];
                let filter2 = data.filter2 = [new GodrayFilter({
                    parallel: false
                })];
                gameApp.ticker.add(_ => {
                    filter2[0].time += 0.05;
                })
                for (let i = 0; i < 4; i++) {
                    let sprite = new Sprite(directBy(`role/face/role${i + 1}.png`));
                    sprite.position.set(240 * i, 0);
                    sprite.filters = filter1;
                    gameTink.makeInteractive(sprite);
                    sprite.over = _ => {
                        sprite.filters = filter2;
                    }
                    sprite.out = _ => {
                        sprite.filters = filter1;
                    }
                    sprite.tap = _ => {

                    }
                    data.roles = [];
                    container.addChild(sprite);
                }
                container.addChild(new Sprite(directBy('role_select_bg.png')));
                gameApp.stage.addChild(container);
            },
            refresher(container, data) {
                container.visible = true;
                data.roles.forEach(r => {
                    r.filters = data.filter1;
                })
            }
        });
        gameRouter.register('select2', {
            initer(container, data) {
                data.roles = [];
                let filter1 = data.filter1 = [new DotFilter(1, 5)];
                let filter2 = data.filter2 = [new GodrayFilter({
                    parallel: false
                })];
                gameApp.ticker.add(_ => {
                    filter2[0].time += 0.05;
                })
                for (let i = 0; i < 4; i++) {
                    let sprite = new Sprite(directBy(`role/face/role${i + 1}.png`));
                    sprite.position.set(240 * i, 0);
                    sprite.filters = filter1;
                    gameTink.makeInteractive(sprite);
                    sprite.over = _ => {
                        sprite.filters = filter2;
                    }
                    sprite.out = _ => {
                        sprite.filters = filter1;
                    }
                    sprite.tap = _ => {

                    }
                    data.roles = [];
                    container.addChild(sprite);
                }
                container.addChild(new Sprite(directBy('role_select_bg.png')));
                gameApp.stage.addChild(container);
            },
            refresher(container, data) {
                container.visible = true;
                data.roles.forEach(r => {
                    r.filters = data.filter1;
                })
            }
        });
        gameRouter.register('loadRecord', {
            initer(container, data) {
                let recordPage = data.recordPage = new RecordPage({
                    closeHandler() {
                        gameRouter.to('main');
                    },
                    selectHandler(index) {

                    }
                });
                recordPage.position.set(200, 170);
                container.addChild(recordPage);
                gameApp.stage.addChild(container);
                window.recordPage = recordPage;
            },
            refresher(container, data) {
                container.visible = true;
                /**
                 * @type {RecordPage}
                 */
                let recordPage = data.recordPage;
                recordPage.load();
            }
        })
        gameRouter.start();
        window.gameRouter = gameRouter;
    })
}