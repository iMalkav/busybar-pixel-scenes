import assert from "node:assert/strict";
import test from "node:test";
import schema from "../src/appmeta/settings.json" with { type: "json" };
import { AppModel } from "../src/model.ts";
import { schemaDefaults, type Settings } from "../src/lib.ts";
const NOW = 1700000000000;
const make = (values: Settings = {}, saved: Settings = {}, now = NOW) =>
  new AppModel({ ...schemaDefaults(schema.fields), ...values }, saved, now);

test("pause freezes animation without blocking scene changes", () => {
  const a = make();
  a.tick(NOW + 1000);
  const f = a.frame;
  a.key("ok", 0, NOW + 1000);
  a.tick(NOW + 5000);
  assert.equal(a.frame, f);
  a.key("wheel", 1, NOW);
  assert.equal(a.selected, 1);
});
test("all scene shapes remain inside the front display", () => {
  const a = make();
  for (let j = 0; j < 3; j++) {
    for (const r of a.view(NOW).shapes || []) {
      assert.ok(
        r.x >= 0 && r.y >= 0 && r.x + r.width <= 72 && r.y + r.height <= 16,
      );
    }
    a.key("wheel", 1, NOW);
  }
});
