// script.js - FullCalendar Entegrasyonu

// ======================
// 1. GLOBAL DEĞİŞKENLER
// ======================

let calendar;
let events = JSON.parse(localStorage.getItem('elfnaturEvents')) || [];
let selectedEvent = null;
let isEditing = false;


// CANLI DİJİTAL SAAT
function updateLiveClock() {
    const clockElement = document.getElementById('liveClock');
    const now = new Date();

    // Saat, dakika, saniye
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    // Gün ve ay isimleri
    const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

    const dayName = days[now.getDay()];
    const day = now.getDate();
    const monthName = months[now.getMonth()];
    const year = now.getFullYear();

    // 12 saat formatı için (isteğe bağlı)
    let hours12 = now.getHours() % 12;
    hours12 = hours12 ? hours12 : 12; // 0'ı 12 yap
    const ampm = now.getHours() >= 12 ? 'PM' : 'AM';

    // Dijital saat görünümü
    clockElement.innerHTML = `
        <i class="fas fa-clock"></i>
        <div class="time-display">
            <div class="digital-time">${hours}:${minutes}:${seconds}</div>
            <div class="date-info">${dayName}, ${day} ${monthName} ${year}</div>
        </div>
    `;

    // Her saniyede bir renk değiştirme efekti (isteğe bağlı)
    if (seconds === '00') {
        clockElement.style.background = 'linear-gradient(135deg, #1a237e, #311b92)';
    } else if (seconds === '30') {
        clockElement.style.background = 'linear-gradient(135deg, #311b92, #1a237e)';
    }
}

// DOM yüklendiğinde saat başlat
document.addEventListener('DOMContentLoaded', function () {
    // Saati hemen göster
    updateLiveClock();

    // Her saniye güncelle
    setInterval(updateLiveClock, 1000);

    // Mini takvim bugünü göstersin
    updateCurrentDay();

    console.log("Dijital saat başlatıldı!");
});

// Alternatif: daha minimal dijital saat
function updateDigitalClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    document.querySelector('.live-clock span').textContent = timeString;
}

// Uzay:
// ===== CANLI UZAY VERİLERİ =====
function uzayVerileriniGuncelle() {
    // ISS konumu (canlı gibi görünsün)
    const enlem = (Math.random() * 180 - 90).toFixed(2);
    const boylam = (Math.random() * 360 - 180).toFixed(2);
    const yukseklik = 400 + Math.floor(Math.random() * 20);
    const hiz = 27600 + Math.floor(Math.random() * 500);
    
    document.getElementById('issEnlem').textContent = `${Math.abs(enlem)}° ${enlem > 0 ? 'K' : 'G'}`;
    document.getElementById('issBoylam').textContent = `${Math.abs(boylam)}° ${boylam > 0 ? 'D' : 'B'}`;
    document.getElementById('issYukseklik').textContent = `${yukseklik} km`;
    document.getElementById('issHiz').textContent = `${hiz.toLocaleString()} km/s`;
    
    // Uzaydaki astronot sayısı (gerçek veri simülasyonu)
    const astronotSayilari = [7, 10, 11, 7, 7, 10, 7, 7, 7];
    const randomAstronot = astronotSayilari[Math.floor(Math.random() * astronotSayilari.length)];
    document.getElementById('astronotSayisi').textContent = randomAstronot;
    
    // Aktif uydu sayısı (gerçek veri simülasyonu)
    const uyduSayilari = [3372, 3400, 3450, 3372, 3372, 3500, 3372];
    const randomUydu = uyduSayilari[Math.floor(Math.random() * uyduSayilari.length)];
    document.getElementById('uyduSayisi').textContent = randomUydu.toLocaleString();
    
    // UTC zamanı
    const now = new Date();
    const utcSaat = now.getUTCHours().toString().padStart(2, '0');
    const utcDakika = now.getUTCMinutes().toString().padStart(2, '0');
    document.getElementById('uzayZamani').textContent = `${utcSaat}:${utcDakika}`;
}

// Her 5 saniyede bir güncelle
setInterval(uzayVerileriniGuncelle, 5000);

// Sayfa yüklendiğinde başlat
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.uzay-widget')) {
        uzayVerileriniGuncelle();
    }
});

// ===== ELFNATUR GALAKTİK DROPDOWN MENU =====
// ===== SATÜRN DROPDOWN MENU - ÇALIŞAN VERSİYON =====
document.addEventListener('DOMContentLoaded', function() {
    const saturnBtn = document.getElementById('saturnMenuBtn');
    const dropdown = document.querySelector('.galaktik-dropdown');
    
    if (!saturnBtn || !dropdown) return;
    
    // TIKLAMA OLAYI - Menü aç/kapa
    saturnBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        
        // Active class ekle/çıkar
        this.classList.toggle('active');
        dropdown.classList.toggle('open');
        
        console.log('Satürn tıklandı! Menü açılıyor...');
    });
    
    // Menü öğelerine tıklama
    document.querySelectorAll('.menu-oge').forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            const sekme = this.dataset.sekme;
            console.log(`${sekme} sekmesi açıldı`);
            
            // Menüyü kapatmak istersen:
            // saturnBtn.classList.remove('active');
            // dropdown.classList.remove('open');
        });
    });
    
    // Dışarı tıklayınca kapat
    document.addEventListener('click', function(e) {
        if (!dropdown.contains(e.target) && !saturnBtn.contains(e.target)) {
            saturnBtn.classList.remove('active');
            dropdown.classList.remove('open');
        }
    });
    
    // ESC tuşu ile kapat
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            saturnBtn.classList.remove('active');
            dropdown.classList.remove('open');
        }
    });
    
    // Çıkış butonu
    const cikisBtn = document.getElementById('menuLogoutBtn');
    if (cikisBtn) {
        cikisBtn.addEventListener('click', function() {
            alert('🚀 Satürn\'den çıkış yapılıyor...');
        });
    }
    
    // Koordinatları güncelle
    function koordinatGuncelle() {
        const koordinatEl = document.getElementById('menuKoordinat');
        if (koordinatEl) {
            koordinatEl.innerHTML = 'Satürn • Halka Sektörü ' + Math.floor(Math.random() * 100);
        }
    }
    setInterval(koordinatGuncelle, 5000);
});
// CANLI TAKVİM OLUŞTURMA
function updateLiveCalendar() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentDay = now.getDate();

    // Ay ve yılı göster
    const monthYearElement = document.querySelector('.month-year');
    const months = [
        'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];

    

    monthYearElement.textContent = `${months[currentMonth]} ${currentYear}`;

    // Takvim günlerini oluştur
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay(); // 0 = Pazar, 1 = Pazartesi

    // HTML günlerini sıfırla
    const daysContainer = document.querySelector('.days');
    daysContainer.innerHTML = '';

    // Önceki ayın günlerini ekle (boşluk için)
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
        const day = document.createElement('div');
        day.className = 'day other-month';
        day.textContent = prevMonthLastDay - i;
        daysContainer.appendChild(day);
    }

    // Bu ayın günlerini ekle
    for (let i = 1; i <= daysInMonth; i++) {
        const day = document.createElement('div');
        day.className = 'day';
        day.textContent = i;

        // Bugün mü kontrol et
        if (i === currentDay) {
            day.classList.add('today');
        }

        // Haftasonu mu kontrol et (Cumartesi: 6, Pazar: 0)
        const dayOfWeek = new Date(currentYear, currentMonth, i).getDay();
        if (dayOfWeek === 6 || dayOfWeek === 0) {
            day.classList.add('weekend');
        }

        // Rastgele etkinlik ekle (gösterim için)
        if (Math.random() > 0.7) {
            day.classList.add('has-event');
        }

        // Tıklama olayı ekle
        day.addEventListener('click', function () {
            selectDay(this);
        });

        daysContainer.appendChild(day);
    }

    // Sonraki ayın günlerini ekle (kalan boşluk için)
    const totalCells = 42; // 6 satır x 7 gün
    const remainingCells = totalCells - (startingDay + daysInMonth);

    for (let i = 1; i <= remainingCells; i++) {
        const day = document.createElement('div');
        day.className = 'day other-month';
        day.textContent = i;
        daysContainer.appendChild(day);
    }
}

// GÜN SEÇME FONKSİYONU
function selectDay(dayElement) {
    // Tüm günlerden seçili classını kaldır
    document.querySelectorAll('.day').forEach(day => {
        day.classList.remove('selected');
    });

    // Tıklanan güne seçili classını ekle
    dayElement.classList.add('selected');

    // Seçili gün bilgisini göster
    const selectedDay = dayElement.textContent;
    const monthYear = document.querySelector('.month-year').textContent;
    console.log(`Seçilen tarih: ${selectedDay} ${monthYear}`);

    // Ana takvimde bu tarihe git
    if (window.calendar && typeof window.calendar.gotoDate === 'function') {
        const [monthName, year] = monthYear.split(' ');
        const months = {
            'Ocak': 0, 'Şubat': 1, 'Mart': 2, 'Nisan': 3,
            'Mayıs': 4, 'Haziran': 5, 'Temmuz': 6,
            'Ağustos': 7, 'Eylül': 8, 'Ekim': 9,
            'Kasım': 10, 'Aralık': 11
        };

        const selectedDate = new Date(year, months[monthName], selectedDay);
        window.calendar.gotoDate(selectedDate);
    }
}

// AY DEĞİŞTİRME FONKSİYONLARI
function setupCalendarControls() {
    const prevMonthBtn = document.createElement('button');
    prevMonthBtn.className = 'calendar-nav-btn';
    prevMonthBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevMonthBtn.addEventListener('click', goToPrevMonth);

    const nextMonthBtn = document.createElement('button');
    nextMonthBtn.className = 'calendar-nav-btn';
    nextMonthBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextMonthBtn.addEventListener('click', goToNextMonth);

    const header = document.querySelector('.mini-calendar-header');
    header.insertBefore(prevMonthBtn, header.children[1]);
    header.appendChild(nextMonthBtn);
}

function goToPrevMonth() {
    const now = new Date();
    now.setMonth(now.getMonth() - 1);
    updateCalendarForMonth(now.getFullYear(), now.getMonth());
}

function goToNextMonth() {
    const now = new Date();
    now.setMonth(now.getMonth() + 1);
    updateCalendarForMonth(now.getFullYear(), now.getMonth());
}

function updateCalendarForMonth(year, month) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentDay = now.getDate();

    const monthYearElement = document.querySelector('.month-year');
    const months = [
        'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];

    monthYearElement.textContent = `${months[month]} ${year}`;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const daysContainer = document.querySelector('.days');
    daysContainer.innerHTML = '';

    // Önceki ayın günleri
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
        const day = document.createElement('div');
        day.className = 'day other-month';
        day.textContent = prevMonthLastDay - i;
        daysContainer.appendChild(day);
    }

    // Bu ayın günleri
    for (let i = 1; i <= daysInMonth; i++) {
        const day = document.createElement('div');
        day.className = 'day';
        day.textContent = i;

        // Bugün mü kontrol et
        if (year === currentYear && month === currentMonth && i === currentDay) {
            day.classList.add('today');
        }

        // Haftasonu kontrolü
        const dayOfWeek = new Date(year, month, i).getDay();
        if (dayOfWeek === 6 || dayOfWeek === 0) {
            day.classList.add('weekend');
        }

        // Rastgele etkinlik
        if (Math.random() > 0.7) {
            day.classList.add('has-event');
        }

        day.addEventListener('click', function () {
            selectDay(this);
        });

        daysContainer.appendChild(day);
    }

    // Sonraki ayın günleri
    const totalCells = 42;
    const remainingCells = totalCells - (startingDay + daysInMonth);
    for (let i = 1; i <= remainingCells; i++) {
        const day = document.createElement('div');
        day.className = 'day other-month';
        day.textContent = i;
        daysContainer.appendChild(day);
    }
}

// TÜM CANLI ÖZELLİKLERİ BAŞLAT
document.addEventListener('DOMContentLoaded', function () {
    // Canlı saati başlat
    updateLiveClock();
    setInterval(updateLiveClock, 1000);

    // Canlı takvimi oluştur
    updateLiveCalendar();

    // Takvim kontrollerini kur
    setupCalendarControls();

    // Her gün saat 00:00'da takvimi güncelle
    const now = new Date();
    const timeUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) - now;
    setTimeout(function () {
        updateLiveCalendar();
        setInterval(updateLiveCalendar, 86400000); // Her 24 saatte bir
    }, timeUntilMidnight);

    console.log("Canlı takvim ve saat başlatıldı!");
});

// CSS için nav butonları
const style = document.createElement('style');
style.textContent = `
    .calendar-nav-btn {
        background: #3b82f6;
        color: white;
        border: none;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 14px;
    }
    
    .calendar-nav-btn:hover {
        background: #2563eb;
        transform: scale(1.1);
    }
    
    .day.selected {
        background: #10b981;
        color: white;
        border: 2px solid #059669;
        transform: scale(1.1);
    }
`;
document.head.appendChild(style);
// Rastgele görev durumu güncelleme
function updateTaskStatus() {
    const taskItems = document.querySelectorAll('.task-item');
    const progressValue = document.querySelector('.progress-value');
    const progressFill = document.querySelector('.progress-fill');

    let completedCount = 0;
    const totalTasks = taskItems.length;

    taskItems.forEach((task, index) => {
        // Rastgele görev durumu belirle
        const randomStatus = Math.random();

        if (randomStatus < 0.4) {
            // %40 tamamlanmış
            task.classList.add('completed');
            task.classList.remove('in-progress');
            completedCount++;
        } else if (randomStatus < 0.7) {
            // %30 devam ediyor
            task.classList.add('in-progress');
            task.classList.remove('completed');
        } else {
            // %30 henüz başlanmadı
            task.classList.remove('completed', 'in-progress');
        }

        // Görev numaralarını güncelle (24'ten sonra 1'den başla)
        const taskNumber = (index % 28) + 1;
        task.textContent = taskNumber;
    });

    // İlerleme çubuğunu güncelle
    if (progressValue && progressFill) {
        const percentage = Math.round((completedCount / totalTasks) * 100);
        progressValue.textContent = `${completedCount}/${totalTasks}`;
        progressFill.style.width = `${percentage}%`;
    }
}

// Mini takvimdeki günlere tıklama olayı
function setupMiniCalendar() {
    const dayElements = document.querySelectorAll('.day');
    const calendar = document.getElementById('calendar');

    dayElements.forEach(day => {
        day.addEventListener('click', function () {
            // Tüm günlerden active classını kaldır
            dayElements.forEach(d => d.classList.remove('current-day'));

            // Tıklanan güne active classını ekle
            this.classList.add('current-day');

            // FullCalendar'da tarihe git
            if (calendar) {
                const dayNumber = parseInt(this.textContent);
                const monthYear = document.querySelector('.month-year').textContent;
                const [month, year] = monthYear.split(' ');

                const months = {
                    'Ocak': 0, 'Şubat': 1, 'Mart': 2, 'Nisan': 3,
                    'Mayıs': 4, 'Haziran': 5, 'Temmuz': 6,
                    'Ağustos': 7, 'Eylül': 8, 'Ekim': 9,
                    'Kasım': 10, 'Aralık': 11
                };

                const date = new Date(year, months[month], dayNumber);

                // FullCalendar API'si varsa tarihe git
                if (window.calendar && typeof window.calendar.gotoDate === 'function') {
                    window.calendar.gotoDate(date);
                }
            }
        });
    });
}

// Takvim ve saat güncellemelerini başlat
document.addEventListener('DOMContentLoaded', function () {
    // Saati güncelle (her saniye)
    updateLiveClock();
    setInterval(updateLiveClock, 1000);

    // Görev durumunu güncelle
    updateTaskStatus();

    // Mini takvimi ayarla
    setupMiniCalendar();

    // Günlük durumu her 10 dakikada bir güncelle
    setInterval(updateTaskStatus, 600000);

    // Güncellenmiş günlük durumu göster
    console.log("Dashboard bileşenleri başarıyla yüklendi!");
});

// Task item'lerine tıklama olayı ekle
document.addEventListener('DOMContentLoaded', function () {
    const taskItems = document.querySelectorAll('.task-item');

    taskItems.forEach(task => {
        task.addEventListener('click', function () {
            const currentStatus = this.classList.contains('completed') ?
                'completed' :
                (this.classList.contains('in-progress') ? 'in-progress' : 'none');

            // Durumu değiştir
            if (currentStatus === 'completed') {
                this.classList.remove('completed');
                this.classList.add('in-progress');
            } else if (currentStatus === 'in-progress') {
                this.classList.remove('in-progress');
            } else {
                this.classList.add('completed');
            }

            // İlerleme durumunu yeniden hesapla
            setTimeout(updateTaskStatus, 100);
        });
    });
});

// Kategori renk eşleştirmeleri
const categoryColors = {
    '#3b82f6': 'İş',
    '#10b981': 'Kişisel',
    '#8b5cf6': 'Toplantı',
    '#ef4444': 'Sağlık',
    '#f59e0b': 'Eğitim',
    '#ec4899': 'Sosyal'
};

// ======================
// 2. CANLI SAAT
// ======================

function updateLiveClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('tr-TR');
    const clockElement = document.getElementById('liveClock');
    if (clockElement) {
        clockElement.querySelector('span').textContent = timeString;
    }
}

// CANLI TAKVİM OLUŞTURMA
let currentTakvimDate = new Date();

function olusturCanliTakvim() {
    const takvimGunlerDiv = document.getElementById('takvimGunler');
    const takvimAyYilSpan = document.getElementById('takvimAyYil');

    if (!takvimGunlerDiv || !takvimAyYilSpan) return;

    const year = currentTakvimDate.getFullYear();
    const month = currentTakvimDate.getMonth();

    // Ay ve yılı güncelle
    const months = [
        'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    takvimAyYilSpan.textContent = `${months[month]} ${year}`;

    // Ayın ilk ve son günü
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // İlk günün haftanın hangi günü olduğu (0: Pazar, 1: Pazartesi)
    let firstDayIndex = firstDay.getDay();
    // Pazartesi'den başlaması için ayarlama (1: Pazartesi)
    firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    // Önceki ayın son günleri
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    // HTML'i temizle
    takvimGunlerDiv.innerHTML = '';

    const today = new Date();

    // Önceki ayın günleri (boşluk için)
    for (let i = firstDayIndex; i > 0; i--) {
        const gun = document.createElement('div');
        gun.className = 'takvim-gun-hucresi baska-ay';
        gun.textContent = prevMonthLastDay - i + 1;
        gun.title = 'Önceki ay';
        takvimGunlerDiv.appendChild(gun);
    }

    // Bu ayın günleri
    for (let i = 1; i <= daysInMonth; i++) {
        const gun = document.createElement('div');
        gun.className = 'takvim-gun-hucresi';
        gun.textContent = i;
        gun.dataset.gun = i;
        gun.dataset.ay = month;
        gun.dataset.yil = year;

        // Bugün mü kontrol et
        if (year === today.getFullYear() &&
            month === today.getMonth() &&
            i === today.getDate()) {
            gun.classList.add('bugun');
        }

        // Haftasonu mu kontrol et (Cumartesi: 6, Pazar: 0)
        const dayOfWeek = new Date(year, month, i).getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            gun.classList.add('hafta-sonu');
        }

        // Rastgele etkinlik ekle (gösterim için)
        if (Math.random() > 0.7) {
            gun.classList.add('etkinlikli');
            gun.title = `${i} ${months[month]} ${year} - Etkinlik var`;
        } else {
            gun.title = `${i} ${months[month]} ${year}`;
        }

        // Tıklama olayı
        gun.addEventListener('click', function () {
            seciliGunuGuncelle(this);
            gorevDurumunuGuncelle();
        });

        takvimGunlerDiv.appendChild(gun);
    }

    // Sonraki ayın günleri (kalan boşluk için)
    const totalCells = 42; // 6 satır x 7 gün
    const remainingCells = totalCells - (firstDayIndex + daysInMonth);

    for (let i = 1; i <= remainingCells; i++) {
        const gun = document.createElement('div');
        gun.className = 'takvim-gun-hucresi baska-ay';
        gun.textContent = i;
        gun.title = 'Sonraki ay';
        takvimGunlerDiv.appendChild(gun);
    }

    // İlerleme durumunu güncelle
    gorevDurumunuGuncelle();
}

// SEÇİLİ GÜNÜ GÜNCELLE
function seciliGunuGuncelle(seciliGun) {
    // Tüm günlerden seçili classını kaldır
    document.querySelectorAll('.takvim-gun-hucresi').forEach(gun => {
        gun.classList.remove('secili');
    });

    // Tıklanan güne seçili classını ekle
    seciliGun.classList.add('secili');

    // Seçili gün bilgilerini al
    const gun = seciliGun.dataset.gun;
    const ay = seciliGun.dataset.ay;
    const yil = seciliGun.dataset.yil;

    if (gun && ay && yil) {
        const months = [
            'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
            'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
        ];
        console.log(`Seçilen tarih: ${gun} ${months[ay]} ${yil}`);
    }
}

// GÖREV DURUMUNU GÜNCELLE
function gorevDurumunuGuncelle() {
    const tamamlananGorev = document.getElementById('tamamlananGorev');
    const ilerlemeDoluluk = document.getElementById('ilerlemeDoluluk');

    if (!tamamlananGorev || !ilerlemeDoluluk) return;

    // Rastgele görev sayıları (gerçek uygulamada API'den gelecek)
    const tamamlanan = Math.floor(Math.random() * 13);
    const toplam = 12;

    // İlerleme yüzdesi
    const yuzde = Math.round((tamamlanan / toplam) * 100);

    // Değerleri güncelle
    tamamlananGorev.textContent = `${tamamlanan}/${toplam}`;
    ilerlemeDoluluk.style.width = `${yuzde}%`;

    // Renk değiştirme (isteğe bağlı)
    if (yuzde < 30) {
        ilerlemeDoluluk.style.background = 'linear-gradient(90deg, #ef4444, #f59e0b)';
    } else if (yuzde < 70) {
        ilerlemeDoluluk.style.background = 'linear-gradient(90deg, #f59e0b, #3b82f6)';
    } else {
        ilerlemeDoluluk.style.background = 'linear-gradient(90deg, #3b82f6, #10b981)';
    }
}

// TAKVİM KONTROLLERİNİ BAĞLA
function takvimKontrolleriniBagla() {
    const prevMonthBtn = document.getElementById('prevMonthBtn');
    const nextMonthBtn = document.getElementById('nextMonthBtn');

    if (!prevMonthBtn || !nextMonthBtn) return;

    // Önceki ay butonu
    prevMonthBtn.addEventListener('click', function () {
        currentTakvimDate.setMonth(currentTakvimDate.getMonth() - 1);
        olusturCanliTakvim();
    });

    // Sonraki ay butonu
    nextMonthBtn.addEventListener('click', function () {
        currentTakvimDate.setMonth(currentTakvimDate.getMonth() + 1);
        olusturCanliTakvim();
    });

    // Bugün butonu (isteğe bağlı - ekleyebilirsiniz)
    const bugunBtn = document.createElement('button');
    bugunBtn.className = 'takvim-nav-btn';
    bugunBtn.innerHTML = '<i class="fas fa-calendar-day"></i>';
    bugunBtn.title = 'Bugüne git';
    bugunBtn.addEventListener('click', function () {
        currentTakvimDate = new Date();
        olusturCanliTakvim();
    });

    const takvimNav = document.querySelector('.takvim-nav');
    if (takvimNav) {
        takvimNav.insertBefore(bugunBtn, takvimNav.children[1]);
    }
}

// ANA UYGULAMAYI BAŞLAT
document.addEventListener('DOMContentLoaded', function () {
    // Saati başlat
    updateLiveClock();
    setInterval(updateLiveClock, 1000);

    // Canlı takvimi oluştur
    olusturCanliTakvim();

    // Takvim kontrollerini bağla
    takvimKontrolleriniBagla();

    // Diğer fonksiyonları başlat
    initializeCalendar();
    initializeModal();
    initializeLogout();
    initializeQuickAdd();
    updateCategoryCounts();

    // Her gün saat 00:00'da takvimi otomatik güncelle
    const now = new Date();
    const timeUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) - now;
    setTimeout(function () {
        olusturCanliTakvim();
        setInterval(olusturCanliTakvim, 86400000); // Her 24 saatte bir
    }, timeUntilMidnight);

    console.log('Canlı takvim başlatıldı!');
});

// ======================
// 3. FULLCALENDAR KURULUMU
// ======================

function initCalendar() {
    const calendarEl = document.getElementById('calendar');

    calendar = new FullCalendar.Calendar(calendarEl, {
        // Temel Ayarlar
        initialView: 'dayGridMonth',
        locale: 'tr',
        firstDay: 1, // Pazartesi'den başla
        height: 'auto',

        // Header Toolbar
        headerToolbar: false, // Kendi toolbar'ımızı kullanacağız

        // Görünüm Ayarları
        views: {
            dayGridMonth: {
                titleFormat: { year: 'numeric', month: 'long' }
            },
            timeGridWeek: {
                titleFormat: { year: 'numeric', month: 'long', day: 'numeric' }
            },
            timeGridDay: {
                titleFormat: { year: 'numeric', month: 'long', day: 'numeric' }
            }
        },

        // Etkinlikler
        events: events.map(event => ({
            id: event.id,
            title: event.title,
            start: event.start,
            end: event.end,
            color: event.color,
            extendedProps: {
                description: event.description,
                category: event.category
            }
        })),

        // Google Calendar Özellikleri
        editable: true, // Sürükle-bırak
        selectable: true, // Tarih seçme
        selectMirror: true,
        dayMaxEvents: true,

        // Etkinlik Tıklama
        eventClick: function (info) {
            openEditModal(info.event);
        },

        // Tarih Seçme (Google Calendar gibi)
        select: function (info) {
            openNewModal(info.start, info.end, info.allDay);
        },

        // Etkinlik Değişiklikleri
        eventDrop: function (info) {
            updateEventInStorage(info.event);
            updateCategoryCounts();
            renderUpcomingEvents();
        },

        eventResize: function (info) {
            updateEventInStorage(info.event);
            updateCategoryCounts();
            renderUpcomingEvents();
        },

        // Tarih Değişikliği
        datesSet: function (info) {
            updateCurrentDate(info.view);
        }
    });

    calendar.render();

    // Başlangıç tarihini güncelle
    updateCurrentDate(calendar.view);
}

// ======================
// 4. ETKİNLİK YÖNETİMİ
// ======================

function saveEvent(eventData) {
    const eventId = eventData.id || Date.now().toString();
    const color = document.getElementById('modalEventCategory').value;

    const event = {
        id: eventId,
        title: eventData.title,
        start: eventData.start,
        end: eventData.end,
        color: color,
        description: eventData.description,
        category: categoryColors[color] || 'Diğer'
    };

    // FullCalendar'a ekle/güncelle
    if (isEditing && selectedEvent) {
        calendar.getEventById(selectedEvent.id).remove();
        calendar.addEvent(event);
    } else {
        calendar.addEvent(event);
    }

    // Storage'a kaydet
    saveEventsToStorage();

    // UI'ı güncelle
    updateCategoryCounts();
    renderUpcomingEvents();

    // Bildirim göster
    showNotification(isEditing ? 'Etkinlik güncellendi!' : 'Etkinlik eklendi!', 'success');

    // Modal'ı kapat
    closeModal();
}

function deleteEvent() {
    if (!selectedEvent) return;

    if (confirm('Bu etkinliği silmek istediğinize emin misiniz?')) {
        calendar.getEventById(selectedEvent.id).remove();
        saveEventsToStorage();
        updateCategoryCounts();
        renderUpcomingEvents();
        showNotification('Etkinlik silindi!', 'success');
        closeModal();
    }
}

function saveEventsToStorage() {
    const events = calendar.getEvents().map(event => ({
        id: event.id,
        title: event.title,
        start: event.start.toISOString(),
        end: event.end?.toISOString(),
        color: event.backgroundColor,
        description: event.extendedProps.description,
        category: event.extendedProps.category
    }));

    localStorage.setItem('elfnaturEvents', JSON.stringify(events));
}

function updateEventInStorage(calendarEvent) {
    const events = JSON.parse(localStorage.getItem('elfnaturEvents') || '[]');
    const eventIndex = events.findIndex(e => e.id === calendarEvent.id);

    if (eventIndex !== -1) {
        events[eventIndex] = {
            ...events[eventIndex],
            title: calendarEvent.title,
            start: calendarEvent.start.toISOString(),
            end: calendarEvent.end?.toISOString(),
            color: calendarEvent.backgroundColor
        };

        localStorage.setItem('elfnaturEvents', JSON.stringify(events));
    }
}

// ======================
// 5. MODAL YÖNETİMİ
// ======================

function openNewModal(start, end, allDay) {
    isEditing = false;
    selectedEvent = null;

    const modal = document.getElementById('eventModal');
    const title = document.getElementById('modalTitle');
    const form = document.getElementById('eventForm');
    const deleteBtn = document.getElementById('deleteEventBtn');

    title.textContent = 'Yeni Etkinlik';
    deleteBtn.style.display = 'none';

    // Formu temizle
    form.reset();

    // Varsayılan değerleri ayarla
    const startDate = start || new Date();
    const endDate = end || new Date(startDate.getTime() + 60 * 60 * 1000); // +1 saat

    document.getElementById('modalEventStart').value = formatDateTimeLocal(startDate);
    document.getElementById('modalEventEnd').value = formatDateTimeLocal(endDate);

    modal.style.display = 'flex';
}

function openEditModal(calendarEvent) {
    isEditing = true;
    selectedEvent = calendarEvent;

    const modal = document.getElementById('eventModal');
    const title = document.getElementById('modalTitle');
    const form = document.getElementById('eventForm');
    const deleteBtn = document.getElementById('deleteEventBtn');

    title.textContent = 'Etkinliği Düzenle';
    deleteBtn.style.display = 'block';

    // Formu doldur
    document.getElementById('modalEventTitle').value = calendarEvent.title;
    document.getElementById('modalEventStart').value = formatDateTimeLocal(calendarEvent.start);
    document.getElementById('modalEventEnd').value = formatDateTimeLocal(calendarEvent.end);
    document.getElementById('modalEventDescription').value = calendarEvent.extendedProps.description || '';

    // Kategoriyi bul ve seç
    const color = calendarEvent.backgroundColor;
    const categorySelect = document.getElementById('modalEventCategory');
    for (let option of categorySelect.options) {
        if (option.value === color) {
            option.selected = true;
            break;
        }
    }

    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('eventModal').style.display = 'none';
    isEditing = false;
    selectedEvent = null;
}

function formatDateTimeLocal(date) {
    if (!date) return '';

    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
}

// ======================
// 6. UI GÜNCELLEMELERİ
// ======================

function updateCurrentDate(view) {
    const dateEl = document.getElementById('currentDate');
    if (!dateEl) return;

    const title = view.title;
    dateEl.textContent = title;
}

function updateCategoryCounts() {
    const events = calendar.getEvents();

    // Her kategori için say
    const counts = {
        'İş': 0,
        'Kişisel': 0,
        'Toplantı': 0,
        'Sağlık': 0,
        'Eğitim': 0,
        'Sosyal': 0
    };

    events.forEach(event => {
        const category = event.extendedProps.category;
        if (category && counts[category] !== undefined) {
            counts[category]++;
        }
    });

    // DOM'u güncelle
    document.getElementById('workCount').textContent = counts['İş'];
    document.getElementById('personalCount').textContent = counts['Kişisel'];
    document.getElementById('meetingCount').textContent = counts['Toplantı'];
    document.getElementById('healthCount').textContent = counts['Sağlık'];
}

function renderUpcomingEvents() {
    const upcomingEl = document.getElementById('upcomingEvents');
    if (!upcomingEl) return;

    const events = calendar.getEvents();
    const now = new Date();

    // Gelecek 7 gün içindeki etkinlikleri bul
    const upcoming = events
        .filter(event => event.start > now)
        .sort((a, b) => a.start - b.start)
        .slice(0, 5);

    if (upcoming.length === 0) {
        upcomingEl.innerHTML = `
            <div class="empty-state">
                <i class="far fa-calendar"></i>
                <p>Yaklaşan etkinlik yok</p>
            </div>
        `;
        return;
    }

    upcomingEl.innerHTML = upcoming.map(event => `
        <div class="event-item" data-event-id="${event.id}">
            <div class="event-time">
                <i class="far fa-clock"></i>
                ${event.start.toLocaleDateString('tr-TR')} 
                ${event.start.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div class="event-title">${event.title}</div>
            <div class="event-category">${event.extendedProps.category || 'Diğer'}</div>
        </div>
    `).join('');

    // Tıklama olaylarını ekle
    document.querySelectorAll('.event-item').forEach(item => {
        item.addEventListener('click', () => {
            const eventId = item.dataset.eventId;
            const event = calendar.getEventById(eventId);
            if (event) {
                openEditModal(event);
            }
        });
    });
}

// ======================
// 7. HIZLI EKLEME
// ======================

function addQuickEvent() {
    const title = document.getElementById('eventTitle').value;
    const date = document.getElementById('eventDate').value;
    const startTime = document.getElementById('eventStartTime').value;
    const endTime = document.getElementById('eventEndTime').value;
    const category = document.getElementById('eventCategory').value;
    const description = document.getElementById('eventDescription').value;

    if (!title) {
        showNotification('Lütfen etkinlik başlığı girin!', 'error');
        return;
    }

    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);

    const event = {
        id: Date.now().toString(),
        title,
        start: start.toISOString(),
        end: end.toISOString(),
        color: category,
        description,
        category: categoryColors[category] || 'Diğer'
    };

    calendar.addEvent(event);
    saveEventsToStorage();
    updateCategoryCounts();
    renderUpcomingEvents();

    // Formu temizle
    document.getElementById('eventTitle').value = '';
    document.getElementById('eventDescription').value = '';

    showNotification('Etkinlik başarıyla eklendi!', 'success');
}

// ======================
// 8. YARDIMCI FONKSİYONLAR
// ======================

function showNotification(message, type = 'info') {
    // Basit bir alert yerine daha iyi bir bildirim sistemi yapılabilir
    alert(message);
}

function navigateCalendar(direction) {
    if (direction === 'prev') {
        calendar.prev();
    } else if (direction === 'next') {
        calendar.next();
    } else if (direction === 'today') {
        calendar.today();
    }
}

function changeView(viewType) {
    calendar.changeView(viewType);

    // View butonlarını aktif yap
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.view === viewType) {
            btn.classList.add('active');
        }
    });
}

// ======================
// 9. EVENT LISTENERS
// ======================

document.addEventListener('DOMContentLoaded', function () {
    // Takvimi başlat
    initCalendar();

    // Canlı saati başlat
    updateLiveClock();
    setInterval(updateLiveClock, 1000);

    // UI güncellemeleri
    updateCategoryCounts();
    renderUpcomingEvents();

    // ========== EVENT LISTENERS ==========

    // Navigation butonları
    document.getElementById('prevBtn').addEventListener('click', () => navigateCalendar('prev'));
    document.getElementById('nextBtn').addEventListener('click', () => navigateCalendar('next'));
    document.getElementById('todayBtn').addEventListener('click', () => navigateCalendar('today'));

    // View butonları
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            changeView(btn.dataset.view);
        });
    });

    // Yeni etkinlik butonu
    document.getElementById('newEventBtn').addEventListener('click', () => {
        openNewModal();
    });

    // Hızlı ekleme butonu
    document.getElementById('addQuickEvent').addEventListener('click', addQuickEvent);

    // Modal
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('cancelBtn').addEventListener('click', closeModal);

    // Modal dışına tıklayınca kapat
    document.getElementById('eventModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('eventModal')) {
            closeModal();
        }
    });

    // Form submit
    document.getElementById('eventForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = {
            id: selectedEvent?.id,
            title: document.getElementById('modalEventTitle').value,
            start: document.getElementById('modalEventStart').value,
            end: document.getElementById('modalEventEnd').value,
            description: document.getElementById('modalEventDescription').value
        };

        saveEvent(formData);
    });

    // Sil butonu
    document.getElementById('deleteEventBtn').addEventListener('click', deleteEvent);

    // Çıkış butonu
    document.getElementById('logoutBtn').addEventListener('click', () => {
        if (confirm('Çıkış yapmak istediğinize emin misiniz?')) {
            window.location.href = 'index.html';
        }
    });

    // Kategori filtreleme
    document.querySelectorAll('.category-item').forEach(item => {
        item.addEventListener('click', () => {
            const category = item.dataset.category;
            const events = calendar.getEvents();

            // Tüm etkinlikleri göster/gizle
            events.forEach(event => {
                const eventCategory = event.extendedProps.category;
                if (eventCategory === category) {
                    // Bu kategorideki etkinlikleri vurgula
                    event.setProp('display', 'auto');
                }
            });

            // Bildirim göster
            showNotification(`${category} kategorisi filtrelendi`);
        });
    });
});
