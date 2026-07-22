import { describe, expect, it } from "vitest";
import { computeMoveDirection, integratePosition } from "./movement";

const NO_INPUT = { forward: false, backward: false, left: false, right: false };

describe("computeMoveDirection", () => {
  it("returns a zero vector when no keys are pressed", () => {
    expect(computeMoveDirection(NO_INPUT, 0)).toEqual({ x: 0, z: 0 });
  });

  it("moves toward -Z when facing forward at yaw 0", () => {
    const result = computeMoveDirection({ ...NO_INPUT, forward: true }, 0);
    expect(result.x).toBeCloseTo(0);
    expect(result.z).toBeCloseTo(-1);
  });

  it("moves toward +X when strafing right at yaw 0", () => {
    const result = computeMoveDirection({ ...NO_INPUT, right: true }, 0);
    expect(result.x).toBeCloseTo(1);
    expect(result.z).toBeCloseTo(0);
  });

  it("normalizes diagonal movement to unit length", () => {
    const result = computeMoveDirection({ ...NO_INPUT, forward: true, right: true }, 0);
    const length = Math.sqrt(result.x * result.x + result.z * result.z);
    expect(length).toBeCloseTo(1);
  });

  it("cancels out opposite inputs", () => {
    const result = computeMoveDirection(
      { forward: true, backward: true, left: false, right: false },
      0
    );
    expect(result).toEqual({ x: 0, z: 0 });
  });
});

describe("integratePosition", () => {
  it("advances position by direction * speed * delta", () => {
    const result = integratePosition({ x: 0, z: 0 }, { x: 1, z: 0 }, 2, 0.5);
    expect(result).toEqual({ x: 1, z: 0 });
  });

  it("leaves position unchanged for a zero direction", () => {
    const result = integratePosition({ x: 3, z: 3 }, { x: 0, z: 0 }, 5, 1);
    expect(result).toEqual({ x: 3, z: 3 });
  });
});
