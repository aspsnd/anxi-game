import { gameApp, loadAndAfter, gameRouter, GameWidth, GTip, GDanger, directBy, gameTink, gameSound } from "./util";
import { Sprite } from "pixi.js";
import { Input, Button, SimpleButton, SpanLine } from "./anxi/lib/input";
import { RecordController } from "./record/record";
import { RecordPage } from "./record/page";
import { DotFilter, GodrayFilter } from "pixi-filters";
import { RealWorld } from "./po/world";
import { RoleProtos } from "./data/role/all";
import { Role } from "./po/atom/role";
import { QuickOpen } from "./po/gui/open";
import { autoEnterCard, autoEnterCardIndex, autoLogin, autoLoginTarget } from "./boot";
import { cardDatas } from "./data/card/card";
import { checkFullScreen } from "./lib/mobile";
import { getWS } from "./net/net";
const { myAler, Inputer } = ZY;
const { Question, Loading, Aler } = myAler;

export const init = () => {
    checkFullScreen();
    gameApp.start();
    loadAndAfter(_ => {
        gameSound.showMapBg();
        new QuickOpen();
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

                    }).catch(function (e) {
                        new ZY.Tip(e?.response?.data?.msg ?? '登录失败');
                    })
                }
                container.addChild(unameInput, upassInput, loginBtn);
                gameApp.stage.addChild(container);

                /**
                 * @test autologin 
                 */
                if (autoLogin) {
                    RecordController.login(...autoLogin).then(res => {
                        new GTip('登录成功');
                        if (autoLoginTarget == undefined) {
                            gameRouter.to('main');
                        } else {
                            setTimeout(_ => {
                                gameRouter.pageHandlers['world'].data.record = RecordController.getRecord(autoLoginTarget);
                                gameRouter.to('world');
                            })
                        }
                    }).catch(e => {
                        console.error(e);
                        new GDanger('登录失败');
                    })
                }

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
                helpPage.tap = _ => {
                    HelpPage.classList.remove('hide');
                }
                aboutPage.tap = _ => {
                    AboutPage.classList.remove('hide');
                }
                document.querySelectorAll('.hideHelp').forEach(btn => {
                    btn.onclick = _ => {
                        HelpPage.classList.add('hide');
                    }
                })
                document.querySelectorAll('.hideAbout').forEach(btn => {
                    btn.onclick = _ => {
                        AboutPage.classList.add('hide');
                    }
                })
                exitLogin.tap = _ => {
                    RecordController.logout();
                    gameRouter.to('login');
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
                let line2 = new SpanLine();
                line2.position.set(760, 305 + 55);
                container.addChild(line2);
                let line3 = new SpanLine();
                line3.position.set(760, 305 + 55 * 2);
                container.addChild(line3);
                let mode1 = new SimpleButton('单人模式');
                let mode2 = new SimpleButton('双人模式');
                let mode3 = new SimpleButton('双人联机');
                let mode4 = new SimpleButton('加入联机');
                let rebtn = new SimpleButton('返回主页');
                mode1.position.set(770, 258);
                mode2.position.set(770, 258 + 55);
                mode3.position.set(770, 258 + 55 * 2);
                mode4.position.set(770, 258 + 55 * 3);
                rebtn.position.set(770, 258 + 55 * 4);
                container.addChild(mode1, mode2, mode3, mode4, rebtn);
                mode1.tap = _ => {
                    gameRouter.to('select1');
                }
                mode2.tap = _ => {
                    gameRouter.to('select2');
                }
                mode3.tap = _ => {
                    return new Aler('本功能尚在开发阶段，暂时关闭。');
                    let rrid = '' + RecordController.uuid + ((Math.random() * 10000) | 0);
                    let ws = getWS();
                    ws.once('connection', e => {
                        ws.send({
                            global: true,
                            name: 'createRecord',
                            value: rrid
                        });
                        ws.once('recordCreated', e => {
                            let pass = e.value;
                            let loading = new Loading('请让加入存档的好友输入以下密码： \r\n' + pass);
                            ws.once('recordAddIn', e => {
                                loading.remove();
                                gameRouter.pageHandlers['select3'].data.isHomer = true;
                                gameRouter.pageHandlers['select3'].data.rrid = rrid;
                                gameRouter.to('select3');
                            })
                        });
                    });
                };
                mode4.tap = _ => {
                    return new Aler('本功能尚在开发阶段，暂时关闭。');
                    new Inputer('请输入建立存档者端提示的加入密码', (bool, value) => {
                        let ws = getWS();
                        ws.once('connection', e => {
                            ws.send({
                                global: true,
                                name: 'addInRecord',
                                value: value
                            });
                            ws.once('recordAdd', e => {
                                let rrid = e.from?.rrid;
                                if (!rrid) {
                                    return new myAler.Aler('找不到存档，请确认你的密码。');
                                };
                                gameRouter.pageHandlers['select3'].data.isHomer = false;
                                gameRouter.pageHandlers['select3'].data.rrid = rrid;
                                gameRouter.to('select3');
                            })
                        });
                    });
                }
                rebtn.tap = _ => {
                    gameRouter.to('main');
                }
                gameApp.stage.addChild(container);
            }
        });
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
                for (let i = 0; i < RoleProtos.length; i++) {
                    let index = i;
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
                        let role = new Role(RoleProtos[index]);
                        let record = RecordController.newRecord([role.toPlainObject()]);
                        gameRouter.pageHandlers['save'].data.record = record;
                        gameRouter.to('save');
                    }
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
                let roles = [];
                for (let i = 0; i < 4; i++) {
                    let index = i;
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
                        sprite.out = undefined;
                        let role = new Role(RoleProtos[index]);
                        roles.push(role.toPlainObject());
                        if (roles.length < 2) return;
                        let record = RecordController.newRecord(roles);
                        gameRouter.pageHandlers['save'].data.record = record;
                        gameRouter.to('save');
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
        gameRouter.register('select3', {
            initer(container, data) {
                data.roles = [];
                let { isHomer, rrid } = data;
                let filter1 = data.filter1 = [new DotFilter(1, 5)];
                let filter2 = data.filter2 = [new GodrayFilter({
                    parallel: false
                })];
                gameApp.ticker.add(_ => {
                    filter2[0].time += 0.05;
                })
                for (let i = 0; i < 4; i++) {
                    let index = i;
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
                        sprite.out = undefined;
                        let role = new Role(RoleProtos[index]);
                        let record = RecordController.newNetRecord([role.toPlainObject()], rrid, isHomer);
                        console.log(record);
                        gameRouter.pageHandlers['save'].data.record = record;
                        gameRouter.to('save');
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
                });
            }
        });
        gameRouter.register('loadRecord', {
            initer(container, data) {
                let recordPage = data.recordPage = new RecordPage({
                    closeHandler() {
                        gameRouter.to('main');
                    },
                    selectHandler(index) {
                        gameRouter.pageHandlers['world'].data.record = RecordController.getRecord(index);
                        gameRouter.to('world');
                    }
                });
                recordPage.position.set(200, 170);
                container.addChild(recordPage);
                gameApp.stage.addChild(container);
            },
            refresher(container, data) {
                container.visible = true;
                /**
                 * @type {RecordPage}
                 */
                let recordPage = data.recordPage;
                recordPage.load();
            }
        });
        gameRouter.register('save', {
            initer(container, data) {
                let record = data.record;
                let recordPage = data.recordPage = new RecordPage({
                    closeHandler() {
                        gameRouter.back();
                    },
                    selectHandler(index, exist) {
                        if (exist) {
                            new Question('确定覆盖当前存档？', bool => {
                                if (!bool) return;
                                RecordController.saveRecord(index, record);
                                gameRouter.pageHandlers['world'].data.record = record;
                                gameRouter.to('world');
                            })
                        } else {
                            RecordController.saveRecord(index, record);
                            gameRouter.pageHandlers['world'].data.record = record;
                            gameRouter.to('world');
                        }
                    }
                });
                recordPage.position.set(200, 170);
                container.addChild(recordPage);
                gameApp.stage.addChild(container);
            }
        })
        gameRouter.register('world', {
            initer(container, data) {
                gameApp.stage.addChild(container);
            },
            refresher(container, data) {
                container.visible = true;
                let world = data.world;
                if (getWS().ws.readyState == 1) {
                    world.init(data.record);
                } else {
                    getWS().on('connection', e => {
                        world.init(data.record);
                    });
                }
                if (autoEnterCard) world.loadCard(cardDatas[autoEnterCardIndex ?? 0]);
            }
        }, undefined, (container, data) => {
            let world = data.world = new RealWorld(gameApp, container);
        });
        gameRouter.start();
    })
}