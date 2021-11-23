/* TODO */
export const hasFeatureCode = (
  code: "higlight_bold" | "top_daily" | "vip",
  featureCodes: string[]
): boolean => featureCodes && featureCodes.includes(code);
