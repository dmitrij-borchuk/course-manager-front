export function sendToAnalytics(layer: any) {
  // @ts-ignore
  dataLayer.push(layer)
}
