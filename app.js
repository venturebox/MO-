// mObywatel 2.0 PWA Logic

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('Service Worker zarejestrowany:', reg.scope))
      .catch(err => console.error('Błąd rejestracji Service Workera:', err));
  });
}

// State
let currentTab = 'Dokumenty';
let cardsOrder = ['driving-license', 'id', 'vehicles']; // default stack matching the screenshot

// Card definitions & details
const CARDS_DATA = {
  'driving-license': {
    title: 'mPrawo jazdy',
    subtitle: 'Rzeczpospolita Polska',
    gradient: 'linear-gradient(135deg, #7c318f 0%, #9e2a82 45%, #b93766 85%, #cf3d5a 100%)',
    badge: 'PL',
    details: [
      { label: 'Numer prawa jazdy', value: '14523/21/0142' },
      { label: 'Kategorie', value: 'AM, B' },
      { label: 'Punkty karne', value: '0 pkt' },
      { label: 'Data wydania', value: '14.05.2021' },
      { label: 'Termin ważności', value: '14.05.2036' },
      { label: 'Organ wydający', value: 'Prezydent m. st. Warszawy' },
      { label: 'Status dokumentu', value: 'Aktywny' }
    ]
  },
  'id': {
    title: 'mDowód',
    subtitle: 'Dowód osobisty',
    gradient: 'linear-gradient(135deg, #0099f7 0%, #00b4db 60%, #0088cc 100%)',
    badge: 'ORZEŁ',
    details: [
      { label: 'Nazwisko', value: 'KOWALSKI' },
      { label: 'Imię (imiona)', value: 'JAN WOJCIECH' },
      { label: 'Obywatelstwo', value: 'POLSKIE' },
      { label: 'Numer PESEL', value: '92041508214' },
      { label: 'Data urodzenia', value: '15.04.1992' },
      { label: 'Seria i numer', value: 'CWY 849201' },
      { label: 'Termin ważności', value: '15.04.2032' },
      { label: 'Wydany przez', value: 'MINISTER CYFRYZACJI' }
    ]
  },
  'vehicles': {
    title: 'Moje pojazdy',
    subtitle: 'Dowód rejestracyjny',
    gradient: 'linear-gradient(135deg, #f59120 0%, #f7a928 45%, #f18218 80%, #eb6f10 100%)',
    badge: 'ORZEŁ',
    details: [
      { label: 'Pojazd 1', value: 'MERCEDES-BENZ B 200 (EBE7XC8)' },
      { label: 'Pojazd 2', value: 'NISSAN QASHQAI J12 (WZ705EH)' },
      { label: 'Polisa OC (Nissan)', value: 'Aktywna (Ważna)' },
      { label: 'Badanie techniczne (Nissan)', value: 'Aktywne (Ważne)' },
      { label: 'Organ rejestrujący', value: 'Starosta Warszawski Zachodni' }
    ]
  }
};

// DOM Elements
const cardsDeck = document.getElementById('cardsDeck');
const cardEls = {
  'driving-license': document.getElementById('cardDrivingLicense'),
  'id': document.getElementById('cardId'),
  'vehicles': document.getElementById('cardVehicles')
};

const toastMsg = document.getElementById('toastMsg');
const screenTitle = document.getElementById('screenTitle');

// Modal Elements
const modalDocDetail = document.getElementById('modalDocDetail');
const modalDocTitle = document.getElementById('modalDocTitle');
const modalDocCardContainer = document.getElementById('modalDocCardContainer');
const modalDocFieldsContainer = document.getElementById('modalDocFieldsContainer');
const closeDocDetailBtn = document.getElementById('closeDocDetailBtn');
const liveTimestamp = document.getElementById('liveTimestamp');

const modalAddDoc = document.getElementById('modalAddDoc');
const btnAddDoc = document.getElementById('btnAddDoc');
const closeAddDocBtn = document.getElementById('closeAddDocBtn');

const modalAssistant = document.getElementById('modalAssistant');
const btnAssistant = document.getElementById('btnAssistant');
const closeAssistantBtn = document.getElementById('closeAssistantBtn');

const modalNotifications = document.getElementById('modalNotifications');
const btnNotifications = document.getElementById('btnNotifications');
const closeNotificationsBtn = document.getElementById('closeNotificationsBtn');

const modalMail = document.getElementById('modalMail');
const btnMail = document.getElementById('btnMail');
const closeMailBtn = document.getElementById('closeMailBtn');

const btnManage = document.getElementById('btnManage');
const eagleBadgeBtn = document.getElementById('eagleBadgeBtn');

// Screen: Moje pojazdy elements
const screenVehiclesView = document.getElementById('screenVehiclesView');
const btnBackFromVehicles = document.getElementById('btnBackFromVehicles');
const btnTrashVehicle = document.getElementById('btnTrashVehicle');
const btnUpdateVehicleData = document.getElementById('btnUpdateVehicleData');
const linkReportError = document.getElementById('linkReportError');
const vehicleItemCard = document.getElementById('vehicleItemCard');
const vehicleItemCardNissan = document.getElementById('vehicleItemCardNissan');

// Screen: Szczegóły pojazdu elements
const screenVehicleDetailView = document.getElementById('screenVehicleDetailView');
const btnBackFromVehicleDetail = document.getElementById('btnBackFromVehicleDetail');
const vehicleDetailLiveTime = document.getElementById('vehicleDetailLiveTime');
const vehicleAlertBox = document.getElementById('vehicleAlertBox');
const vehicleAlertTitle = document.getElementById('vehicleAlertTitle');
const vehicleAlertDesc = document.getElementById('vehicleAlertDesc');
const btnCloseAlert = document.getElementById('btnCloseAlert');
const linkDownloadData = document.getElementById('linkDownloadData');
const detailVehicleName = document.getElementById('detailVehicleName');
const detailVehicleType = document.getElementById('detailVehicleType');
const detailVehicleAvatar = document.getElementById('detailVehicleAvatar');
const detailOcDot = document.getElementById('detailOcDot');
const detailOcValidity = document.getElementById('detailOcValidity');
const detailInspectionDot = document.getElementById('detailInspectionDot');
const detailInspectionValidity = document.getElementById('detailInspectionValidity');
const detailVinValue = document.getElementById('detailVinValue');
const detailPlateValue = document.getElementById('detailPlateValue');
const detailLastUpdate = document.getElementById('detailLastUpdate');

// Detailed Vehicle Data
const VEHICLES_DETAIL_DATA = {
  mercedes: {
    name: 'MERCEDES-BENZ B 200',
    type: 'Samochód osobowy',
    plate: 'EBE7XC8',
    vin: 'WDD2452081J083498',
    avatar: './icons/car-avatar.svg',
    oc: {
      status: 'ok',
      validity: 'Ważna do: 03.10.2027'
    },
    inspection: {
      status: 'err',
      validity: 'Nieważne od: 09.07.2023'
    },
    hasAlert: true,
    alertTitle: 'Badanie techniczne straciło ważność',
    alertDesc: 'Pobierz nowe dane badania technicznego pojazdu, jeśli zostało zrobione. Dane mogą pojawić się w systemie z kilkudniowym opóźnieniem.',
    accordions: {
      inspection: [
        { label: 'Data badania', value: '08.07.2022' },
        { label: 'Ważne do', value: '09.07.2023 (Nieważne)' },
        { label: 'Stan drogomierza', value: '158 320 km' },
        { label: 'Wynik badania', value: 'Pozytywny' },
        { label: 'Stacja kontroli', value: 'SKP EBE/004' }
      ],
      oc: [
        { label: 'Ubezpieczyciel', value: 'TUiR WARTA S.A.' },
        { label: 'Numer polisy', value: '9182304918' },
        { label: 'Okres ubezpieczenia', value: '04.10.2026 – 03.10.2027' },
        { label: 'Zakres ochrony', value: 'OC + Assistance' }
      ],
      temporaryPermit: [
        { label: 'Seria i numer', value: 'PC/EL 301948' },
        { label: 'Status dokumentu', value: 'Zastąpione dowodem stałym' }
      ],
      regCert: [
        { label: 'Seria i numer dowodu', value: 'DR/BAE 7481920' },
        { label: 'Organ wydający', value: 'Starosta Bełchatowski' },
        { label: 'Data wydania', value: '18.04.2019' }
      ],
      vehicleData: [
        { label: 'Marka pojazdu', value: 'MERCEDES-BENZ' },
        { label: 'Model pojazdu', value: 'B 200' },
        { label: 'Rok produkcji', value: '2019' },
        { label: 'Rodzaj paliwa', value: 'Benzyna' },
        { label: 'Pojemność silnika', value: '1332 cm³' },
        { label: 'Moc silnika', value: '120 kW (163 KM)' },
        { label: 'Masa całkowita (DMC)', value: '1960 kg' }
      ]
    }
  },
  nissan: {
    name: 'NISSAN QASHQAI J12',
    type: 'Samochód osobowy',
    plate: 'WZ705EH',
    vin: 'SJNTAAJ12U1025846',
    avatar: './icons/car-qashqai.svg',
    oc: {
      status: 'ok',
      validity: 'Ważna do: 22.09.2027'
    },
    inspection: {
      status: 'ok',
      validity: 'Ważne do: 18.06.2027'
    },
    hasAlert: false,
    accordions: {
      inspection: [
        { label: 'Data badania', value: '18.06.2024' },
        { label: 'Ważne do', value: '18.06.2027' },
        { label: 'Stan drogomierza', value: '18 420 km' },
        { label: 'Wynik badania', value: 'Pozytywny' },
        { label: 'Stacja kontroli', value: 'OSKP WZ/012' }
      ],
      oc: [
        { label: 'Ubezpieczyciel', value: 'PZU S.A.' },
        { label: 'Numer polisy', value: '1084920194' },
        { label: 'Okres ubezpieczenia', value: '23.09.2026 – 22.09.2027' },
        { label: 'Zakres ochrony', value: 'OC + AC + NNW + Assistance' }
      ],
      temporaryPermit: [
        { label: 'Seria i numer', value: 'PC/WA 102948' },
        { label: 'Status dokumentu', value: 'Zastąpione dowodem stałym' }
      ],
      regCert: [
        { label: 'Seria i numer dowodu', value: 'DR/BAG 9041284' },
        { label: 'Organ wydający', value: 'Starosta Warszawski Zachodni' },
        { label: 'Data wydania', value: '12.07.2023' }
      ],
      vehicleData: [
        { label: 'Marka pojazdu', value: 'NISSAN' },
        { label: 'Model pojazdu', value: 'QASHQAI' },
        { label: 'Wersja', value: 'J12 1.3 DIG-T MHEV' },
        { label: 'Rok produkcji', value: '2023' },
        { label: 'Rodzaj paliwa', value: 'Benzyna (MHEV)' },
        { label: 'Pojemność silnika', value: '1332 cm³' },
        { label: 'Moc silnika', value: '116 kW (158 KM)' },
        { label: 'Masa całkowita (DMC)', value: '1985 kg' }
      ]
    }
  }
};

// Bottom Nav tabs
const navTabs = {
  Dokumenty: { btn: document.getElementById('navDokumenty'), view: document.getElementById('tabContentDokumenty') },
  Uslugi: { btn: document.getElementById('navUslugi'), view: document.getElementById('tabContentUslugi') },
  KodQR: { btn: document.getElementById('navKodQR'), view: document.getElementById('tabContentKodQR') },
  Szukaj: { btn: document.getElementById('navSzukaj'), view: document.getElementById('tabContentSzukaj') },
  Wiecej: { btn: document.getElementById('navWiecej'), view: document.getElementById('tabContentWiecej') }
};

// Haptic feedback
function haptic() {
  if ('vibrate' in navigator) {
    navigator.vibrate(10);
  }
}

// Show Toast
let toastTimeout;
function showToast(message) {
  if (toastTimeout) clearTimeout(toastTimeout);
  toastMsg.textContent = message;
  toastMsg.classList.add('show');
  toastTimeout = setTimeout(() => {
    toastMsg.classList.remove('show');
  }, 2500);
}

// Update Stack Visual Layout
function updateCardsLayout() {
  cardsOrder.forEach((cardKey, index) => {
    const cardEl = cardEls[cardKey];
    if (!cardEl) return;

    // Top position & scale according to stack layer
    if (index === 0) {
      // Top layer in stack (furthest back)
      cardEl.style.top = '0px';
      cardEl.style.zIndex = '1';
      cardEl.style.transform = 'translateY(0px) scale(0.97)';
    } else if (index === 1) {
      // Middle layer in stack
      cardEl.style.top = '64px';
      cardEl.style.zIndex = '2';
      cardEl.style.transform = 'translateY(0px) scale(0.985)';
    } else if (index === 2) {
      // Front active layer (fully visible)
      cardEl.style.top = '128px';
      cardEl.style.zIndex = '3';
      cardEl.style.transform = 'translateY(0px) scale(1)';
    }
  });
}

// Open / Close Moje pojazdy detailed screen
function openVehiclesScreen() {
  haptic();
  if (screenVehiclesView) {
    screenVehiclesView.classList.add('active');
  }
}

function closeVehiclesScreen() {
  haptic();
  if (screenVehiclesView) {
    screenVehiclesView.classList.remove('active');
  }
}

// Open / Close Szczegóły pojazdu detailed screen
function openVehicleDetailScreen(vehicleKey) {
  haptic();
  const v = VEHICLES_DETAIL_DATA[vehicleKey];
  if (!v) return;

  if (detailVehicleName) detailVehicleName.textContent = v.name;
  if (detailVehicleType) detailVehicleType.textContent = v.type;
  if (detailVehicleAvatar) {
    detailVehicleAvatar.src = v.avatar;
    detailVehicleAvatar.alt = v.name;
  }

  // OC Status
  if (detailOcDot) {
    if (v.oc.status === 'ok') {
      detailOcDot.className = 'status-badge-dot status-ok';
      detailOcDot.innerHTML = '<svg viewBox="0 0 24 24"><path d="M20 6L9 17L4 12"/></svg>';
    } else {
      detailOcDot.className = 'status-badge-dot status-err';
      detailOcDot.innerHTML = '<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    }
  }
  if (detailOcValidity) detailOcValidity.textContent = v.oc.validity;

  // Technical Inspection Status
  if (detailInspectionDot) {
    if (v.inspection.status === 'ok') {
      detailInspectionDot.className = 'status-badge-dot status-ok';
      detailInspectionDot.innerHTML = '<svg viewBox="0 0 24 24"><path d="M20 6L9 17L4 12"/></svg>';
    } else {
      detailInspectionDot.className = 'status-badge-dot status-err';
      detailInspectionDot.innerHTML = '<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    }
  }
  if (detailInspectionValidity) detailInspectionValidity.textContent = v.inspection.validity;

  // VIN & Plate Values
  if (detailVinValue) detailVinValue.textContent = v.vin;
  if (detailPlateValue) detailPlateValue.textContent = v.plate;

  // Alert Box (only shown if expired / needed, e.g. for Mercedes)
  if (vehicleAlertBox) {
    if (v.hasAlert) {
      vehicleAlertBox.style.display = 'flex';
      if (vehicleAlertTitle) vehicleAlertTitle.textContent = v.alertTitle;
      if (vehicleAlertDesc) vehicleAlertDesc.textContent = v.alertDesc;
    } else {
      vehicleAlertBox.style.display = 'none';
    }
  }

  // Populate Accordion Sections
  if (v.accordions) {
    renderAccordionContent('accContentInspection', v.accordions.inspection);
    renderAccordionContent('accContentOc', v.accordions.oc);
    renderAccordionContent('accContentTemporaryPermit', v.accordions.temporaryPermit);
    renderAccordionContent('accContentRegCert', v.accordions.regCert);
    renderAccordionContent('accContentVehicleData', v.accordions.vehicleData);
  }

  // Reset any open accordion items
  document.querySelectorAll('.accordion-item.open').forEach(item => {
    item.classList.remove('open');
  });

  // Last update date in row
  const vehicleDetailLastUpdate = document.getElementById('vehicleDetailLastUpdate');
  if (vehicleDetailLastUpdate) {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    vehicleDetailLastUpdate.textContent = `${day}.${month}.${year}`;
  }

  if (screenVehicleDetailView) {
    screenVehicleDetailView.classList.add('active');
  }
}

function renderAccordionContent(containerId, rows) {
  const container = document.getElementById(containerId);
  if (!container || !rows) return;
  container.innerHTML = rows.map(r => `
    <div class="acc-row">
      <span class="acc-label">${r.label}</span>
      <span class="acc-val">${r.value}</span>
    </div>
  `).join('');
}

function closeVehicleDetailScreen() {
  haptic();
  if (screenVehicleDetailView) {
    screenVehicleDetailView.classList.remove('active');
  }
}

// Card Click Handler
function setupCardsInteraction() {
  Object.keys(cardEls).forEach(key => {
    const el = cardEls[key];
    el.addEventListener('click', () => {
      haptic();
      const currentPos = cardsOrder.indexOf(key);

      // If it's already the front card (index 2), open details or subpage
      if (currentPos === 2) {
        if (key === 'vehicles') {
          openVehiclesScreen();
        } else {
          openDocumentDetail(key);
        }
      } else {
        // Bring clicked card to front
        cardsOrder.splice(currentPos, 1);
        cardsOrder.push(key);
        updateCardsLayout();
        showToast(`Wybrano: ${CARDS_DATA[key].title}`);
      }
    });
  });
}

// Open Document Detail Modal
function openDocumentDetail(key) {
  if (key === 'vehicles') {
    openVehiclesScreen();
    return;
  }

  const data = CARDS_DATA[key];
  if (!data) return;

  modalDocTitle.textContent = data.title;

  // Render stylized card preview inside modal
  modalDocCardContainer.innerHTML = `
    <div class="doc-detail-card" style="background: ${data.gradient};">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
        <div>
          <div style="font-size: 22px; font-weight: 800; color: #fff;">${data.title}</div>
          <div style="font-size: 13px; color: rgba(255,255,255,0.85);">${data.subtitle}</div>
        </div>
        <div class="hologram-seal" title="Certyfikowany hologram państwowy">
          <svg viewBox="0 0 24 24">
            <path d="M12 2L13.1 4.5L15.5 3.8L15 6.2L17.5 6.5L16 8.5L18.5 9.5L16.2 11L18 13L15 13.5L15.8 16L13.2 15.2L12 18L10.8 15.2L8.2 16L9 13.5L6 13L7.8 11L5.5 9.5L8 8.5L6.5 6.5L9 6.2L8.5 3.8L10.9 4.5L12 2Z" />
          </svg>
        </div>
      </div>
      <div style="font-size: 11px; opacity: 0.9; letter-spacing: 1px; margin-top: 15px;">
        STATUS: CERTYFIKAT WAŻNY DO 2030
      </div>
    </div>
  `;

  // Render detail rows
  modalDocFieldsContainer.innerHTML = data.details.map(d => `
    <div class="doc-info-row">
      <span class="doc-info-label">${d.label}</span>
      <span class="doc-info-val">${d.value}</span>
    </div>
  `).join('') + `
    <div style="margin-top: 20px; display: flex; gap: 10px;">
      <button class="btn-add-doc" style="flex: 1; justify-content: center;" onclick="showToast('Przekazano dane do weryfikacji')">Potwierdź tożsamość</button>
      <button class="btn-manage" style="border: 1px solid rgba(255,255,255,0.2); border-radius: 18px; padding: 12px 18px; color: #fff;" onclick="closeModal(modalDocDetail)">Zamknij</button>
    </div>
  `;

  openModal(modalDocDetail);
}

// Live Time Authenticity Clock
function startLiveClock() {
  function updateClock() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    if (liveTimestamp) {
      liveTimestamp.textContent = `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
    }
    if (vehicleDetailLiveTime) {
      vehicleDetailLiveTime.textContent = `Czas: ${hours}:${minutes}:${seconds} ${day}.${month}.${year}`;
    }
  }
  updateClock();
  setInterval(updateClock, 1000);
}

// Modal management
function openModal(modalEl) {
  haptic();
  modalEl.classList.add('active');
}

function closeModal(modalEl) {
  haptic();
  modalEl.classList.remove('active');
}

// Close modals when clicking outside bottom-sheet
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeModal(overlay);
    }
  });
});

closeDocDetailBtn.addEventListener('click', () => closeModal(modalDocDetail));
closeAddDocBtn.addEventListener('click', () => closeModal(modalAddDoc));
closeAssistantBtn.addEventListener('click', () => closeModal(modalAssistant));
closeNotificationsBtn.addEventListener('click', () => closeModal(modalNotifications));
closeMailBtn.addEventListener('click', () => closeModal(modalMail));

btnAddDoc.addEventListener('click', () => openModal(modalAddDoc));
btnAssistant.addEventListener('click', () => openModal(modalAssistant));
btnNotifications.addEventListener('click', () => openModal(modalNotifications));
btnMail.addEventListener('click', () => openModal(modalMail));

eagleBadgeBtn.addEventListener('click', () => {
  haptic();
  showToast('mObywatel 2.0 • Oficjalna wersja PWA');
});

// Moje pojazdy Subpage Listeners
if (btnBackFromVehicles) {
  btnBackFromVehicles.addEventListener('click', closeVehiclesScreen);
}

if (btnTrashVehicle) {
  btnTrashVehicle.addEventListener('click', () => {
    haptic();
    showToast('Opcja usunięcia pojazdu z portfela');
  });
}

if (linkReportError) {
  linkReportError.addEventListener('click', (e) => {
    e.preventDefault();
    haptic();
    showToast('Otwarto zgłoszenie rozbieżności CEPiK');
  });
}

if (btnUpdateVehicleData) {
  btnUpdateVehicleData.addEventListener('click', () => {
    haptic();
    const originalText = btnUpdateVehicleData.textContent;
    btnUpdateVehicleData.textContent = 'Trwa pobieranie z CEPiK...';
    btnUpdateVehicleData.style.opacity = '0.75';
    setTimeout(() => {
      btnUpdateVehicleData.textContent = originalText;
      btnUpdateVehicleData.style.opacity = '1';
      showToast('Dane pojazdu zostały pomyślnie zaktualizowane!');
    }, 700);
  });
}

if (vehicleItemCard) {
  vehicleItemCard.addEventListener('click', () => {
    openVehicleDetailScreen('mercedes');
  });
}

if (vehicleItemCardNissan) {
  vehicleItemCardNissan.addEventListener('click', () => {
    openVehicleDetailScreen('nissan');
  });
}

// Szczegóły pojazdu Subpage Listeners
if (btnBackFromVehicleDetail) {
  btnBackFromVehicleDetail.addEventListener('click', closeVehicleDetailScreen);
}

if (btnCloseAlert) {
  btnCloseAlert.addEventListener('click', () => {
    haptic();
    if (vehicleAlertBox) vehicleAlertBox.style.display = 'none';
  });
}

if (linkDownloadData) {
  linkDownloadData.addEventListener('click', (e) => {
    e.preventDefault();
    haptic();
    showToast('Pobieranie najnowszych danych z CEPiK...');
  });
}

// Refresh Pill Button Handler (Aktualizuj)
const btnRefreshVehicleDetail = document.getElementById('btnRefreshVehicleDetail');
if (btnRefreshVehicleDetail) {
  btnRefreshVehicleDetail.addEventListener('click', () => {
    haptic();
    const orig = btnRefreshVehicleDetail.textContent;
    btnRefreshVehicleDetail.textContent = 'Pobieranie...';
    btnRefreshVehicleDetail.style.opacity = '0.75';
    setTimeout(() => {
      btnRefreshVehicleDetail.textContent = orig;
      btnRefreshVehicleDetail.style.opacity = '1';
      const now = new Date();
      const d = String(now.getDate()).padStart(2, '0');
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const y = now.getFullYear();
      const el = document.getElementById('vehicleDetailLastUpdate');
      if (el) el.textContent = `${d}.${m}.${y}`;
      showToast('Zaktualizowano dane pojazdu z CEPiK!');
    }, 600);
  });
}

// Accordion Toggle Handlers
document.querySelectorAll('.accordion-header').forEach(header => {
  header.addEventListener('click', () => {
    haptic();
    const item = header.closest('.accordion-item');
    if (item) {
      item.classList.toggle('open');
    }
  });
});

// Copy to Clipboard buttons in vehicle details
document.querySelectorAll('.btn-copy-field').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    haptic();
    const targetId = btn.getAttribute('data-copy-target');
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      const text = targetEl.textContent.trim();
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).catch(() => {});
      }
      showToast(`Skopiowano: ${text}`);
    }
  });
});

// Quick Action Items (Historia pojazdu, mStłuczka, Punkty karne, Mandaty)
document.querySelectorAll('.quick-action-item').forEach(item => {
  item.addEventListener('click', () => {
    haptic();
    const action = item.getAttribute('data-action');
    showToast(`Usługa: ${action}`);
  });
});

// Android Soft Navigation Bar listeners
const androidSoftBackBtn = document.getElementById('androidSoftBackBtn');
const androidSoftHomeBtn = document.getElementById('androidSoftHomeBtn');

if (androidSoftBackBtn) {
  androidSoftBackBtn.addEventListener('click', () => {
    haptic();
    if (screenVehicleDetailView && screenVehicleDetailView.classList.contains('active')) {
      closeVehicleDetailScreen();
      return;
    }
    if (screenVehiclesView && screenVehiclesView.classList.contains('active')) {
      closeVehiclesScreen();
      return;
    }
    // Close any open modal
    const openModals = document.querySelectorAll('.modal-overlay.active');
    if (openModals.length > 0) {
      openModals.forEach(m => closeModal(m));
      return;
    }
    showToast('Cofnij');
  });
}

if (androidSoftHomeBtn) {
  androidSoftHomeBtn.addEventListener('click', () => {
    haptic();
    if (screenVehicleDetailView) screenVehicleDetailView.classList.remove('active');
    if (screenVehiclesView) screenVehiclesView.classList.remove('active');
    document.querySelectorAll('.modal-overlay.active').forEach(m => closeModal(m));
    switchTab('Dokumenty');
  });
}

// "Zarządzaj" Button
btnManage.addEventListener('click', () => {
  haptic();
  // Reverse order or shift cards
  cardsOrder.unshift(cardsOrder.pop());
  updateCardsLayout();
  showToast('Zmieniono kolejność kart');
});

// Add document items
document.querySelectorAll('[data-add]').forEach(item => {
  item.addEventListener('click', () => {
    haptic();
    const name = item.querySelector('.doc-selection-name').textContent;
    closeModal(modalAddDoc);
    showToast(`Dodano pomyślnie: ${name}`);
  });
});

// Chatbot functionality
const chatInput = document.getElementById('chatInput');
const chatSendBtn = document.getElementById('chatSendBtn');
const chatBody = document.getElementById('chatBody');

function sendChatMessage() {
  const text = chatInput.value.trim();
  if (!text) return;
  haptic();

  // User bubble
  const userBubble = document.createElement('div');
  userBubble.className = 'chat-bubble chat-user';
  userBubble.textContent = text;
  chatBody.appendChild(userBubble);
  chatInput.value = '';
  chatBody.scrollTop = chatBody.scrollHeight;

  // Bot response simulation
  setTimeout(() => {
    const botBubble = document.createElement('div');
    botBubble.className = 'chat-bubble chat-bot';
    
    const lower = text.toLowerCase();
    if (lower.includes('dowód') || lower.includes('pesel')) {
      botBubble.textContent = 'Twój mDowód jest w pełni ważny. Możesz go używać w urzędach, bankach i na terenie całego kraju.';
    } else if (lower.includes('prawo jazdy') || lower.includes('punkty')) {
      botBubble.textContent = 'Posiadasz ważne mPrawo jazdy kategorii B. Liczba punktów karnych wynosi 0.';
    } else if (lower.includes('pojazd') || lower.includes('auto') || lower.includes('oc')) {
      botBubble.textContent = 'Twój pojazd posiada ważne badanie techniczne oraz aktualną polisę OC.';
    } else {
      botBubble.textContent = 'Rozumiem Twoje pytanie dotyczące ' + text + '. W portalu mObywatel 2.0 wszystkie formalności załatwisz online!';
    }

    chatBody.appendChild(botBubble);
    chatBody.scrollTop = chatBody.scrollHeight;
  }, 600);
}

chatSendBtn.addEventListener('click', sendChatMessage);
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendChatMessage();
});

// Bottom Navigation Switching
Object.keys(navTabs).forEach(tabKey => {
  const { btn, view } = navTabs[tabKey];
  if (!btn) return;

  btn.addEventListener('click', () => {
    haptic();
    if (currentTab === tabKey) return;

    // Remove active class from all
    Object.keys(navTabs).forEach(k => {
      navTabs[k].btn.classList.remove('active');
      if (navTabs[k].view) navTabs[k].view.style.display = 'none';
    });

    btn.classList.add('active');
    if (view) view.style.display = 'flex';
    currentTab = tabKey;

    const titles = {
      Dokumenty: 'Dokumenty',
      Uslugi: 'Usługi',
      KodQR: 'Kod QR',
      Szukaj: 'Szukaj',
      Wiecej: 'Więcej'
    };
    screenTitle.textContent = titles[tabKey] || tabKey;
  });
});

// Initial initialization
document.addEventListener('DOMContentLoaded', () => {
  updateCardsLayout();
  setupCardsInteraction();
  startLiveClock();
});
