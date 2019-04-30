import { Util } from "../game/util";

export class ToggleContainer extends Phaser.GameObjects.Container {
  CLOSED: number;
  OPEN: number;
  positionTarget: number;
  
  constructor(scene: Phaser.Scene, closed: number, open: number, y) {
    super(scene, closed, y);
    scene.add.existing(this);
    
    this.CLOSED = closed;
    this.OPEN = open;
    this.positionTarget = closed;
  }

  update(time: number, delta: number) {
    this.x = Util.lerpTowards(this.x, this.positionTarget, delta * 0.7);
    this.doUpdate(time, delta);
  }

  // Method to override to hook into update() as TS doesn't seem to support super call outside of constructor
  doUpdate(time: number, delta: number): void { }

  open(): void {
    this.positionTarget = this.OPEN;
  }

  close(): void {
    this.positionTarget = this.CLOSED;
  }

  isOpen(): boolean {
    return this.positionTarget === this.OPEN;
  }

  isClosed(): boolean {
    return this.positionTarget === this.CLOSED;
  }

  toggle(): void {
    if (this.isOpen()) {
      this.positionTarget = this.CLOSED;
    } else {
      this.positionTarget = this.OPEN;
    }
  }
}