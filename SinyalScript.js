// Yeni mesajlar dizisi
const dailyMessages = [
    "Uzayın derinliklerinde keşfedilmemiş galaksiler olduğu gibi, senin içinde de keşfedilmemiş potansiyeller var. Bugün, o potansiyellerden birini ortaya çıkar.",
    "Her yıldız bir zamanlar sadece bir toz bulutuydu. Sen de bugün küçük bir adım at, yarının dev bir yıldızı ol.",
    "Evren genişliyor, sen de genişle. Konfor alanının dışına çık ve yeni deneyimlere yelken aç.",
    "Kara delikler bile ışığı yutamaz. Sen de zorluklar karşısında parlamaya devam et.",
    "Yıldızlar arası yolculuk küçük adımlarla başlar. Bugün atacağın küçük bir adım, seni yarının büyük başarısına götürebilir.",
    "Uzay boşluğunda bile hayat var. Umutsuz görünen durumlarda bile fırsatlar saklıdır.",
    "Gezegenler uyum içinde döner. Sen de iç huzurunu bul, evrenle uyumlan."
];

const messageAuthors = [
    "Cosmic Mentor",
    "Stellar Guide",
    "Galactic Philosopher",
    "Space Sage",
    "Universal Coach",
    "Orion Oracle",
    "Nebula Navigator"
];

// DOM Elementleri
const dailyMessageElement = document.getElementById('dailyMessage');
const newMessageBtn = document.querySelector('.new-message-btn');
const saveMessageBtn = document.querySelector('.save-message-btn');
const shareMessageBtn = document.querySelector('.share-message-btn');
const dateDay = document.querySelector('.date-day');
const dateMonth = document.querySelector('.date-month');

// Tarih güncelleme
const today = new Date();
dateDay.textContent = today.getDate();
const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
dateMonth.textContent = months[today.getMonth()];

// Yeni mesaj fonksiyonu
newMessageBtn.addEventListener('click', function() {
    const randomIndex = Math.floor(Math.random() * dailyMessages.length);
    dailyMessageElement.textContent = dailyMessages[randomIndex];
    
    // Yazarı da güncelle
    const authorElement = document.querySelector('.signal-author span');
    authorElement.textContent = messageAuthors[randomIndex];
    
    // Animasyon efekti
    dailyMessageElement.style.opacity = '0';
    setTimeout(() => {
        dailyMessageElement.style.opacity = '1';
        dailyMessageElement.style.transition = 'opacity 0.5s ease';
    }, 100);
    
    // İstatistikleri artır
    const statValue = document.querySelector('.stat-item:nth-child(2) .stat-value');
    let currentValue = parseInt(statValue.textContent);
    statValue.textContent = Math.min(currentValue + 5, 100);
});

// Mesajı kaydetme
saveMessageBtn.addEventListener('click', function() {
    const message = dailyMessageElement.textContent;
    localStorage.setItem('savedMessage', message);
    
    // Geri bildirim
    saveMessageBtn.innerHTML = '<i class="fas fa-check"></i> Kaydedildi';
    setTimeout(() => {
        saveMessageBtn.innerHTML = '<i class="fas fa-bookmark"></i> Kaydet';
    }, 2000);
});

// Mesajı paylaşma
shareMessageBtn.addEventListener('click', function() {
    const message = dailyMessageElement.textContent;
    const shareText = `⭐ Günlük Motivasyon Sinyali: ${message} #Elftatur #GalaktikAğ`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Günlük Sinyal',
            text: shareText,
            url: window.location.href
        });
    } else {
        // Fallback: Kopyala
        navigator.clipboard.writeText(shareText);
        shareMessageBtn.innerHTML = '<i class="fas fa-check"></i> Kopyalandı';
        setTimeout(() => {
            shareMessageBtn.innerHTML = '<i class="fas fa-share-alt"></i> Paylaş';
        }, 2000);
    }
});