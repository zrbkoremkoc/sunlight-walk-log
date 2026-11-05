/**
 * Re-export of the Codex PNGs. The file names are a fixed contract —
 * never reference an image name that is not listed here.
 */
export const bgGame = require('../../assets/bg_game.png');
export const logo = require('../../assets/logo.png');
export const iconHome = require('../../assets/icon_home.png');
export const iconPause = require('../../assets/icon_pause.png');

export const sprite1 = require('../../assets/sprite_1.png');
export const sprite2 = require('../../assets/sprite_2.png');
export const sprite3 = require('../../assets/sprite_3.png');
export const sprite4 = require('../../assets/sprite_4.png');
export const sprite5 = require('../../assets/sprite_5.png');

/** Index-aligned with SKY_OPTIONS[].spriteIndex. */
export const SKY_SPRITES = [sprite1, sprite2, sprite3, sprite4, sprite5];

export default {
  bgGame,
  logo,
  iconHome,
  iconPause,
  sprite1,
  sprite2,
  sprite3,
  sprite4,
  sprite5,
  SKY_SPRITES,
};
