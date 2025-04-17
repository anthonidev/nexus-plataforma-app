export function calcHorizontalSize(
  level: number,
  depth: number,
  baseHorizontalSpacing: number = 180
) {
  const multiplier = 1.5; // Factor de multiplicación para el espaciado horizontal
  const horizontalSpacing = baseHorizontalSpacing * (depth - level);
  return horizontalSpacing;
}
