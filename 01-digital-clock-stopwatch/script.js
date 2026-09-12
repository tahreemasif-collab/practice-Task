// ----- Tab switching -----
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
    panels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

// ----- Clock -----
const clockTime = document.getElementById('clockTime');
const dateLine = document.getElementById('dateLine');
const zoneLondon = document.getElementById('zoneLondon');
const zoneNY = document.getElementById('zoneNY');
const zoneTokyo = document.getElementById('zoneTokyo');

function pad(n){ return n.toString().padStart(2, '0'); }

function updateClock(){
  const now = new Date();
  clockTime.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  dateLine.textContent = now.toLocaleDateString(undefined, { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  const fmt = (tz) => new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour:'2-digit', minute:'2-digit', hour12:false }).format(now);
  zoneLondon.textContent = fmt('Europe/London');
  zoneNY.textContent = fmt('America/New_York');
  zoneTokyo.textContent = fmt('Asia/Tokyo');
}
updateClock();
setInterval(updateClock, 1000);

// ----- Stopwatch -----
const swTime = document.getElementById('swTime');
const swStartStop = document.getElementById('swStartStop');
const swLap = document.getElementById('swLap');
const swReset = document.getElementById('swReset');
const lapList = document.getElementById('lapList');

let swInterval = null;
let elapsed = 0; // ms
let startTs = 0;
let lapCount = 0;

function formatSw(ms){
  const centis = Math.floor((ms % 1000) / 10);
  const totalSeconds = Math.floor(ms / 1000);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60);
  return `${pad(minutes)}:${pad(seconds)}.${pad(centis)}`;
}

function renderSw(){
  swTime.textContent = formatSw(elapsed);
}

swStartStop.addEventListener('click', () => {
  if (swInterval){
    clearInterval(swInterval);
    swInterval = null;
    elapsed += Date.now() - startTs;
    swStartStop.textContent = 'Resume';
    swStartStop.classList.remove('primary');
    swLap.disabled = true;
  } else {
    startTs = Date.now();
    swInterval = setInterval(() => {
      renderSw2();
    }, 30);
    swStartStop.textContent = 'Pause';
    swStartStop.classList.add('primary');
    swLap.disabled = false;
  }
});

function renderSw2(){
  const current = elapsed + (Date.now() - startTs);
  swTime.textContent = formatSw(current);
}

swLap.addEventListener('click', () => {
  const current = elapsed + (Date.now() - startTs);
  lapCount += 1;
  const li = document.createElement('li');
  li.innerHTML = `<span>Lap ${lapCount}</span><span>${formatSw(current)}</span>`;
  lapList.prepend(li);
});

swReset.addEventListener('click', () => {
  clearInterval(swInterval);
  swInterval = null;
  elapsed = 0;
  lapCount = 0;
  renderSw();
  lapList.innerHTML = '';
  swStartStop.textContent = 'Start';
  swStartStop.classList.remove('primary');
  swLap.disabled = true;
});

renderSw();
