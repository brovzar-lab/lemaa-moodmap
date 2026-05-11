const PLACEHOLDER_KEYS = new Set([
  'REPLACE_WITH_VALUE',
  'demo-placeholder',
  'your_api_key',
])

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY

// Firebase Web API keys always start with "AIza". Anything else is a placeholder or invalid key.
export const isDemoMode =
  !apiKey ||
  apiKey.trim() === '' ||
  PLACEHOLDER_KEYS.has(apiKey) ||
  !apiKey.startsWith('AIza')

console.log('[MoodMap] Demo mode:', isDemoMode)
