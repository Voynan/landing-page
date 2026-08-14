type DesignSystemEnvironment = {
  dev: boolean
  flag?: string
}

export function isDesignSystemEnabled({
  dev,
  flag,
}: DesignSystemEnvironment): boolean {
  return dev || flag === "true"
}

export type { DesignSystemEnvironment }
