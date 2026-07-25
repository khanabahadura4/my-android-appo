/* ==========================================================================
   Android Debt & Credit Ledger Core Engine (দেনা-পাওনার খাতা)
   ========================================================================== */

// --- Initial App State & Database Configuration ---
const STORAGE_KEY = 'dhar_hisab_app_db_v1';
const SETTINGS_KEY = 'dhar_hisab_app_settings_v1';

let appState = {
  transactions: [],
  contacts: [], // { name, phone, createdAt }
  currentTab: 'home',
  currentFilter: 'all',
  activePersonLedger: null,
  pinCode: '',
  enteredPin: ''
};

let appSettings = {
  currency: '৳',
  lang: 'bn', // 'bn' or 'en'
  theme: 'dark',
  pinEnabled: false,
  pin: '1234'
};

// --- Dictionary for Bilingual Support (বাংলা ও English) ---
const i18n = {
  bn: {
    app_title: "দেনা-পাওনার খাতা",
    tag_receivable: "আমি পাবো",
    tag_payable: "দিতে হবে",
    label_net_balance: "সর্বমোট নিট ব্যালেন্স",
    overdue_sub: "দ্রুত তাগাদা দিন অথবা তারিখ আপডেট করুন।",
    search_placeholder: "মানুষের নাম বা নোট খুঁজুন...",
    filter_all: "সব",
    filter_give: "পাবো",
    filter_take: "দেনা",
    filter_pending: "বাকি",
    recent_activity: "সাম্প্রতিক লেনদেন",
    btn_add: "+ নতুন",
    contacts_title: "মানুষের খাতা (Person Ledger)",
    add_person: "নতুন নাম",
    reports_title: "হিসাব-নিকাশ ও সামারি",
    chart_summary: "দেনা ও পাওনার অনুপাত",
    category_breakdown: "ক্যাটাগরি ভিত্তিক লেনদেন",
    top_borrowers: "কাদের কাছে সবচেয়ে বেশি পাওনা",
    settings_title: "অ্যাপ সেটিংস ও ব্যাকআপ",
    setting_currency: "মুদ্রা চিহ্ন (Currency)",
    setting_currency_sub: "টাকা, ডলার বা রুপি নির্বাচন করুন",
    setting_pin: "পিন পাসকোড নিরাপত্তা",
    setting_pin_sub: "অ্যাপ খুলতে পিন কোড সেট করুন",
    setting_lang: "ভাষা (Language)",
    setting_lang_sub: "বাংলা / English",
    setting_export: "ব্যাকআপ নামান (Export JSON)",
    setting_export_sub: "সকল লেনদেনের ব্যাকআপ ফাইল সংরক্ষণ করুন",
    setting_import: "ব্যাকআপ রিস্টোর (Import JSON)",
    setting_import_sub: "সংরক্ষিত ব্যাকআপ ফাইল থেকে ডাটা ফিরিয়ে আনুন",
    setting_demo: "ডেমো ডাটা লোড করুন",
    setting_demo_sub: "পরীক্ষা করার জন্য নমুনা তথ্য যোগ করুন",
    setting_clear: "সব ডাটা মুছে ফেলুন",
    setting_clear_sub: "মেমোরি সম্পূর্ণ খালি করুন",
    nav_home: "হোম",
    nav_contacts: "খাতা",
    nav_reports: "রিপোর্ট",
    nav_settings: "সেটিংস",
    modal_new_tx: "নতুন লেনদেন যোগ করুন",
    type_dilam: "আমি দিয়েছি (পাবো)",
    type_nilam: "আমি নিয়েছি (দেনা)",
    form_person: "ব্যক্তির নাম *",
    form_amount: "টাকার পরিমাণ *",
    form_date: "লেনদেনের তারিখ",
    form_due: "ফেরতের মেয়াদ (ঐচ্ছিক)",
    form_category: "ক্যাটাগরি",
    form_phone: "ফোন নম্বর (ঐচ্ছিক)",
    form_note: "নোট / বিবরণ",
    btn_cancel: "বাতিল",
    btn_save: "সংরক্ষণ করুন",
    person_net_status: "বর্তমান হিসাব অবস্থা",
    btn_settle: "হিসাব মেটান",
    person_history: "লেনদেনের ইতিহাস",
    empty_tx: "কোনো লেনদেন পাওয়া যায়নি!",
    settled_msg: "সকল দেনা-পাওনা পরিশোধিত",
    whatsapp_msg_template: "প্রিয় %NAME%, আপনার সাথে দেনা-পাওনার হিসাব অনুযায়ী আমার %AMOUNT% টাকা পাওনা রয়েছে। অনুগ্রহ করে তা পরিশোধ করুন। ধন্যবাদ!"
  },
  en: {
    app_title: "Debt & Credit Ledger",
    tag_receivable: "I Will Get",
    tag_payable: "I Owe",
    label_net_balance: "Overall Net Balance",
    overdue_sub: "Send reminder or update due date.",
    search_placeholder: "Search by person or note...",
    filter_all: "All",
    filter_give: "Receivable",
    filter_take: "Payable",
    filter_pending: "Unpaid",
    recent_activity: "Recent Activity",
    btn_add: "+ New",
    contacts_title: "Person Ledgers",
    add_person: "Add Person",
    reports_title: "Reports & Analytics",
    chart_summary: "Debt vs Credit Ratio",
    category_breakdown: "Category Breakdown",
    top_borrowers: "Top Receivables",
    settings_title: "Settings & Data",
    setting_currency: "Currency Symbol",
    setting_currency_sub: "Select ৳, $, ₹, etc.",
    setting_pin: "PIN Passcode Protection",
    setting_pin_sub: "Lock app with 4-digit PIN",
    setting_lang: "App Language",
    setting_lang_sub: "Bengali / English",
    setting_export: "Export Backup (JSON)",
    setting_export_sub: "Save full database to file",
    setting_import: "Restore Backup (JSON)",
    setting_import_sub: "Restore database from JSON file",
    setting_demo: "Load Demo Data",
    setting_demo_sub: "Add sample transactions for testing",
    setting_clear: "Clear All Data",
    setting_clear_sub: "Completely reset memory",
    nav_home: "Home",
    nav_contacts: "Ledger",
    nav_reports: "Reports",
    nav_settings: "Settings",
    modal_new_tx: "New Transaction",
    type_dilam: "I Gave / Lent",
    type_nilam: "I Took / Borrowed",
    form_person: "Person Name *",
    form_amount: "Amount *",
    form_date: "Transaction Date",
    form_due: "Due Date (Optional)",
    form_category: "Category",
    form_phone: "Phone Number (Optional)",
    form_note: "Note / Description",
    btn_cancel: "Cancel",
    btn_save: "Save Entry",
    person_net_status: "Current Account Balance",
    btn_settle: "Settle Up",
    person_history: "Transaction History",
    empty_tx: "No transactions found!",
    settled_msg: "All balances fully settled",
    whatsapp_msg_template: "Hi %NAME%, according to our ledger, a balance of %AMOUNT% is payable to me. Kindly settle it when possible. Thanks!"
  }
};

// --- App Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  // Register Offline Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => console.log("SW reg failed", err));
  }

  loadDataFromStorage();
  updateCurrentDateDisplay();
  applySettingsUI();
  renderAllViews();

  // Set default dates in form
  const todayStr = new Date().toISOString().split('T')[0];
  document.getElementById('tx-date').value = todayStr;

  // Search Listeners
  document.getElementById('home-search-input').addEventListener('input', (e) => {
    renderTransactions(e.target.value.toLowerCase());
  });

  // PIN security check on startup
  if (appSettings.pinEnabled) {
    showPinLockScreen();
  }
});

// --- Date Header ---
function updateCurrentDateDisplay() {
  const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' };
  const langLocale = appSettings.lang === 'bn' ? 'bn-BD' : 'en-US';
  const now = new Date();
  document.getElementById('current-date-str').textContent = now.toLocaleDateString(langLocale, options);
}

// --- Data Persistence ---
function loadDataFromStorage() {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (rawData) {
      const parsed = JSON.parse(rawData);
      appState.transactions = parsed.transactions || [];
      appState.contacts = parsed.contacts || [];
    } else {
      // Auto-load rich demo data first time for instant wow effect
      loadDemoData(true);
    }

    const rawSettings = localStorage.getItem(SETTINGS_KEY);
    if (rawSettings) {
      appSettings = { ...appSettings, ...JSON.parse(rawSettings) };
    }
  } catch (err) {
    console.error("Storage error:", err);
  }
}

function saveDataToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    transactions: appState.transactions,
    contacts: appState.contacts
  }));
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(appSettings));
}

// --- Demo Data Generator ---
function loadDemoData(isFirstTime = false) {
  appState.contacts = [
    { name: "রহিম আহমেদ", phone: "01712345678", createdAt: "2026-07-01" },
    { name: "করিম সাহেব", phone: "01898765432", createdAt: "2026-07-05" },
    { name: "সাকিব হোসেন", phone: "01911223344", createdAt: "2026-07-10" }
  ];

  const today = new Date();
  const pastDate = (days) => new Date(today.getTime() - (days * 86400000)).toISOString().split('T')[0];
  const futureDate = (days) => new Date(today.getTime() + (days * 86400000)).toISOString().split('T')[0];

  appState.transactions = [
    {
      id: 'tx-101',
      personName: "রহিম আহমেদ",
      phone: "01712345678",
      type: "give", // I gave (Receivable)
      amount: 1500,
      date: pastDate(5),
      dueDate: futureDate(3),
      category: "Personal",
      note: "জরুরি চা-নাস্তা ও যাতায়াত খরচ",
      status: "pending", // pending / settled
      createdAt: new Date().toISOString()
    },
    {
      id: 'tx-102',
      personName: "করিম সাহেব",
      phone: "01898765432",
      type: "take", // I took (Payable)
      amount: 500,
      date: pastDate(12),
      dueDate: pastDate(2), // Overdue!
      category: "Shopping",
      note: "বাজারের জন্য ধার নেওয়া হয়েছিল",
      status: "pending",
      createdAt: new Date().toISOString()
    },
    {
      id: 'tx-103',
      personName: "সাকিব হোসেন",
      phone: "01911223344",
      type: "give",
      amount: 3000,
      date: pastDate(20),
      dueDate: "",
      category: "Business",
      note: "প্রজেক্টের এডভান্স পেমেন্ট",
      status: "settled",
      createdAt: new Date().toISOString()
    }
  ];

  saveDataToStorage();
  renderAllViews();
  if (!isFirstTime) {
    showToast("ডেমো ডাটা সফলভাবে যোগ করা হয়েছে!");
  }
}

// --- Main Render Logic ---
function renderAllViews() {
  renderSummaryCards();
  renderTransactions();
  renderContacts();
  renderReports();
  populateContactsDatalist();
  updateI18nLabels();
}

// --- Summary Calculations ---
function renderSummaryCards() {
  let totalReceivable = 0; // I gave / Dilam
  let totalPayable = 0;    // I took / Nilam
  let givePeople = new Set();
  let takePeople = new Set();
  let overdueCount = 0;

  const todayStr = new Date().toISOString().split('T')[0];

  appState.transactions.forEach(tx => {
    if (tx.status === 'pending') {
      if (tx.type === 'give') {
        totalReceivable += Number(tx.amount);
        givePeople.add(tx.personName);
      } else if (tx.type === 'take') {
        totalPayable += Number(tx.amount);
        takePeople.add(tx.personName);
      }

      if (tx.dueDate && tx.dueDate < todayStr) {
        overdueCount++;
      }
    }
  });

  const netBalance = totalReceivable - totalPayable;
  const curr = appSettings.currency;

  document.getElementById('total-receivable').textContent = `${curr} ${totalReceivable.toLocaleString()}`;
  document.getElementById('total-payable').textContent = `${curr} ${totalPayable.toLocaleString()}`;
  document.getElementById('net-balance').textContent = `${curr} ${Math.abs(netBalance).toLocaleString()}`;
  
  // People Counts
  document.getElementById('receivable-count').textContent = `${givePeople.size} জন ব্যক্তির কাছে`;
  document.getElementById('payable-count').textContent = `${takePeople.size} জন ব্যক্তির কাছে`;

  // Net Status Badge
  const netBadge = document.getElementById('net-status-badge');
  if (netBalance > 0) {
    netBadge.className = 'net-status-badge text-give';
    netBadge.innerHTML = `<i class="fa-solid fa-circle-arrow-up"></i> আপনি পাবো`;
  } else if (netBalance < 0) {
    netBadge.className = 'net-status-badge text-danger';
    netBadge.innerHTML = `<i class="fa-solid fa-circle-arrow-down"></i> আপনি দেনা`;
  } else {
    netBadge.className = 'net-status-badge';
    netBadge.innerHTML = `<i class="fa-solid fa-scale-balanced"></i> সমতা`;
  }

  // Overdue Banner
  const overdueBanner = document.getElementById('overdue-banner');
  if (overdueCount > 0) {
    overdueBanner.classList.remove('hidden');
    document.getElementById('overdue-count-text').textContent = `${overdueCount}টি পাওনার মেয়াদ শেষ হয়েছে!`;
  } else {
    overdueBanner.classList.add('hidden');
  }
}

// --- Transactions List Renderer ---
function renderTransactions(searchQuery = '') {
  const container = document.getElementById('transaction-list');
  container.innerHTML = '';

  let filtered = appState.transactions.filter(tx => {
    // Filter Chip
    if (appState.currentFilter === 'give' && tx.type !== 'give') return false;
    if (appState.currentFilter === 'take' && tx.type !== 'take') return false;
    if (appState.currentFilter === 'pending' && tx.status !== 'pending') return false;

    // Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchPerson = tx.personName.toLowerCase().includes(q);
      const matchNote = tx.note && tx.note.toLowerCase().includes(q);
      return matchPerson || matchNote;
    }
    return true;
  });

  // Sort by date descending
  filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 30px; color: var(--text-muted);">
        <i class="fa-solid fa-receipt" style="font-size: 36px; margin-bottom: 10px; opacity: 0.5;"></i>
        <p>${i18n[appSettings.lang].empty_tx}</p>
      </div>
    `;
    return;
  }

  const curr = appSettings.currency;

  filtered.forEach(tx => {
    const isGive = tx.type === 'give';
    const isSettled = tx.status === 'settled';
    const firstLetter = tx.personName ? tx.personName.charAt(0) : '?';

    const card = document.createElement('div');
    card.className = `tx-card ${isSettled ? 'settled-card' : ''}`;
    card.onclick = () => openPersonLedgerModal(tx.personName);

    card.innerHTML = `
      <div class="tx-left">
        <div class="avatar-circle" style="background: ${isGive ? 'linear-gradient(135deg, #059669, #10b981)' : 'linear-gradient(135deg, #dc2626, #ef4444)'}">
          ${firstLetter}
        </div>
        <div class="tx-info">
          <span class="tx-person">${tx.personName}</span>
          <div class="tx-meta">
            <span>${tx.date}</span>
            <span class="tx-category-tag">${tx.category}</span>
          </div>
        </div>
      </div>
      <div class="tx-right">
        <div class="tx-amount-val ${isSettled ? 'tx-amount-settled' : (isGive ? 'tx-amount-give' : 'tx-amount-take')}">
          ${isGive ? '+' : '-'}${curr} ${Number(tx.amount).toLocaleString()}
        </div>
        <span class="tx-status-badge ${isSettled ? 'badge-settled' : (isGive ? 'badge-give' : 'badge-take')}">
          ${isSettled ? 'পরিশোধিত' : (isGive ? 'আমি পাবো' : 'দিতে হবে')}
        </span>
      </div>
    `;
    container.appendChild(card);
  });
}

// --- Person Ledger & Contacts Tab ---
function renderContacts() {
  const container = document.getElementById('contacts-list');
  const searchInput = document.getElementById('contact-search-input').value.toLowerCase();
  container.innerHTML = '';

  // Aggregate contact balances from transactions
  const personMap = {};

  appState.transactions.forEach(tx => {
    if (!personMap[tx.personName]) {
      personMap[tx.personName] = {
        name: tx.personName,
        phone: tx.phone || '',
        giveTotal: 0,
        takeTotal: 0,
        count: 0
      };
    }
    if (tx.status === 'pending') {
      if (tx.type === 'give') personMap[tx.personName].giveTotal += Number(tx.amount);
      if (tx.type === 'take') personMap[tx.personName].takeTotal += Number(tx.amount);
    }
    personMap[tx.personName].count++;
  });

  const peopleList = Object.values(personMap).filter(p => p.name.toLowerCase().includes(searchInput));
  const curr = appSettings.currency;

  if (peopleList.length === 0) {
    container.innerHTML = `<p class="text-muted-sm" style="text-align: center; padding: 20px;">খাতায় কোন নাম পাওয়া যায়নি</p>`;
    return;
  }

  peopleList.forEach(p => {
    const net = p.giveTotal - p.takeTotal;
    const card = document.createElement('div');
    card.className = 'contact-card';
    card.onclick = () => openPersonLedgerModal(p.name);

    let netHtml = '';
    if (net > 0) {
      netHtml = `<span class="tx-amount-give" style="font-weight:700;">পাবো ${curr} ${net.toLocaleString()}</span>`;
    } else if (net < 0) {
      netHtml = `<span class="tx-amount-take" style="font-weight:700;">দেনা ${curr} ${Math.abs(net).toLocaleString()}</span>`;
    } else {
      netHtml = `<span style="color:var(--text-muted); font-size:12px;">হিসাব পরিশোধিত</span>`;
    }

    card.innerHTML = `
      <div class="tx-left">
        <div class="avatar-circle-lg">${p.name.charAt(0)}</div>
        <div>
          <strong style="font-size:15px; display:block;">${p.name}</strong>
          <small class="text-muted-sm"><i class="fa-solid fa-phone"></i> ${p.phone || 'নম্বর নেই'} • ${p.count}টি লেনদেন</small>
        </div>
      </div>
      <div>${netHtml}</div>
    `;
    container.appendChild(card);
  });
}

function populateContactsDatalist() {
  const datalist = document.getElementById('contacts-datalist');
  datalist.innerHTML = '';
  const names = new Set(appState.transactions.map(t => t.personName));
  names.forEach(name => {
    const opt = document.createElement('option');
    opt.value = name;
    datalist.appendChild(opt);
  });
}

// --- Person Ledger Modal ---
function openPersonLedgerModal(personName) {
  appState.activePersonLedger = personName;
  const modal = document.getElementById('person-ledger-modal');
  modal.classList.remove('hidden');

  document.getElementById('ledger-person-name').textContent = personName;
  document.getElementById('ledger-avatar').textContent = personName.charAt(0);

  // Find person transactions
  const txs = appState.transactions.filter(t => t.personName === personName);
  const phone = txs.find(t => t.phone)?.phone || '';
  document.getElementById('ledger-person-phone').textContent = phone ? `📱 ${phone}` : 'ফোন নম্বর যোগ করা নেই';

  // Calculate Net
  let giveSum = 0, takeSum = 0;
  txs.forEach(t => {
    if (t.status === 'pending') {
      if (t.type === 'give') giveSum += Number(t.amount);
      if (t.type === 'take') takeSum += Number(t.amount);
    }
  });

  const net = giveSum - takeSum;
  const curr = appSettings.currency;
  const netEl = document.getElementById('ledger-net-amount');

  if (net > 0) {
    netEl.className = 'text-give';
    netEl.textContent = `আমি পাবো ${curr} ${net.toLocaleString()}`;
  } else if (net < 0) {
    netEl.className = 'text-danger';
    netEl.textContent = `আমি দেনা ${curr} ${Math.abs(net).toLocaleString()}`;
  } else {
    netEl.className = '';
    netEl.textContent = i18n[appSettings.lang].settled_msg;
  }

  // Render individual history
  const historyContainer = document.getElementById('person-tx-history');
  historyContainer.innerHTML = '';

  txs.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(tx => {
    const isGive = tx.type === 'give';
    const isSettled = tx.status === 'settled';

    const card = document.createElement('div');
    card.className = `tx-card ${isSettled ? 'settled-card' : ''}`;
    card.innerHTML = `
      <div class="tx-left">
        <div class="tx-info">
          <strong style="font-size:14px;">${tx.note || (isGive ? 'ধার দেওয়া হয়েছিল' : 'ধার নেওয়া হয়েছিল')}</strong>
          <span class="tx-meta">${tx.date} • <span class="tx-category-tag">${tx.category}</span></span>
        </div>
      </div>
      <div class="tx-right">
        <div class="tx-amount-val ${isSettled ? 'tx-amount-settled' : (isGive ? 'tx-amount-give' : 'tx-amount-take')}">
          ${isGive ? '+' : '-'}${curr} ${Number(tx.amount).toLocaleString()}
        </div>
        <button class="btn-secondary-sm" style="margin-top:4px; font-size:10px;" onclick="toggleTxStatus('${tx.id}')">
          ${isSettled ? 'অপেক্ষমাণ চিহ্নিত করুন' : 'পরিশোধ চিহ্নিত করুন'}
        </button>
      </div>
    `;
    historyContainer.appendChild(card);
  });
}

function closePersonLedgerModal() {
  document.getElementById('person-ledger-modal').classList.add('hidden');
  appState.activePersonLedger = null;
}

function settlePersonAccount() {
  if (!appState.activePersonLedger) return;
  const person = appState.activePersonLedger;

  if (confirm(`${person}-এর সকল দেনা-পাওনার হিসাব পরিশোধিত হিসেবে মেটাতে চান?`)) {
    appState.transactions.forEach(t => {
      if (t.personName === person) {
        t.status = 'settled';
      }
    });
    saveDataToStorage();
    renderAllViews();
    openPersonLedgerModal(person);
    showToast(`${person}-এর হিসাব সম্পূর্ণ পরিশোধিত করা হলো!`);
  }
}

function sendWhatsAppReminder() {
  if (!appState.activePersonLedger) return;
  const person = appState.activePersonLedger;
  const txs = appState.transactions.filter(t => t.personName === person && t.status === 'pending');
  let phone = txs.find(t => t.phone)?.phone || '';

  let giveSum = 0, takeSum = 0;
  txs.forEach(t => {
    if (t.type === 'give') giveSum += Number(t.amount);
    if (t.type === 'take') takeSum += Number(t.amount);
  });
  const net = giveSum - takeSum;

  if (net <= 0) {
    showToast("কোনো পাওনা বাকি নেই!");
    return;
  }

  const amountStr = `${appSettings.currency} ${net.toLocaleString()}`;
  let template = i18n[appSettings.lang].whatsapp_msg_template;
  let msg = template.replace('%NAME%', person).replace('%AMOUNT%', amountStr);

  // Format BD phone number for whatsapp link if present
  phone = phone.replace(/[^0-9]/g, '');
  if (phone.startsWith('01')) phone = '88' + phone;

  const url = phone ? `https://wa.me/${phone}?text=${encodeURIComponent(msg)}` : `https://wa.me/?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

function toggleTxStatus(txId) {
  const tx = appState.transactions.find(t => t.id === txId);
  if (tx) {
    tx.status = tx.status === 'pending' ? 'settled' : 'pending';
    saveDataToStorage();
    renderAllViews();
    if (appState.activePersonLedger) {
      openPersonLedgerModal(appState.activePersonLedger);
    }
  }
}

// --- Add Transaction Form Logic ---
function openAddModal() {
  document.getElementById('transaction-modal').classList.remove('hidden');
}

function closeAddModal() {
  document.getElementById('transaction-modal').classList.add('hidden');
  document.getElementById('tx-form').reset();
  document.getElementById('tx-date').value = new Date().toISOString().split('T')[0];
}

function updateTypeToggle(type) {
  const giveBtn = document.querySelector('.type-give');
  const takeBtn = document.querySelector('.type-take');

  if (type === 'give') {
    giveBtn.classList.add('active');
    takeBtn.classList.remove('active');
  } else {
    takeBtn.classList.add('active');
    giveBtn.classList.remove('active');
  }
}

function addPresetAmount(val) {
  const input = document.getElementById('tx-amount');
  const currVal = Number(input.value) || 0;
  input.value = currVal + val;
}

function handleSaveTransaction(event) {
  event.preventDefault();
  const personName = document.getElementById('tx-person-name').value.trim();
  const amount = Number(document.getElementById('tx-amount').value);
  const date = document.getElementById('tx-date').value;
  const dueDate = document.getElementById('tx-due-date').value;
  const category = document.getElementById('tx-category').value;
  const phone = document.getElementById('tx-phone').value.trim();
  const note = document.getElementById('tx-note').value.trim();
  
  const typeRadios = document.getElementsByName('txType');
  let type = 'give';
  for (const r of typeRadios) {
    if (r.checked) type = r.value;
  }

  if (!personName || !amount || amount <= 0) {
    showToast("দয়া করে নাম ও সঠিক টাকার পরিমাণ দিন!");
    return;
  }

  const newTx = {
    id: 'tx-' + Date.now(),
    personName,
    phone,
    type,
    amount,
    date,
    dueDate,
    category,
    note,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  appState.transactions.unshift(newTx);

  // Add to contacts if new
  if (!appState.contacts.some(c => c.name === personName)) {
    appState.contacts.push({ name: personName, phone, createdAt: date });
  }

  saveDataToStorage();
  renderAllViews();
  closeAddModal();
  showToast("নতুন লেনদেন সফলভাবে সংরক্ষণ করা হয়েছে!");
}

// --- Reports & Charts ---
function renderReports() {
  let giveTotal = 0;
  let takeTotal = 0;
  const categoryMap = {};
  const debtorMap = {};

  appState.transactions.forEach(t => {
    if (t.status === 'pending') {
      if (t.type === 'give') {
        giveTotal += Number(t.amount);
        debtorMap[t.personName] = (debtorMap[t.personName] || 0) + Number(t.amount);
      } else {
        takeTotal += Number(t.amount);
        debtorMap[t.personName] = (debtorMap[t.personName] || 0) - Number(t.amount);
      }

      categoryMap[t.category] = (categoryMap[t.category] || 0) + Number(t.amount);
    }
  });

  const curr = appSettings.currency;
  document.getElementById('chart-val-give').textContent = `${curr} ${giveTotal.toLocaleString()}`;
  document.getElementById('chart-val-take').textContent = `${curr} ${takeTotal.toLocaleString()}`;

  const maxVal = Math.max(giveTotal, takeTotal, 1);
  document.getElementById('chart-bar-give').style.width = `${(giveTotal / maxVal) * 100}%`;
  document.getElementById('chart-bar-take').style.width = `${(takeTotal / maxVal) * 100}%`;

  // Categories list
  const catContainer = document.getElementById('category-list');
  catContainer.innerHTML = '';
  Object.keys(categoryMap).forEach(cat => {
    const item = document.createElement('div');
    item.className = 'cat-item';
    item.innerHTML = `<span>${cat}</span> <strong>${curr} ${categoryMap[cat].toLocaleString()}</strong>`;
    catContainer.appendChild(item);
  });

  // Top Receivables
  const debtorsContainer = document.getElementById('top-debtors-list');
  debtorsContainer.innerHTML = '';
  const sortedDebtors = Object.entries(debtorMap)
    .filter(([_, val]) => val > 0)
    .sort((a, b) => b[1] - a[1]);

  if (sortedDebtors.length === 0) {
    debtorsContainer.innerHTML = `<p class="text-muted-sm">কারো কাছে পাওনা নেই</p>`;
  } else {
    sortedDebtors.slice(0, 5).forEach(([name, val]) => {
      const item = document.createElement('div');
      item.className = 'cat-item';
      item.innerHTML = `<span>👤 ${name}</span> <strong class="text-give">${curr} ${val.toLocaleString()}</strong>`;
      debtorsContainer.appendChild(item);
    });
  }
}

// --- Navigation & Tabs ---
function switchTab(tabId) {
  appState.currentTab = tabId;
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

  document.getElementById(`tab-${tabId}`).classList.add('active');
  document.getElementById(`nav-${tabId}`).classList.add('active');
}

function filterTransactions(type, btnEl) {
  appState.currentFilter = type;
  document.querySelectorAll('.filter-chips .chip').forEach(c => c.classList.remove('active'));
  btnEl.classList.add('active');
  renderTransactions(document.getElementById('home-search-input').value);
}

// --- Backup & Data Settings ---
function exportDataJSON() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
    transactions: appState.transactions,
    contacts: appState.contacts,
    exportDate: new Date().toISOString()
  }, null, 2));
  
  const dlAnchor = document.createElement('a');
  dlAnchor.setAttribute("href", dataStr);
  dlAnchor.setAttribute("download", `dhar_hisab_backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(dlAnchor);
  dlAnchor.click();
  dlAnchor.remove();
  showToast("ব্যাকআপ JSON ফাইল ডাউনলোড হয়েছে!");
}

function importDataJSON(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      if (imported.transactions) {
        appState.transactions = imported.transactions;
        appState.contacts = imported.contacts || [];
        saveDataToStorage();
        renderAllViews();
        showToast("ব্যাকআপ সফলভাবে রিস্টোর করা হয়েছে!");
      } else {
        showToast("ভুল ফাইল ফরম্যাট!");
      }
    } catch (err) {
      showToast("ফাইল পড়তে সমস্যা হয়েছে!");
    }
  };
  reader.readAsText(file);
}

function exportCSVStatement() {
  let csv = "ID,Person,Type,Amount,Date,DueDate,Category,Note,Status\n";
  appState.transactions.forEach(t => {
    csv += `"${t.id}","${t.personName}","${t.type}",${t.amount},"${t.date}","${t.dueDate || ''}","${t.category}","${t.note || ''}","${t.status}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', `statement_${new Date().toISOString().split('T')[0]}.csv`);
  a.click();
  showToast("CSV রিপোর্ট ফোল্ডারে ডাউনলোড করা হয়েছে!");
}

function confirmResetData() {
  if (confirm("আপনি কি নিশ্চিত যে সকল দেনা-পাওনার ডাটা মুছে ফেলতে চান? এটি পুনরুদ্ধার করা যাবে না।")) {
    appState.transactions = [];
    appState.contacts = [];
    saveDataToStorage();
    renderAllViews();
    showToast("সকল তথ্য মুছে ফেলা হয়েছে!");
  }
}

// --- PIN Lock System ---
function togglePinSecurity(enabled) {
  appSettings.pinEnabled = enabled;
  saveDataToStorage();
  showToast(enabled ? "পিন পাসকোড সক্রিয় করা হয়েছে!" : "পিন পাসকোড নিষ্ক্রিয় করা হয়েছে!");
}

function showPinLockScreen() {
  document.getElementById('pin-lock-screen').classList.remove('hidden');
  appState.enteredPin = '';
  updatePinDots();
}

function pressPin(num) {
  if (appState.enteredPin.length < 4) {
    appState.enteredPin += num;
    updatePinDots();

    if (appState.enteredPin.length === 4) {
      setTimeout(() => {
        if (appState.enteredPin === appSettings.pin) {
          document.getElementById('pin-lock-screen').classList.add('hidden');
          showToast("স্বাগতম! অ্যাপ খোলা হলো।");
        } else {
          showToast("ভুল পিন কোড! আবার চেষ্টা করুন।");
          clearPin();
        }
      }, 200);
    }
  }
}

function clearPin() {
  appState.enteredPin = '';
  updatePinDots();
}

function backspacePin() {
  appState.enteredPin = appState.enteredPin.slice(0, -1);
  updatePinDots();
}

function updatePinDots() {
  const dots = document.querySelectorAll('.pin-dots .dot');
  dots.forEach((d, idx) => {
    if (idx < appState.enteredPin.length) {
      d.classList.add('filled');
    } else {
      d.classList.remove('filled');
    }
  });
}

// --- Currency & Language Switcher ---
function updateCurrency(val) {
  appSettings.currency = val;
  saveDataToStorage();
  renderAllViews();
  showToast(`মুদ্রা পরিবর্তন করে ${val} করা হলো`);
}

function toggleLanguage() {
  appSettings.lang = appSettings.lang === 'bn' ? 'en' : 'bn';
  saveDataToStorage();
  applySettingsUI();
  renderAllViews();
  showToast(appSettings.lang === 'bn' ? "ভাষা পরিবর্তন: বাংলা" : "Language changed to English");
}

function applySettingsUI() {
  document.getElementById('currency-select').value = appSettings.currency;
  document.getElementById('form-currency-symbol').textContent = appSettings.currency;
  document.getElementById('pin-lock-toggle').checked = appSettings.pinEnabled;
  document.getElementById('lang-setting-label').textContent = appSettings.lang === 'bn' ? 'English' : 'বাংলা';
  document.querySelector('.lang-badge').textContent = appSettings.lang.toUpperCase();
}

function updateI18nLabels() {
  const langObj = i18n[appSettings.lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (langObj[key]) el.textContent = langObj[key];
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.getAttribute('data-i18n-ph');
    if (langObj[key]) el.placeholder = langObj[key];
  });
}

// --- Toast System ---
function showToast(msg) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid fa-circle-info"></i> <span>${msg}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}
