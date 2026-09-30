import assert from "node:assert/strict";
import test from "node:test";
import { getColumnCount, getMasonryLayout } from "./masonryLayout.mjs";

test("responsive columns use the same breakpoint boundaries as the thumbnails", () => {
  const columns = { default: 4, 1023: 3, 639: 1 };
  for (const [width, expected] of [[375, 1], [639, 1], [640, 3], [1023, 3], [1024, 4]]) {
    assert.equal(getColumnCount(columns, width), expected);
  }
});

test("short images fill available space instead of waiting behind a tall image", () => {
  const items = [100, 200, 50, 100, 100].map((height, index) => ({
    key: index,
    dimensions: { width: 100, height },
  }));
  const layout = getMasonryLayout(items, {
    width: 210, columnCount: 2, columnGap: 10, rowGap: 10,
  });

  assert.deepEqual(layout.positions, [
    { left: 0, top: 0, width: 100, height: 100 },
    { left: 110, top: 0, width: 100, height: 200 },
    { left: 0, top: 110, width: 100, height: 50 },
    { left: 0, top: 170, width: 100, height: 100 },
    { left: 110, top: 210, width: 100, height: 100 },
  ]);
  assert.equal(layout.height, 310);
  assert.deepEqual(items.map((item) => item.key), [0, 1, 2, 3, 4]);
});

test("one column keeps every image in order with its natural aspect ratio", () => {
  const layout = getMasonryLayout([
    { dimensions: { width: 800, height: 400 } },
    { dimensions: { width: 400, height: 600 } },
  ], { width: 320, columnCount: 1, columnGap: 12, rowGap: 12 });

  assert.deepEqual(layout.positions, [
    { left: 0, top: 0, width: 320, height: 160 },
    { left: 0, top: 172, width: 320, height: 480 },
  ]);
  assert.equal(layout.height, 652);
});

test("an empty gallery has no reserved height", () => {
  assert.deepEqual(getMasonryLayout([], {
    width: 1200, columnCount: 4, columnGap: 16, rowGap: 16,
  }), { positions: [], height: 0 });
});
