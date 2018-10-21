import Rectangle from "../lib/index";
import Vector from "@creenv/vector";
import Vector2 from "@creenv/vector/vector2";


test("initializaion", () => {
  let p1 = new Vector(0,0,0),
      p2 = new Vector(1,1,1);
  
  let rect = new Rectangle(p1, p2);
  expect(rect.topleft).toEqual(p1);
  expect(rect.bottomright).toEqual(p2);

  expect(rect.size).toEqual([1,1,1]);
});

test("contains", () => {
  let p1 = new Vector(0,0,0),
      p2 = new Vector(1,1,1);
  
  let p3 = new Vector(0.5,0.5,0.5),
      p4 = new Vector(-0.5,0.5,0.5);

  let rect = new Rectangle(p1, p2);
  expect(rect.contains(p3)).toBe(true);
  expect(rect.contains(p4)).toBe(false);
});

test("contains reversed", () => {
  let p1 = new Vector(1,1,1),
      p2 = new Vector(0,0,0);

  let p3 = new Vector(0.5,0.5,0.5),
    p4 = new Vector(-0.5,0.5,0.5);

  let rect = new Rectangle(p1, p2);
  expect(rect.contains(p3)).toBe(true);
  expect(rect.contains(p4)).toBe(false);
});

test("contains border", () => {
  let p1 = new Vector(1,1,1),
  p2 = new Vector(0,0,0);

  let rect = new Rectangle(p1, p2);
  expect(rect.contains(p1)).toBe(true);
})