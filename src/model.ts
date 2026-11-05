import {
  str,
  num,
  flag,
  cycle,
  App,
  type Settings,
  type Shape,
  type View,
} from "./lib.ts";

export class AppModel extends App {
  scenes = ["mountains", "city", "ocean"];
  selected = 0;
  paused = false;
  frame = 0;
  last = 0;
  constructor(s: Settings, saved: Settings, now: number) {
    super(s, saved, now);
    this.selected = Math.max(0, this.scenes.indexOf(str(s, "scene")));
    this.paused = flag(s, "paused");
    this.last = now;
  }
  key(key: string, delta: number, _now: number): boolean {
    if (key === "wheel") this.selected = cycle(this.selected, delta, 3);
    if (key === "ok") this.paused = !this.paused;
    return false;
  }
  tick(now: number): void {
    if (
      !this.paused &&
      now - this.last >= 600 / num(this.settings, "speed", 2)
    ) {
      this.frame = (this.frame + 1) % 72;
      this.last = now;
    }
  }
  view(_now: number): View {
    const scene = this.scenes[this.selected];
    const shapes: Shape[] = [];
    if (scene === "mountains") {
      for (let i = 0; i < 18; i++) {
        const h = 3 + Math.floor((7 * (1 + Math.sin(i * 0.6))) / 2);
        shapes.push({
          x: i * 4,
          y: 16 - h,
          width: 4,
          height: h,
          color: "#47788FFF",
        });
      }
      shapes.push({
        x: this.frame,
        y: 1,
        width: 4,
        height: 3,
        color: str(this.settings, "accent"),
      });
    } else if (scene === "city") {
      for (let i = 0; i < 12; i++) {
        const h = 4 + ((i * 7) % 11);
        shapes.push({
          x: i * 6,
          y: 16 - h,
          width: 5,
          height: h,
          color: i % 2 ? "#524D80FF" : "#9670ADFF",
        });
      }
      for (let i = 0; i < 6; i++)
        shapes.push({
          x: cycle(this.frame, i * 12, 72),
          y: 15,
          width: 2,
          height: 1,
          color: str(this.settings, "accent"),
        });
    } else {
      for (let i = 0; i < 18; i++) {
        const h =
          4 + Math.floor((3 * (1 + Math.sin((i + this.frame) * 0.5))) / 2);
        shapes.push({
          x: i * 4,
          y: 16 - h,
          width: 4,
          height: h,
          color: i % 2 ? "#1484ADFF" : "#4FC4D6FF",
        });
      }
      shapes.push({
        x: 52,
        y: 1,
        width: 5,
        height: 4,
        color: str(this.settings, "accent"),
      });
    }
    return {
      title: "Pixel Scenes",
      value: scene.toUpperCase(),
      rows: [
        this.paused ? "PAUSED" : "ANIMATING",
        "Speed " + num(this.settings, "speed"),
      ],
      shapes,
      hint: "Wheel scene / OK pause",
    };
  }
}
