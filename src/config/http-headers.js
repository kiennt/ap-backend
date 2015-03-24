const HTTP_HEADERS = [
  {'X-Pinterest-Device': 'GT-I9300',
  'X-Pinterest-AppState': 'active',
  'User-Agent': 'Pinterest for Android/4.3.1 (c1lgt; 4.1.2)'},
  {'X-Pinterest-Device': 'SM-G900V',
  'X-Pinterest-AppState': 'active',
  'User-Agent': 'Pinterest for Android/4.3.1 (c1lgt; 4.4.4)'},
  {'X-Pinterest-Device': 'SM-N915A',
  'X-Pinterest-AppState': 'active',
  'User-Agent': 'Pinterest for Android/4.3.0 (c1lgt; 4.4.4)'},
  {'X-Pinterest-Device': 'Z998',
  'X-Pinterest-AppState': 'active',
  'User-Agent': 'Pinterest for Android/4.3.1 (c1lgt; 4.1.2)'},
  {'X-Pinterest-Device': 'XT1254',
  'X-Pinterest-AppState': 'active',
  'User-Agent': 'Pinterest for Android/4.3.1 (c1lgt; 4.4.4)'},
  {'X-Pinterest-Device': 'SGH-I527',
  'X-Pinterest-AppState': 'active',
  'User-Agent': 'Pinterest for Android/4.3.1 (c1lgt; 4.2.2)'},
  {'X-Pinterest-Device': 'SM-N900V',
  'X-Pinterest-AppState': 'active',
  'User-Agent': 'Pinterest for Android/4.3.1 (c1lgt; 4.4.4)'},
  {'X-Pinterest-Device': 'XT1080',
  'X-Pinterest-AppState': 'active',
  'User-Agent': 'Pinterest for Android/4.3.1 (c1lgt; 4.4.4)'},
  {'X-Pinterest-Device': 'SM-G900P',
  'X-Pinterest-AppState': 'active',
  'User-Agent': 'Pinterest for Android/4.3.0 (c1lgt; 4.4.4)'},
  {'X-Pinterest-Device': 'SM-N900T',
  'X-Pinterest-AppState': 'active',
  'User-Agent': 'Pinterest for Android/4.3.1 (c1lgt; 4.3)'},
  {'X-Pinterest-Device': 'SGH-M919',
  'X-Pinterest-AppState': 'active',
  'User-Agent': 'Pinterest for Android/4.3.1 (c1lgt; 4.4.4)'},
  {'X-Pinterest-Device': 'SM-G900V',
  'X-Pinterest-AppState': 'active',
  'User-Agent': 'Pinterest for Android/4.3.1 (c1lgt; 4.4.4)'}
];

function getRandomHeaders() {
  let index = Math.floor(Math.random() * HTTP_HEADERS.length);
  return HTTP_HEADERS[index];
}

export default {
  randomHeaders: getRandomHeaders
};
