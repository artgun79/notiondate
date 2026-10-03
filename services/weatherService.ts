import { WeatherData } from "../types";

// 키 없이 쓰는 무료 날씨 API (https://open-meteo.com, CC BY 4.0 — 출처 표기 필요)
const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const SOURCE = { title: "Open-Meteo", uri: "https://open-meteo.com/" };

type Coords = { latitude: number; longitude: number };

// 지오코딩으로 찾기 어려운 구 단위 이름은 좌표를 직접 둔다.
const PRESET_COORDS: Record<string, Coords> = {
  "인천 서구": { latitude: 37.5454, longitude: 126.6759 },
};

const coordsCache = new Map<string, Coords>();

// WMO 날씨 코드 → 한국어. App.tsx 아이콘은 '맑음'·'비'·'눈'·'구름'·'흐림'·'뇌우'·'안개' 글자로 고른다.
const WEATHER_CODE_KO: Record<number, string> = {
  0: "맑음",
  1: "대체로 맑음",
  2: "구름 조금",
  3: "흐림",
  45: "안개",
  48: "안개",
  51: "이슬비",
  53: "이슬비",
  55: "이슬비",
  56: "어는 비",
  57: "어는 비",
  61: "비",
  63: "비",
  65: "강한 비",
  66: "어는 비",
  67: "어는 비",
  71: "눈",
  73: "눈",
  75: "많은 눈",
  77: "싸락눈",
  80: "소낙비",
  81: "소낙비",
  82: "강한 소낙비",
  85: "소낙눈",
  86: "소낙눈",
  95: "뇌우",
  96: "뇌우",
  99: "뇌우",
};

export const weatherCodeToKorean = (code: number): string =>
  WEATHER_CODE_KO[code] ?? "알 수 없음";

const fetchJson = async (url: string): Promise<any> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
};

const geocode = async (query: string): Promise<Coords | null> => {
  const params = new URLSearchParams({ name: query, count: "1", language: "ko", format: "json" });
  const data = await fetchJson(`${GEOCODING_URL}?${params}`);
  const hit = data?.results?.[0];
  return hit ? { latitude: hit.latitude, longitude: hit.longitude } : null;
};

// '인천 서구'처럼 띄어 쓴 이름은 전체 → 첫 단어(시 단위) 순서로 찾아본다.
export const resolveCoords = async (location: string): Promise<Coords | null> => {
  const key = location.trim();
  if (PRESET_COORDS[key]) return PRESET_COORDS[key];
  if (coordsCache.has(key)) return coordsCache.get(key)!;

  const candidates = [key, key.split(/\s+/)[0]].filter((q, i, arr) => q && arr.indexOf(q) === i);
  for (const query of candidates) {
    const coords = await geocode(query);
    if (coords) {
      coordsCache.set(key, coords);
      return coords;
    }
  }
  return null;
};

export const getLiveWeather = async (location: string): Promise<WeatherData> => {
  try {
    const coords = await resolveCoords(location);
    if (!coords) throw new Error(`위치를 찾을 수 없음: ${location}`);

    const params = new URLSearchParams({
      latitude: String(coords.latitude),
      longitude: String(coords.longitude),
      current: "temperature_2m,relative_humidity_2m,weather_code",
      timezone: "auto",
    });
    const data = await fetchJson(`${FORECAST_URL}?${params}`);
    const current = data?.current;
    if (typeof current?.temperature_2m !== "number") throw new Error("날씨 응답 형식 오류");

    return {
      temp: current.temperature_2m,
      condition: weatherCodeToKorean(current.weather_code),
      location,
      humidity: current.relative_humidity_2m,
      lastUpdated: new Date(),
      sources: [SOURCE],
    };
  } catch (error) {
    console.error("Failed to fetch weather:", error);
    // Fallback data
    return {
      temp: 0,
      condition: '데이터 없음',
      location: location,
      lastUpdated: new Date()
    };
  }
};
