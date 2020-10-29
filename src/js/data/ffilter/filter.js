import { OutlineFilter, EmbossFilter, OldFilmFilter } from "pixi-filters";

export var uraFilter = new OutlineFilter(1, 0x00eedd, 5);
export var accumFilter = new OutlineFilter(3, 0x00ffee, 5);
export var ctrlFilter = new OutlineFilter(1, 0xeedd00, 5);
export var stoneFilter = new EmbossFilter(1);
export var commonSkillFilter = new OutlineFilter(2, 0xe1b8ff, 5);
export const oldFilmFilter = new OldFilmFilter();