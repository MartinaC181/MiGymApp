import AsyncStorage from '@react-native-async-storage/async-storage';

const ENDPOINT = 'https://libretranslate.de/translate';
const CACHE_PREFIX = '@Translation:';
const CACHE_TTL = 30 * 24 * 60 * 60 * 1000; // 30 días

export const getCachedTranslation = async (text: string) => {
  const key = `${CACHE_PREFIX}${text}`;
  const cached = await AsyncStorage.getItem(key);
  if (!cached) return null;

  const { translated, timestamp } = JSON.parse(cached);
  if (Date.now() - timestamp < CACHE_TTL) return translated;

  await AsyncStorage.removeItem(key);
  return null;
};


const saveTranslation = async (text: string, translated: string) => {
  const key = `${CACHE_PREFIX}${text}`;
  const payload = JSON.stringify({ translated, timestamp: Date.now() });
  await AsyncStorage.setItem(key, payload);
};


export const translateText = async (text: string): Promise<string> => {
  if (!text) return text;

  const cached = await getCachedTranslation(text);
  if (cached) return cached;

  const librePayload = JSON.stringify({ q: text, source: 'en', target: 'es', format: 'text' });
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: librePayload
    });
    const data = await res.json();
    const translated = data?.translatedText || text;
    await saveTranslation(text, translated);
    return translated;
  } catch (_) {
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=${encodeURIComponent(text)}`;
      const res2 = await fetch(url);
      const data2 = await res2.json();
      const translated2 = Array.isArray(data2) ? (data2[0]?.[0]?.[0] ?? text) : text;
      await saveTranslation(text, translated2);
      return translated2;
    } catch (__){
      return text;
    }
  }
};
