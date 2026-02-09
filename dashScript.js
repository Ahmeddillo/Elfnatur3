// script.js - FullCalendar Entegrasyonu

// ======================
// 1. GLOBAL DEĞİŞKENLER
// ======================

let calendar;
let events = JSON.parse(localStorage.getItem('elfnaturEvents')) || [];
let selectedEvent = null;
let isEditing = false;

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
        eventClick: function(info) {
            openEditModal(info.event);
        },
        
        // Tarih Seçme (Google Calendar gibi)
        select: function(info) {
            openNewModal(info.start, info.end, info.allDay);
        },
        
        // Etkinlik Değişiklikleri
        eventDrop: function(info) {
            updateEventInStorage(info.event);
            updateCategoryCounts();
            renderUpcomingEvents();
        },
        
        eventResize: function(info) {
            updateEventInStorage(info.event);
            updateCategoryCounts();
            renderUpcomingEvents();
        },
        
        // Tarih Değişikliği
        datesSet: function(info) {
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

document.addEventListener('DOMContentLoaded', function() {
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
    document.getElementById('eventForm').addEventListener('submit', function(e) {
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