// import { escapeHTML } from './helpers.js';

const bars = document.querySelector('#menu-icon');
const container = document.querySelector('.header');
const overlay = document.getElementById('overlay');
const city   = document.getElementById('city');


bars.addEventListener('click', () => {
  container.classList.toggle('active');
  bars.classList.toggle('fa-bars')
  overlay.classList.toggle('active');
  bars.classList.toggle('fa-times');
});

overlay.addEventListener('click', () => {
  container.classList.remove('active');
  bars.classList.toggle('fa-times')
  bars.classList.toggle('fa-bars')
  overlay.classList.remove('active');
});

const submenu = document.getElementById('browse-escorts-submenu');
const trig = document.querySelector('#browse-escorts-trigger');

trig.addEventListener('click', (e)=> {

  e.preventDefault(); // prevent # from jumping to top
  // submenu.classList.toggle('active'); // show/hide submenu 
  submenu.style.display = 'block'
});

window.addEventListener('resize', () => {
  if (window.innerWidth >= 768) {
    submenu.style.display = 'block';
  } else {
    submenu.style.display = 'none';
    submenu.classList.remove('active');
  }
});

document.addEventListener('click', (e) => {
  const isMobile = window.innerWidth < 768;

  if (isMobile) {
    if (!trig.contains(e.target) && !submenu.contains(e.target)) {
      submenu.style.display = 'none';
    }
  } else {
    // Desktop: lock submenu open once, only if not already displayed
    if (submenu.style.display !== 'block') {
      submenu.style.display = 'block';
    }
  }
});


document.addEventListener('DOMContentLoaded', async () => {
  const submenu = document.getElementById('browse-escorts-submenu');

    const location = {
  Nairobi: [
    "Kilimani", "Westlands", "Karen", "CBD", "Roysambu", "Ngara", "Nairobi West", "Donholm", "Dandora", "Ojijo", "Yaya", "Sarit",
    "Ruaka", "Syokimau", "Kitengela", "Embakasi", "South B", "South C", "Lavington", "Parklands"
  ],
  Kiambu: [
    "Juja", "Kikuyu", "Ruiru", "Githurai",
    "Thika", "Limuru", "Kabete", "Tigoni"]}
//   ],
//   Mombasa: [
//     "Diani", "Nyali", "Likoni",
//     "Mtwapa", "Bamburi", "Shanzu", "Kisauni"
//   ],
//   Nakuru: [
//     "Naivasha", "Nakuru Town", "Gilgil",
//     "Lanet", "Njoro", "Pipeline", "Kabarak"
//   ],
//   Kisumu: [
//     "Kisumu Town",
//     "Milimani", "Riat Hills", "Mamboleo", "Manyatta"
//   ],
//   Eldoret: [
//     "Eldoret Town", "Langas",
//     "Kapsoya", "Elgon View", "Annex", "Pioneer"
//   ],
//   Machakos: [
//     "Athi River", "Kangundo", "Joska", "Mwala", "Syokimau"
//   ],
//   Laikipia: [
//     "Nanyuki", "Rumuruti", "Timau"
//   ],
//   Kajiado: [
//     "Ongata Rongai", "Kitengela", "Ngong", "Kiserian"
//   ],
//   Kilifi: [
//     "Kilifi Town", "Malindi", "Watamu", "Mtwapa"
//   ],
//   UasinGishu: [
//     "Eldoret", "Turbo", "Moiben"
//   ],
//   Kisii: [
//     "Kisii Town", "Nyanchwa", "Suneka"
//   ],
//   Kakamega: [
//     "Kakamega Town", "Shinyalu", "Lurambi"
//   ]
// };


  // Load preferred city from localStorage
  
let prefferedOption = localStorage.getItem('prefferedOption')
    ? JSON.parse(localStorage.getItem('prefferedOption'))
    : {city: 'Nairobi', gender: 'Female'};
    // Load cached area count data
  let cached = localStorage.getItem('cachedAreaCounts') ? JSON.parse(localStorage.getItem('cachedAreaCounts')) : []
  const cacheExpiry = 10 * 60 * 1000; // 25 mins

  let areaData;

  if (cached && (Date.now() - cached.timestamp < cacheExpiry)) {
    // Use cached data
    areaData = cached.data;
  } else {
    // Fetch fresh data and cache it
    if (prefferedOption && location[prefferedOption.city]) {
      submenu.innerHTML = '<p>Loading areas...</p>';
      try {
        const res = await fetch('/areas-with-counts');
        const fresh = await res.json();
        areaData = fresh;
        localStorage.setItem('cachedAreaCounts', JSON.stringify({ data: fresh, timestamp: Date.now() }));
      } catch (err) {
        console.error('Fetch failed:', err);
        submenu.innerHTML = '<p>Error loading areas.</p>';
        return;
      }
    }
  }

  // Only proceed if we have valid data and a preferred city
  if (!areaData || !prefferedOption || !location[prefferedOption.city]) return;

  submenu.innerHTML = '<span>Loading areas...</span>';

    const areas = areaData[prefferedOption.city];

    if (!Array.isArray(areas)) {
      submenu.innerHTML = '<p>No area data available for this city.</p>';
      return;
    }
    submenu.innerHTML = '';

    areas.forEach(el => {
      const a = document.createElement('a');
      a.className = 'area-item';

      if (el.count === 0) {
        a.classList.add('disabled');
        a.href = 'javascript:void(0)';
        a.style.pointerEvents = 'none';
      } else {
        a.href = `/escorts-from-${el.name}`;
      }

      a.innerText = `${el.name} (${el.count})`;
      submenu.appendChild(a);
    });
});
