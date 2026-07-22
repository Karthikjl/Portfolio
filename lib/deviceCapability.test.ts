import { describe, expect, it } from "vitest";
import { shouldUseGameExperience } from "./deviceCapability";

describe("shouldUseGameExperience", () => {
  it("returns true when a fine pointer and WebGL are both available", () => {
    expect(
      shouldUseGameExperience({
        matchesFinePointer: () => true,
        canCreateWebGLContext: () => true,
      })
    ).toBe(true);
  });

  it("returns false when there is no fine pointer", () => {
    expect(
      shouldUseGameExperience({
        matchesFinePointer: () => false,
        canCreateWebGLContext: () => true,
      })
    ).toBe(false);
  });

  it("returns false when WebGL is unavailable", () => {
    expect(
      shouldUseGameExperience({
        matchesFinePointer: () => true,
        canCreateWebGLContext: () => false,
      })
    ).toBe(false);
  });
});
