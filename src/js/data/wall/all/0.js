import { boardUrl, groundUrl, WallProto } from "../../../anxi/proto/wall";

export var groundCommon1 = new WallProto(0).size(4600, 150, 140).src(groundUrl(1)).repeat();
export var groundCommon2 = new WallProto(1).size(200, 150).src(groundUrl(1)).repeat();
export var groundCommon3 = new WallProto(2).size(4500, 150).src(groundUrl(3)).repeat();
export var wallTest = new WallProto(3).size(300,50).src(boardUrl(0)).candown();
export var wallCommon1 = new WallProto(4).size(300,51).src(boardUrl(1)).candown();