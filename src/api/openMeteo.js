const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

// API sonuçları projeye kopyalanmaz; her aramada canlı istek yapılır.
async function getJson(url, signal) {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`Sunucu hatası (${response.status})`);
  return response.json();
}

export async function searchCities(term, signal) {
  const name = term.trim();
  if (name.length < 2) return [];
  const url = `${GEO_URL}?count=10&language=tr&name=${encodeURIComponent(name)}`;
  const data = await getJson(url, signal);
  return Array.isArray(data.results) ? data.results : [];
}

export async function fetchWindForecast(city, signal) {
  const { latitude, longitude } = city;
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error('Şehrin koordinat bilgisi bulunamadı.');
  }
  const query = [
    `latitude=${encodeURIComponent(latitude)}`,
    `longitude=${encodeURIComponent(longitude)}`,
    'timezone=Europe%2FIstanbul',
    'forecast_days=7',
    'daily=wind_speed_10m_max,wind_direction_10m_dominant,weather_code',
  ].join('&');
  return getJson(`${FORECAST_URL}?${query}`, signal);
}
