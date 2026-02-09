// Modal işlemleri
document.addEventListener('DOMContentLoaded', function () {
    console.log('Sayfa yüklendi');

    // Elementleri seç
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const startBtn = document.getElementById('startBtn');
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const closeLogin = document.getElementById('closeLogin');
    const closeRegister = document.getElementById('closeRegister');
    const goToRegister = document.getElementById('goToRegister');
    const goToLogin = document.getElementById('goToLogin');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const forgotPassword = document.getElementById('forgotPassword');

    // Kontrol et
    console.log('Element kontrolleri:');
    if (!loginBtn) console.error('✗ loginBtn bulunamadı');
    if (!registerBtn) console.error('✗ registerBtn bulunamadı');
    if (!startBtn) console.error('✗ startBtn bulunamadı');
    if (!loginModal) console.error('✗ loginModal bulunamadı');
    if (!registerModal) console.error('✗ registerModal bulunamadı');
    if (!closeLogin) console.error('✗ closeLogin bulunamadı');
    if (!closeRegister) console.error('✗ closeRegister bulunamadı');
    if (!goToRegister) console.error('✗ goToRegister bulunamadı');
    if (!goToLogin) console.error('✗ goToLogin bulunamadı');
    if (!loginForm) console.error('✗ loginForm bulunamadı');
    if (!registerForm) console.error('✗ registerForm bulunamadı');
    if (!forgotPassword) console.error('✗ forgotPassword bulunamadı');

    // Modal açma fonksiyonu
    function openModal(modal) {
        if (!modal) return;
        
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Scroll'u en üste al
        modal.scrollTop = 0;
        
        // Modal açıldıktan sonra içeriğe animasyon ekle
        setTimeout(() => {
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.style.animation = 'modalFadeIn 0.4s ease-out';
            }
        }, 10);
    }

    // Modal kapatma fonksiyonu
    function closeModal(modal) {
        if (!modal) return;
        
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.animation = 'modalFadeOut 0.3s ease-out';
            
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 300);
        } else {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // Giriş modalını aç
    if (loginBtn && loginModal) {
        loginBtn.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('Giriş butonuna tıklandı');
            openModal(loginModal);
        });
    }

    // Kayıt modalını aç
    if (registerBtn && registerModal) {
        registerBtn.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('Kayıt butonuna tıklandı');
            openModal(registerModal);
        });
    }

    // Hemen Başla butonuna tıklanınca kayıt modalını aç
    if (startBtn && registerModal) {
        startBtn.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('Hemen Başla butonuna tıklandı');
            openModal(registerModal);
        });
    }

    // Modal kapatma işlemleri
    if (closeLogin && loginModal) {
        closeLogin.addEventListener('click', function () {
            console.log('Giriş modalı kapatılıyor');
            closeModal(loginModal);
        });
    }

    if (closeRegister && registerModal) {
        closeRegister.addEventListener('click', function () {
            console.log('Kayıt modalı kapatılıyor');
            closeModal(registerModal);
        });
    }

    // Modal dışına tıklanınca kapat
    window.addEventListener('click', function (e) {
        if (e.target === loginModal) {
            closeModal(loginModal);
        }
        if (e.target === registerModal) {
            closeModal(registerModal);
        }
    });

    // Formlar arası geçiş
    if (goToRegister && loginModal && registerModal) {
        goToRegister.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('Kayıt Ol linkine tıklandı');
            closeModal(loginModal);
            setTimeout(() => {
                openModal(registerModal);
            }, 300);
        });
    }

    if (goToLogin && registerModal && loginModal) {
        goToLogin.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('Giriş Yap linkine tıklandı');
            closeModal(registerModal);
            setTimeout(() => {
                openModal(loginModal);
            }, 300);
        });
    }

    // Giriş formu gönderimi
     // Giriş formu submit olayını dinle
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        // Formun varsayılan submit davranışını engelle
        event.preventDefault();
        
        // İsteğe bağlı: Giriş bilgilerini kontrol et (basit kontrol)
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if (email && password) {
            // Modalı kapat
            const modal = document.getElementById('loginModal');
            modal.style.display = 'none';
            
            // Başka bir sayfaya yönlendir
            // NOT: 'dashboard.html' yerine yönlendirmek istediğiniz sayfanın adını yazın
            window.location.href = 'dashboard.html';
            
            // Alternatif olarak belirli bir süre sonra yönlendirmek için:
            // setTimeout(function() {
            //     window.location.href = 'dashboard.html';
            // }, 1000); // 1 saniye sonra
        } else {
            // Eğer email veya şifre boşsa kullanıcıyı uyar
            alert('Lütfen email ve şifrenizi giriniz.');
        }
    });

    // Modal kapatma butonu
    document.getElementById('closeLogin').addEventListener('click', function() {
        document.getElementById('loginModal').style.display = 'none';
    });

    // Modal dışına tıklayınca kapatma (opsiyonel)
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('loginModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // "Şifremi Unuttum" linki
    document.getElementById('forgotPassword').addEventListener('click', function(event) {
        event.preventDefault();
        alert('Şifre sıfırlama özelliği yakında eklenecek!');
    });

    // "Kayıt Ol" linki
    document.getElementById('goToRegister').addEventListener('click', function(event) {
        event.preventDefault();
        // Buraya kayıt sayfasına yönlendirme veya kayıt modalını açma kodu eklenebilir
        alert('Kayıt sayfasına yönlendiriliyorsunuz...');
        // Örnek: window.location.href = 'register.html';
    });

    // Sosyal giriş butonları
    document.querySelector('.google-btn').addEventListener('click', function() {
        alert('Google ile giriş yakında eklenecek!');
    });

    document.querySelector('.github-btn').addEventListener('click', function() {
        alert('GitHub ile giriş yakında eklenecek!');
    });

    // Kayıt formu gönderimi
    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            console.log('Kayıt formu gönderildi');

            // Form değerlerini al
            const firstName = document.getElementById('firstName')?.value;
            const lastName = document.getElementById('lastName')?.value;
            const regEmail = document.getElementById('regEmail')?.value;
            const username = document.getElementById('username')?.value;
            const regPassword = document.getElementById('regPassword')?.value;
            const confirmPassword = document.getElementById('confirmPassword')?.value;
            const promoCode = document.getElementById('promoCode')?.value;

            // Validasyon
            if (!firstName || !lastName || !regEmail || !username || !regPassword || !confirmPassword) {
                alert('Lütfen zorunlu alanları doldurun!');
                return;
            }

            // Email validasyonu
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(regEmail)) {
                alert('Geçerli bir email adresi girin!');
                return;
            }

            // Kullanıcı adı validasyonu
            if (username.length < 3) {
                alert('Kullanıcı adı en az 3 karakter olmalıdır!');
                return;
            }

            // Şifre validasyonu
            if (regPassword.length < 6) {
                alert('Şifre en az 6 karakter olmalıdır!');
                return;
            }

            if (regPassword !== confirmPassword) {
                alert('Şifreler eşleşmiyor!');
                return;
            }

            // Promosyon kodu kontrolü
            let discountApplied = false;
            if (promoCode) {
                if (promoCode.toUpperCase() === 'ELF2024' || promoCode.toUpperCase() === 'ELFNATUR') {
                    discountApplied = true;
                    alert('Promosyon kodu uygulandı! 🎉');
                } else {
                    alert('Geçersiz promosyon kodu');
                }
            }

            // Üyelik planı seçimi
            const selectedPlan = document.querySelector('.plan-card.active');
            const planName = selectedPlan ? selectedPlan.querySelector('.plan-name').textContent : 'Ücretsiz';

            // Başarılı kayıt
            alert(`Kayıt başarılı! ${planName} planı ile başlıyorsunuz 🚀\n${discountApplied ? 'Promosyon kodu uygulandı!' : ''}`);
            closeModal(registerModal);
            setTimeout(() => {
                openModal(loginModal);
            }, 300);

            // Formu temizle
            registerForm.reset();
        });
    }

    // Üyelik planı seçimi
    const planCards = document.querySelectorAll('.plan-card');
    if (planCards.length > 0) {
        planCards.forEach(card => {
            card.addEventListener('click', function () {
                // Tüm kartlardan active class'ını kaldır
                planCards.forEach(c => c.classList.remove('active'));
                // Tıklanan karta active class'ını ekle
                this.classList.add('active');

                // Buton metnini güncelle
                const submitBtn = document.querySelector('.register-submit');
                if (this.id === 'freePlan') {
                    submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> Ücretsiz Kayıt Ol';
                    submitBtn.style.background = 'linear-gradient(45deg, #64ffda, #52d3ba)';
                } else {
                    submitBtn.innerHTML = '<i class="fas fa-gem"></i> Premium Kayıt Ol (199 ₺)';
                    submitBtn.style.background = 'linear-gradient(45deg, #9d4edd, #7b2cbf)';
                }
            });
        });
    }

    // Şifremi unuttum
    if (forgotPassword) {
        forgotPassword.addEventListener('click', function (e) {
            e.preventDefault();
            const email = document.getElementById('email')?.value;
            
            if (email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailRegex.test(email)) {
                    alert(`Şifre sıfırlama linki ${email} adresine gönderildi.`);
                } else {
                    alert('Lütfen önce geçerli bir email adresi girin!');
                }
            } else {
                const userEmail = prompt('Şifre sıfırlama linki göndermek için email adresinizi girin:');
                if (userEmail) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (emailRegex.test(userEmail)) {
                        alert(`Şifre sıfırlama linki ${userEmail} adresine gönderildi.`);
                    } else {
                        alert('Geçerli bir email adresi girin!');
                    }
                }
            }
        });
    }

    // Social butonları
    const socialBtns = document.querySelectorAll('.social-btn');
    socialBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const provider = this.classList.contains('google-btn') ? 'Google' : 'GitHub';
            alert(`${provider} ile giriş yakında eklenecek!`);
        });
    });

    // Hero animasyonları
    startAnimations();

    // Escape tuşu ile modal kapatma
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (loginModal.style.display === 'flex') {
                closeModal(loginModal);
            }
            if (registerModal.style.display === 'flex') {
                closeModal(registerModal);
            }
        }
    });
});

// Hero animasyonları
function startAnimations() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(20px)';

        setTimeout(() => {
            heroTitle.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 300);
    }

    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        heroSubtitle.style.opacity = '0';
        heroSubtitle.style.transform = 'translateY(20px)';

        setTimeout(() => {
            heroSubtitle.style.transition = 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s';
            heroSubtitle.style.opacity = '1';
            heroSubtitle.style.transform = 'translateY(0)';
        }, 500);
    }

    const heroButton = document.querySelector('.btn-hero');
    if (heroButton) {
        heroButton.style.opacity = '0';
        heroButton.style.transform = 'translateY(20px)';

        setTimeout(() => {
            heroButton.style.transition = 'opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s';
            heroButton.style.opacity = '1';
            heroButton.style.transform = 'translateY(0)';
        }, 700);
    }
}

// Sayfa yüklendiğinde konsola mesaj
console.log('Elfnatur script.js yüklendi');s