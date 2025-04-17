export const calculateHorizontalSpacing = (level: number, depth: number) => {
  const baseSpacingMap = {
    2: 150,
    3: 110,
    4: 125,
    5: 150,
  };

  const scaleFactorMap = {
    2: 0.8,
    3: 1.4,
    4: 2.1,
    5: 2.5,
  };

  const baseSpacing =
    baseSpacingMap[depth as keyof typeof baseSpacingMap] || 100;
  const scaleFactor =
    scaleFactorMap[depth as keyof typeof scaleFactorMap] || 1.0;

  const levelReduction = Math.pow(0.5, level);

  const depthMultiplier = depth * scaleFactor;

  return baseSpacing * depthMultiplier * levelReduction;
};
