var {Router,TR,Tip,myAler,LeftMenu} = ZY;
var head = new Router(header).use(Router.state).default('hide');
head.defaultChanger = ()=>{};
head.defaultDisolver = ()=>{};
var router = new Router(routera).use(Router.page);
Router.run();
TR.init('heart');
var user = ZY.LSUser();
console.log(user);