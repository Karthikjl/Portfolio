export interface CapabilityCheckDeps {
  matchesFinePointer: () => boolean;
  canCreateWebGLContext: () => boolean;
}

export function shouldUseGameExperience(deps: CapabilityCheckDeps): boolean {
  return deps.matchesFinePointer() && deps.canCreateWebGLContext();
}
