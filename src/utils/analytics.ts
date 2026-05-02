// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function sendToAnalytics(layer: any) {
  // @ts-expect-error dataLayer is global
  dataLayer.push(layer)
}
