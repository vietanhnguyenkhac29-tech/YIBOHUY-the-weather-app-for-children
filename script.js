/* ============================================================
   YIBOHUY — Weather Website JS
   Uses Open-Meteo (free, no API key needed) + geocoding
   ============================================================ */

const API_KEY_WEATHER = ''; // Open-Meteo is free, no key needed
const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

// ===== WMO WEATHER CODE MAPPING =====
const WMO = {
  0:  { emoji: '☀️',  label: 'Trời quang đãng' },
  1:  { emoji: '🌤️', label: 'Hầu như quang đãng' },
  2:  { emoji: '⛅',  label: 'Có mây rải rác' },
  3:  { emoji: '☁️',  label: 'U ám' },
  45: { emoji: '🌫️', label: 'Sương mù' },
  48: { emoji: '🌫️', label: 'Sương mù băng' },
  51: { emoji: '🌦️', label: 'Mưa phùn nhẹ' },
  53: { emoji: '🌦️', label: 'Mưa phùn vừa' },
  55: { emoji: '🌧️', label: 'Mưa phùn dày' },
  61: { emoji: '🌧️', label: 'Mưa nhẹ' },
  63: { emoji: '🌧️', label: 'Mưa vừa' },
  65: { emoji: '🌧️', label: 'Mưa to' },
  71: { emoji: '🌨️', label: 'Tuyết nhẹ' },
  73: { emoji: '🌨️', label: 'Tuyết vừa' },
  75: { emoji: '🌨️', label: 'Tuyết dày' },
  77: { emoji: '🌨️', label: 'Hạt tuyết' },
  80: { emoji: '🌦️', label: 'Mưa rào nhẹ' },
  81: { emoji: '🌦️', label: 'Mưa rào vừa' },
  82: { emoji: '⛈️', label: 'Mưa rào mạnh' },
  85: { emoji: '🌨️', label: 'Tuyết rào nhẹ' },
  86: { emoji: '🌨️', label: 'Tuyết rào mạnh' },
  95: { emoji: '⛈️', label: 'Dông bão' },
  96: { emoji: '⛈️', label: 'Dông kèm mưa đá nhẹ' },
  99: { emoji: '⛈️', label: 'Dông kèm mưa đá mạnh' },
};

function getWMO(code) {
  return WMO[code] || { emoji: '🌡️', label: 'Không xác định' };
}

// ===== PAGE NAVIGATION =====
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const page = link.dataset.page;
    navigateTo(page);

    // close hamburger
    document.querySelector('.nav-links').classList.remove('open');
  });
});

document.getElementById('hamburger').addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('open');
});

document.getElementById('btn-search-hero').addEventListener('click', () => {
  navigateTo('search');
});

function navigateTo(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  document.getElementById(`page-${page}`).classList.add('active');
  document.querySelector(`[data-page="${page}"]`)?.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  syncBottomNav(page);
}

// ===== FLOATING PARTICLES =====
function createParticles() {
  const container = document.getElementById('particles');
  const emojis = ['☁️','⭐','🌟','✨','💧','❄️','🌸','🍃','🌺'];
  for (let i = 0; i < 15; i++) {
    const el = document.createElement('div');
    el.className = 'particle';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left = Math.random() * 100 + 'vw';
    el.style.animationDuration = (10 + Math.random() * 20) + 's';
    el.style.animationDelay = '-' + Math.random() * 20 + 's';
    el.style.fontSize = (0.8 + Math.random() * 1.4) + 'rem';
    container.appendChild(el);
  }
}
createParticles();

// ===== GEOCODING =====
async function geocodeCity(city) {
  const res = await fetch(`${GEO_URL}?name=${encodeURIComponent(city)}&count=1&language=vi&format=json`);
  const data = await res.json();
  if (!data.results || data.results.length === 0) throw new Error('Không tìm thấy thành phố');
  return data.results[0];
}

// ===== FETCH WEATHER =====
async function fetchWeather(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: [
      'temperature_2m','relative_humidity_2m','apparent_temperature',
      'weather_code','wind_speed_10m','wind_direction_10m',
      'surface_pressure','visibility','uv_index'
    ].join(','),
    hourly: 'temperature_2m,weather_code,precipitation_probability',
    daily: [
      'weather_code','temperature_2m_max','temperature_2m_min',
      'sunrise','sunset','precipitation_probability_max','uv_index_max'
    ].join(','),
    timezone: 'auto',
    forecast_days: 6,
    wind_speed_unit: 'kmh'
  });
  const res = await fetch(`${WEATHER_URL}?${params}`);
  return res.json();
}

// ===== WIND DIRECTION =====
function windDir(deg) {
  const dirs = ['Bắc','Đông Bắc','Đông','Đông Nam','Nam','Tây Nam','Tây','Tây Bắc'];
  return dirs[Math.round(deg / 45) % 8];
}

// ===== FORMAT DATE =====
function formatDay(dateStr, short = false) {
  const d = new Date(dateStr);
  const days = ['CN','T2','T3','T4','T5','T6','T7'];
  const daysFull = ['Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'];
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return 'Hôm nay';
  const tom = new Date(today); tom.setDate(today.getDate() + 1);
  if (d.toDateString() === tom.toDateString()) return 'Ngày mai';
  return short ? days[d.getDay()] : daysFull[d.getDay()];
}

function formatHour(dtStr) {
  const d = new Date(dtStr);
  const now = new Date();
  if (Math.abs(d - now) < 30 * 60 * 1000) return 'Bây giờ';
  return d.getHours().toString().padStart(2, '0') + ':00';
}

// ===== RENDER HOME WEATHER =====
async function loadHomeWeather() {
  try {
    const geo = await geocodeCity('Hanoi');
    const data = await fetchWeather(geo.latitude, geo.longitude);
    renderCurrentCard(data, 'Hà Nội', 'Việt Nam', 'home-weather-card');
    renderForecast(data, 'home-forecast');
  } catch (e) {
    document.getElementById('home-weather-card').innerHTML = `
      <div style="text-align:center;padding:1rem">
        <div style="font-size:3rem">😔</div>
        <p style="font-weight:700;color:var(--text-soft)">Không thể tải thời tiết. Hãy kiểm tra kết nối mạng!</p>
      </div>`;
  }
}

function renderCurrentCard(data, cityName, country, cardId) {
  const c = data.current;
  const w = getWMO(c.weather_code);
  document.getElementById(cardId).innerHTML = `
    <div class="weather-main">
      <div class="weather-icon-big">${w.emoji}</div>
      <div class="weather-info-main">
        <div class="city-name">📍 ${cityName}</div>
        <div class="weather-temp">${Math.round(c.temperature_2m)}°C</div>
        <div class="weather-desc">${w.label}</div>
        <div class="weather-mini-stats">
          <div class="mini-stat">🌡️ Cảm giác ${Math.round(c.apparent_temperature)}°C</div>
          <div class="mini-stat">💧 Độ ẩm ${c.relative_humidity_2m}%</div>
          <div class="mini-stat">💨 Gió ${Math.round(c.wind_speed_10m)} km/h</div>
          <div class="mini-stat">☀️ UV ${c.uv_index}</div>
        </div>
      </div>
    </div>`;
}

function renderForecast(data, containerId) {
  const el = document.getElementById(containerId);
  const { daily } = data;
  let html = '';
  for (let i = 0; i < Math.min(5, daily.time.length); i++) {
    const w = getWMO(daily.weather_code[i]);
    html += `
      <div class="forecast-card" style="animation-delay:${i * 0.08}s">
        <div class="forecast-day">${formatDay(daily.time[i], true)}</div>
        <div class="forecast-icon">${w.emoji}</div>
        <div style="font-size:0.78rem;color:var(--text-soft);font-weight:600;margin-bottom:0.3rem">${w.label}</div>
        <div class="forecast-temp-range">
          <span class="temp-high">↑${Math.round(daily.temperature_2m_max[i])}°</span>
          <span class="temp-low">↓${Math.round(daily.temperature_2m_min[i])}°</span>
        </div>
        <div style="font-size:0.78rem;margin-top:0.3rem;color:var(--sky-deep);font-weight:600">🌧️ ${daily.precipitation_probability_max[i] || 0}%</div>
      </div>`;
  }
  el.innerHTML = html;
}

// ===== SEARCH =====
document.getElementById('btn-search').addEventListener('click', doSearch);
document.getElementById('city-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') doSearch();
});
document.querySelectorAll('.city-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.getElementById('city-input').value = chip.dataset.city;
    doSearch();
    window.scrollTo({ top: 300, behavior: 'smooth' });
  });
});

async function doSearch() {
  const city = document.getElementById('city-input').value.trim();
  if (!city) return;

  const resultSection = document.getElementById('search-result-section');
  const errorDiv = document.getElementById('search-error');
  const resultCard = document.getElementById('search-result-card');

  resultSection.style.display = 'block';
  errorDiv.style.display = 'none';
  resultCard.innerHTML = `
    <div class="loading-anim" style="margin:2rem auto">
      <div class="loader-emoji">🌍</div>
      <p>Đang tìm kiếm "${city}"...</p>
    </div>`;

  try {
    const geo = await geocodeCity(city);
    const data = await fetchWeather(geo.latitude, geo.longitude);
    renderSearchResult(data, geo);
    resultSection.style.display = 'block';
    setTimeout(() => resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  } catch (e) {
    resultSection.style.display = 'none';
    errorDiv.style.display = 'block';
  }
}

function renderSearchResult(data, geo) {
  const c = data.current;
  const w = getWMO(c.weather_code);

  // Main card
  document.getElementById('search-result-card').innerHTML = `
    <div class="result-city">${geo.name}</div>
    <div class="result-country">📍 ${geo.admin1 ? geo.admin1 + ', ' : ''}${geo.country}</div>
    <div class="result-main">
      <div class="result-icon">${w.emoji}</div>
      <div>
        <div class="result-temp">${Math.round(c.temperature_2m)}°C</div>
        <div class="result-feels">Cảm giác như ${Math.round(c.apparent_temperature)}°C</div>
        <div class="result-desc">${w.label}</div>
      </div>
    </div>
    <div class="result-quick-stats">
      <div class="result-stat">💧 ${c.relative_humidity_2m}%</div>
      <div class="result-stat">💨 ${Math.round(c.wind_speed_10m)} km/h ${windDir(c.wind_direction_10m)}</div>
      <div class="result-stat">☀️ UV ${c.uv_index}</div>
      <div class="result-stat">🔵 ${Math.round(c.surface_pressure)} hPa</div>
    </div>`;

  // Hourly — next 24 hours
  const now = new Date();
  const { hourly } = data;
  let hourlyHtml = '';
  let count = 0;
  for (let i = 0; i < hourly.time.length && count < 24; i++) {
    const t = new Date(hourly.time[i]);
    if (t < now - 30 * 60 * 1000) continue;
    const hw = getWMO(hourly.weather_code[i]);
    hourlyHtml += `
      <div class="hourly-card">
        <div class="hourly-time">${formatHour(hourly.time[i])}</div>
        <div class="hourly-icon">${hw.emoji}</div>
        <div class="hourly-temp">${Math.round(hourly.temperature_2m[i])}°</div>
        ${hourly.precipitation_probability[i] ? `<div style="font-size:0.7rem;color:var(--sky-deep);font-weight:700">🌧️${hourly.precipitation_probability[i]}%</div>` : ''}
      </div>`;
    count++;
  }
  document.getElementById('hourly-scroll').innerHTML = hourlyHtml;

  // Forecast
  renderForecast(data, 'search-forecast');

  // Details
  const sunrise = new Date(data.daily.sunrise[0]);
  const sunset = new Date(data.daily.sunset[0]);
  const fmtTime = d => d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0');

  document.getElementById('details-grid').innerHTML = `
    <div class="detail-card"><div class="detail-icon">💧</div><div class="detail-label">Độ ẩm</div><div class="detail-value">${c.relative_humidity_2m}%</div></div>
    <div class="detail-card"><div class="detail-icon">💨</div><div class="detail-label">Tốc độ gió</div><div class="detail-value">${Math.round(c.wind_speed_10m)} km/h</div></div>
    <div class="detail-card"><div class="detail-icon">🧭</div><div class="detail-label">Hướng gió</div><div class="detail-value">${windDir(c.wind_direction_10m)}</div></div>
    <div class="detail-card"><div class="detail-icon">🔵</div><div class="detail-label">Áp suất</div><div class="detail-value">${Math.round(c.surface_pressure)} hPa</div></div>
    <div class="detail-card"><div class="detail-icon">☀️</div><div class="detail-label">Chỉ số UV</div><div class="detail-value">${c.uv_index}</div></div>
    <div class="detail-card"><div class="detail-icon">🌅</div><div class="detail-label">Bình minh</div><div class="detail-value">${fmtTime(sunrise)}</div></div>
    <div class="detail-card"><div class="detail-icon">🌇</div><div class="detail-label">Hoàng hôn</div><div class="detail-value">${fmtTime(sunset)}</div></div>
    <div class="detail-card"><div class="detail-icon">🌧️</div><div class="detail-label">Xác suất mưa</div><div class="detail-value">${data.daily.precipitation_probability_max[0] || 0}%</div></div>`;
}

// ===== LEARN MODAL DATA =====
const learnData = {
  sunny: {
    icon: '☀️',
    title: 'Trời Nắng',
    body: `
      <p>Khi <strong>trời nắng</strong>, mặt trời chiếu sáng rực rỡ và bầu trời trong xanh không có mây che!</p>
      <p>🌡️ Nhiệt độ thường cao, không khí ấm áp, dễ chịu. Đây là thời tiết tuyệt vời để ra ngoài vui chơi!</p>
      <p>🌱 Ánh sáng mặt trời giúp cây cối quang hợp — tức là cây dùng ánh sáng để tạo ra thức ăn cho mình!</p>
    `,
    fun: '🎈 Khi trời nắng đẹp, hãy thoa kem chống nắng nhé! Tia UV có thể làm cháy da đấy!'
  },
  cloudy: {
    icon: '☁️',
    title: 'Có Mây',
    body: `
      <p><strong>Mây</strong> được tạo thành từ hàng triệu hạt nước cực nhỏ hoặc tinh thể băng lơ lửng trên bầu trời!</p>
      <p>☁️ Có 3 loại mây chính: <strong>Cumulus</strong> (mây bông tròn), <strong>Stratus</strong> (mây tầng phẳng), và <strong>Cirrus</strong> (mây sợi mỏng cao).</p>
      <p>💨 Mây di chuyển theo chiều gió. Chúng có thể bay rất nhanh hoặc rất chậm!</p>
    `,
    fun: '🌤️ Một đám mây trung bình nặng... khoảng 500 tấn! Nhưng vẫn nổi được vì các hạt nước rất nhỏ và nhẹ!'
  },
  rainy: {
    icon: '🌧️',
    title: 'Trời Mưa',
    body: `
      <p>Mưa xảy ra khi các hạt nước trong mây đủ nặng và rơi xuống mặt đất!</p>
      <p>💧 Một giọt mưa rơi với tốc độ khoảng <strong>8-9 km/h</strong>.</p>
      <p>🌱 Mưa rất quan trọng! Nó tưới cây, bổ sung nước cho sông hồ, và làm mát không khí.</p>
      <p>🌈 Sau cơn mưa thường xuất hiện cầu vồng đẹp!</p>
    `,
    fun: '🐸 Ếch rất thích mưa! Chúng hấp thụ nước qua da thay vì uống bằng miệng!'
  },
  thunder: {
    icon: '⛈️',
    title: 'Dông Bão',
    body: `
      <p><strong>Dông bão</strong> xảy ra khi không khí nóng ẩm bốc lên cao tạo thành những đám mây khổng lồ!</p>
      <p>⚡ Sét là tia điện cực mạnh, nóng hơn bề mặt mặt trời tới 5 lần — khoảng 30.000°C!</p>
      <p>🔊 Sấm là âm thanh của không khí giãn nở nhanh chóng khi bị sét đốt nóng.</p>
      <p>💡 Bạn có thể tính khoảng cách cơn dông: đếm giây giữa chớp và sấm, chia cho 3 → kết quả là km!</p>
    `,
    fun: '⚡ Trái Đất bị sét đánh khoảng 100 lần mỗi giây! Nhớ tránh trú dưới cây to khi có dông nhé!'
  },
  snow: {
    icon: '❄️',
    title: 'Tuyết Rơi',
    body: `
      <p><strong>Tuyết</strong> hình thành khi hơi nước trong không khí đóng băng thành tinh thể băng sáu cạnh!</p>
      <p>❄️ Mỗi bông tuyết có hình dạng độc đáo riêng — không có hai bông tuyết nào hoàn toàn giống nhau!</p>
      <p>🌡️ Tuyết rơi khi nhiệt độ xuống dưới 0°C. Ở Việt Nam, tuyết có thể thấy ở vùng núi cao như Sa Pa!</p>
    `,
    fun: '⛄ Tuyết thực ra có màu trắng vì ánh sáng phản chiếu từ nhiều tinh thể băng — bản thân băng thực ra trong suốt!'
  },
  rainbow: {
    icon: '🌈',
    title: 'Cầu Vồng',
    body: `
      <p><strong>Cầu vồng</strong> xuất hiện khi ánh sáng mặt trời đi qua các giọt nước mưa và bị phân tách thành 7 màu!</p>
      <p>🔴🟠🟡🟢🔵🟣 7 màu theo thứ tự: Đỏ, Cam, Vàng, Lục, Lam, Chàm, Tím!</p>
      <p>🔵 Thực ra cầu vồng là một vòng tròn đầy đủ — nhưng mặt đất che mất nửa dưới!</p>
      <p>👁️ Để thấy cầu vồng, bạn cần đứng giữa mặt trời và cơn mưa!</p>
    `,
    fun: '✈️ Từ trên máy bay, bạn có thể thấy cầu vồng là vòng tròn đầy đủ — thật kỳ diệu!'
  },
  wind: {
    icon: '💨',
    title: 'Gió Thổi',
    body: `
      <p><strong>Gió</strong> là không khí chuyển động từ vùng áp suất cao sang vùng áp suất thấp!</p>
      <p>🌡️ Nguyên nhân: mặt trời sưởi ấm không đều bề mặt Trái Đất, tạo ra sự chênh lệch nhiệt độ và áp suất.</p>
      <p>🌊 Gió tạo ra sóng biển, giúp phân tán hạt phấn hoa, và làm mát chúng ta khi trời nóng!</p>
      <p>💡 Tốc độ gió đo bằng thang Beaufort từ 0 (lặng gió) đến 12 (bão tố)!</p>
    `,
    fun: '🌪️ Gió nhanh nhất từng đo được là 408 km/h trong cơn bão Olivia năm 1996 ở Úc!'
  },
  fog: {
    icon: '🌫️',
    title: 'Sương Mù',
    body: `
      <p><strong>Sương mù</strong> thực ra là một đám mây rất thấp, nằm ngay trên mặt đất!</p>
      <p>💧 Nó tạo thành khi không khí ẩm nguội xuống và hơi nước ngưng tụ thành các hạt nước li ti.</p>
      <p>🌅 Sương mù thường xuất hiện vào sáng sớm hoặc ban đêm khi nhiệt độ thấp.</p>
      <p>👁️ Sương mù dày có thể làm giảm tầm nhìn xuống dưới 100 mét!</p>
    `,
    fun: '🚗 Khi trời sương mù, hãy nhắc bố mẹ bật đèn xe và lái chậm hơn để an toàn nhé!'
  }
};

window.openModal = function(key) {
  const d = learnData[key];
  if (!d) return;
  document.getElementById('modal-content').innerHTML = `
    <span class="modal-icon">${d.icon}</span>
    <h2 class="modal-title">${d.title}</h2>
    <div class="modal-body">${d.body}</div>
    <div class="modal-fun">💡 <strong>Điều thú vị:</strong> ${d.fun}</div>`;
  document.getElementById('modal-overlay').classList.add('open');
};

window.closeModal = function() {
  document.getElementById('modal-overlay').classList.remove('open');
};

// ===== QUIZ =====
const quizData = [
  {
    q: '☀️ Tại sao bầu trời có màu xanh?',
    options: ['Vì biển phản chiếu lên', 'Vì không khí tán xạ ánh sáng xanh', 'Vì Trái Đất được sơn màu xanh', 'Vì mây có màu xanh'],
    answer: 1,
    explain: '🌟 Đúng rồi! Không khí tán xạ ánh sáng màu xanh mạnh hơn các màu khác!'
  },
  {
    q: '🌧️ Mưa được tạo thành từ đâu?',
    options: ['Từ nước máy', 'Từ hơi nước ngưng tụ trong mây', 'Từ đại dương phun lên', 'Từ sông bay lên trực tiếp'],
    answer: 1,
    explain: '💧 Đúng! Hơi nước bay lên, ngưng tụ tạo mây, sau đó rơi xuống thành mưa!'
  },
  {
    q: '❄️ Bao nhiêu độ C thì nước đóng thành băng?',
    options: ['10°C', '5°C', '0°C', '-10°C'],
    answer: 2,
    explain: '🧊 Chính xác! Nước đóng băng ở 0°C (32°F)!'
  },
  {
    q: '🌈 Cầu vồng có bao nhiêu màu?',
    options: ['5 màu', '6 màu', '7 màu', '8 màu'],
    answer: 2,
    explain: '🎨 Tuyệt vời! 7 màu: Đỏ, Cam, Vàng, Lục, Lam, Chàm, Tím!'
  },
  {
    q: '⛈️ Cái gì xuất hiện trước — chớp hay sấm?',
    options: ['Sấm', 'Chớp', 'Cả hai cùng lúc', 'Tùy thời tiết'],
    answer: 1,
    explain: '⚡ Đúng! Chớp xuất hiện trước vì ánh sáng nhanh hơn âm thanh!'
  },
  {
    q: '💨 Gió là gì?',
    options: ['Hơi nước di chuyển', 'Không khí chuyển động', 'Nhiệt độ thay đổi', 'Mây di chuyển'],
    answer: 1,
    explain: '🌬️ Giỏi lắm! Gió là không khí chuyển động từ nơi áp suất cao đến thấp!'
  },
  {
    q: '🌫️ Sương mù thực ra là gì?',
    options: ['Khói từ nhà máy', 'Đám mây rất thấp', 'Hơi nước từ biển', 'Bụi trong không khí'],
    answer: 1,
    explain: '☁️ Chính xác! Sương mù là đám mây nằm ngay sát mặt đất!'
  },
  {
    q: '☁️ Điều gì tạo thành mây?',
    options: ['Bông gòn bay lên', 'Hơi nước ngưng tụ', 'Khói từ núi lửa', 'Không khí lạnh đóng băng'],
    answer: 1,
    explain: '💧 Tuyệt! Hơi nước bốc lên cao, gặp lạnh ngưng tụ thành hàng triệu giọt nước li ti!'
  }
];

let currentQ = 0;
let score = 0;
let answered = false;

function renderQuiz() {
  const q = quizData[currentQ];
  const el = document.getElementById('quiz-box');
  el.innerHTML = `
    <div style="text-align:center;margin-bottom:0.8rem;color:var(--text-soft);font-weight:700;font-size:0.9rem">
      Câu ${currentQ + 1}/${quizData.length} | ⭐ Điểm: ${score}
    </div>
    <div class="quiz-question">${q.q}</div>
    <div class="quiz-options">
      ${q.options.map((opt, i) => `
        <button class="quiz-option" onclick="checkAnswer(${i})">${opt}</button>
      `).join('')}
    </div>
    <div class="quiz-result" id="quiz-result"></div>`;
  answered = false;
}

window.checkAnswer = function(idx) {
  if (answered) return;
  answered = true;
  const q = quizData[currentQ];
  const btns = document.querySelectorAll('.quiz-option');
  btns.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.answer) btn.classList.add('correct');
    else if (i === idx) btn.classList.add('wrong');
  });
  const result = document.getElementById('quiz-result');
  if (idx === q.answer) {
    score++;
    result.innerHTML = `✅ ${q.explain}<br><button class="quiz-next-btn" onclick="nextQuestion()">Câu tiếp theo →</button>`;
    result.style.color = '#2F9E44';
  } else {
    result.innerHTML = `❌ Chưa đúng! ${q.explain}<br><button class="quiz-next-btn" onclick="nextQuestion()">Câu tiếp theo →</button>`;
    result.style.color = '#E03131';
  }
};

window.nextQuestion = function() {
  currentQ++;
  if (currentQ >= quizData.length) {
    const stars = score >= 7 ? '⭐⭐⭐' : score >= 5 ? '⭐⭐' : '⭐';
    const msg = score >= 7 ? 'Siêu giỏi! Bạn là chuyên gia thời tiết rồi!' :
                score >= 5 ? 'Giỏi lắm! Tiếp tục học thêm nhé!' : 'Cố lên! Học thêm và thử lại nhé!';
    document.getElementById('quiz-box').innerHTML = `
      <div style="text-align:center;padding:2rem">
        <div style="font-size:4rem;margin-bottom:1rem">${stars}</div>
        <div style="font-family:'Baloo 2',cursive;font-size:1.6rem;font-weight:800;color:var(--sky-deep);margin-bottom:0.5rem">
          Kết quả: ${score}/${quizData.length}
        </div>
        <div style="font-size:1.1rem;font-weight:700;color:var(--text-soft);margin-bottom:1.5rem">${msg}</div>
        <button class="quiz-next-btn" onclick="restartQuiz()">🔄 Chơi lại!</button>
      </div>`;
    return;
  }
  renderQuiz();
};

window.restartQuiz = function() {
  currentQ = 0;
  score = 0;
  renderQuiz();
};

// ===== SERVICE WORKER REGISTRATION =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}

// ===== PWA INSTALL BANNER =====
let deferredPrompt = null;
const pwaBanner = document.getElementById('pwa-banner');
const pwaInstallBtn = document.getElementById('pwa-install-btn');
const pwaBannerClose = document.getElementById('pwa-banner-close');

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  // Show banner after 3 seconds
  setTimeout(() => {
    if (!localStorage.getItem('pwa-dismissed')) {
      pwaBanner.classList.add('show');
    }
  }, 3000);
});

pwaInstallBtn?.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  deferredPrompt = null;
  pwaBanner.classList.remove('show');
  if (outcome === 'accepted') localStorage.setItem('pwa-dismissed', '1');
});

pwaBannerClose?.addEventListener('click', () => {
  pwaBanner.classList.remove('show');
  localStorage.setItem('pwa-dismissed', '1');
});

// ===== PWA URL PARAM ROUTING (shortcut support) =====
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('page')) navigateTo(urlParams.get('page'));

// ===== BOTTOM NAV =====
document.querySelectorAll('.bottom-nav-item').forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    const page = item.dataset.page;
    navigateTo(page);
    document.querySelectorAll('.bottom-nav-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
  });
});

// Sync bottom nav with page nav
function syncBottomNav(page) {
  document.querySelectorAll('.bottom-nav-item').forEach(i => {
    i.classList.toggle('active', i.dataset.page === page);
  });
}

// ===== INIT =====
loadHomeWeather();
renderQuiz();