import frag from './grayscale.frag';

// Based on https://www.dynetisgames.com/2018/12/09/shaders-phaser-3/
export class GrayscalePipeline extends Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline {
  constructor(game: Phaser.Game) {
    super({
      game: game,
      renderer: game.renderer,
      fragShader: frag
    });
  }
}