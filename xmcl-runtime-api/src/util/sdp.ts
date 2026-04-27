export function createOfferLauncherUrl(description: string) {
  return `modula://peer/offer/${description}`
}

export function createAnswerLauncherUrl(description: string) {
  return `modula://peer/answer/${description}`
}

export function createOfferAppUrl(description: string, inviter: string) {
  return `https://modula.app/peer?description=${description}?type=offer?inviter=${inviter}`
}

export function createAnswerAppUrl(description: string, inviter: string) {
  return `https://modula.app/peer?description=${description}?type=answer?inviter=${inviter}`
}
