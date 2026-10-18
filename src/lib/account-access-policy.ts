/** Only explicitly issued temporary credentials require replacement. Legacy flags are not evidence. */
export function requiresPasswordChange(profile: { temporaryPasswordExpiresAt?: string; passwordChanged?: boolean }) {
  return Boolean(profile.temporaryPasswordExpiresAt) && profile.passwordChanged !== true;
}
