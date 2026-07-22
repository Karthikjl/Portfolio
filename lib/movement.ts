export interface Vector2 {
  x: number;
  z: number;
}

export interface MovementInput {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
}

export function computeMoveDirection(input: MovementInput, yaw: number): Vector2 {
  let forwardAxis = 0;
  if (input.forward) forwardAxis += 1;
  if (input.backward) forwardAxis -= 1;

  let strafeAxis = 0;
  if (input.right) strafeAxis += 1;
  if (input.left) strafeAxis -= 1;

  if (forwardAxis === 0 && strafeAxis === 0) {
    return { x: 0, z: 0 };
  }

  const sinYaw = Math.sin(yaw);
  const cosYaw = Math.cos(yaw);

  const rawX = forwardAxis * -sinYaw + strafeAxis * cosYaw;
  const rawZ = forwardAxis * -cosYaw + strafeAxis * -sinYaw;

  const length = Math.sqrt(rawX * rawX + rawZ * rawZ);
  if (length === 0) {
    return { x: 0, z: 0 };
  }

  return { x: rawX / length, z: rawZ / length };
}

export function integratePosition(
  position: Vector2,
  direction: Vector2,
  speed: number,
  delta: number
): Vector2 {
  return {
    x: position.x + direction.x * speed * delta,
    z: position.z + direction.z * speed * delta,
  };
}
