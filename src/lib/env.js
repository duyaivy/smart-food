/*
 * This file should not be modified; use `env.js` in the project root to add your client environment variables.
 * If you import `Env` from `@env`, this is the file that will be loaded.
 * You can only access the client environment variables here.
 * NOTE: We use js file so we can load the client env types
 */

import Constants from 'expo-constants';
function getExtra() {
  const constants = /** @type {any} */ (Constants);

  // `expoConfig` works in many cases, but can be undefined depending on
  // how the app is run (Expo Go / dev-client / native).
  if (constants.expoConfig?.extra) return constants.expoConfig.extra;
  // Fallbacks for older/newer manifests.
  if (constants.manifest?.extra) return constants.manifest.extra;
  if (constants.manifest2?.extra) return constants.manifest2.extra;
  return {};
}

/** @type {typeof import('../../env.js').ClientEnv} */
// @ts-ignore - runtime object provided by Expo config/manifest
export const Env = getExtra();
