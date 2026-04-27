export const TAU = Math.PI * 2;

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function wrap01(value) {
  return ((value % 1) + 1) % 1;
}

export function phaseDistance(a, b) {
  const delta = Math.abs(wrap01(a) - wrap01(b));
  return Math.min(delta, 1 - delta);
}

export function signedPhaseDelta(target, current) {
  let delta = wrap01(target) - wrap01(current);
  if (delta > 0.5) delta -= 1;
  if (delta < -0.5) delta += 1;
  return delta;
}

export function rand(min, max) {
  return min + Math.random() * (max - min);
}

export function choice(items) {
  return items[Math.floor(Math.random() * items.length)];
}
