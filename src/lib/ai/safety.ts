export function safetyOverride(ai: any) {
  let risk = ai.risk_level;

  if (!risk) risk = "medium";

  const warnings: string[] = [];

  if (risk === "high") {
    warnings.push("🚨 Kondisi berbahaya, disarankan tidak melanjutkan perjalanan");
  }

  return {
    ...ai,
    risk_level: risk,
    warning: warnings.length ? warnings[0] : ai.warning,
  };
}