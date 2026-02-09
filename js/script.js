/**
 * Pixel Forge - Professional Script 2026
 * الميزات: أنميشن الظهور، عدادات، ناف بار ذكي، وفلترة فورم مع رسائل حالة ومسح بيانات
 */

// --- 1. تأثير ظهور العناصر عند التمرير (Reveal on Scroll) ---
const revealSections = () => {
    const observerOptions = { threshold: 0.15 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    const targets = document.querySelectorAll(`
        .hero-section, .about-section, .services-section, 
        .partners-section, .portfolio-grid-section, 
        .testimonials-section, .contact-section, 
        .service-card, .testimonial-card, .portfolio-item
    `);

    targets.forEach(target => {
        target.classList.add('reveal'); 
        observer.observe(target);
    });
};

// --- 2. عداد الأرقام (Counter Animation) ---
const startCounter = (el) => {
    const targetValue = parseInt(el.innerText);
    let count = 0;
    const duration = 2000;
    const increment = targetValue / (duration / 16);

    const updateCount = () => {
        count += increment;
        if (count < targetValue) {
            el.innerText = Math.ceil(count) + (el.innerText.includes('+') ? '+' : (el.innerText.includes('%') ? '%' : ''));
            requestAnimationFrame(updateCount);
        } else {
            el.innerText = targetValue + (el.innerText.includes('+') ? '+' : (el.innerText.includes('%') ? '%' : ''));
        }
    };
    updateCount();
};

const observeStats = () => {
    const statsGrid = document.querySelector('.stats-grid');
    if (!statsGrid) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.querySelectorAll('.counter').forEach(num => startCounter(num));
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    observer.observe(statsGrid);
};

// --- 3. التحكم في الناف بار (Navbar Style) ---
const handleNavbar = () => {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.background = "rgba(255, 255, 255, 0.95)";
            nav.style.backdropFilter = "blur(10px)";
            nav.style.boxShadow = "0 5px 20px rgba(0,0,0,0.05)";
            nav.style.padding = "10px 8%";
            nav.style.position="fixed" 
         } else {
            nav.style.background = "none";
             nav.style.boxShadow = "none";
            // nav.style.padding = "20px 8%";
    
         }
    });
};

// --- 4. التنقل الناعم (Smooth Scrolling) ---
const smoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
};

const handlePortfolioToggle = () => {
    const loadMoreBtn = document.getElementById('load-more-btn');
    const btnText = loadMoreBtn?.querySelector('.btn-text');
    const hiddenItems = document.querySelectorAll('.portfolio-item.hidden-item');
    
    if (!loadMoreBtn) return;

    let isExpanded = false;

    loadMoreBtn.addEventListener('click', () => {
        isExpanded = !isExpanded;

        if (isExpanded) {
            // ظهور ناعم متتابع
            hiddenItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('show-animated');
                }, index * 100); // تأخير 100ms بين كل عنصر
            });
            btnText.innerText = "إظهار أقل";
            loadMoreBtn.classList.add('active');
        } else {
            // إخفاء ناعم متتابع (عكسي)
            [...hiddenItems].reverse().forEach((item, index) => {
                setTimeout(() => {
                    item.classList.remove('show-animated');
                }, index * 50);
            });
            btnText.innerText = "عرض المزيد";
            loadMoreBtn.classList.remove('active');

            // سكرول ناعم يعود للمكان الصحيح
            setTimeout(() => {
                document.getElementById('portfolio').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 400);
        }
    });
};

// تشغيل الدالة


// لا تنسَ استدعاء الدالة داخل المستمع الأصلي
document.addEventListener('DOMContentLoaded', () => {
    // ... وظائفك السابقة ...
   
});
// --- 5. نظام التنبيهات (Toast Notifications) ---
const showStatus = (message, type) => {
    // إزالة أي تنبيه قديم
    const oldToast = document.querySelector('.toast-notification');
    if (oldToast) oldToast.remove();

    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.innerHTML = `
        <i class="${type === 'success' ? 'ri-checkbox-circle-line' : 'ri-error-warning-line'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);

    // أنميشن الظهور والاختفاء
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, 4000);
};

// --- 6. منطق الإرسال، الفلترة، ومسح البيانات ---
const handleContactForm = () => {
    window.handleSend = (platform) => {
        const form = document.getElementById('smart-contact-form');
        const nameInput = document.getElementById('user_name');
        const emailInput = document.getElementById('user_email');
        const messageInput = document.getElementById('user_message');
        const serviceType = document.getElementById('service_type')?.value || "استفسار عام";

        let isFormValid = true;

        // التحقق من الاسم
        if (!nameInput.value.trim() || nameInput.value.trim().length < 3) {
            markInvalid(nameInput);
            isFormValid = false;
        } else { markValid(nameInput); }

        // التحقق من الإيميل
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
            markInvalid(emailInput);
            isFormValid = false;
        } else { markValid(emailInput); }

        // التحقق من الرسالة
        if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
            markInvalid(messageInput);
            isFormValid = false;
        } else { markValid(messageInput); }

        // حالة الفشل
        if (!isFormValid) {
            showStatus('يرجى التحقق من الحقول المحددة باللون الأحمر', 'error');
            return;
        }

        // تجهيز النص
        const encodedMessage = `*طلب مشروع جديد من الموقع*%0A%0A` +
            `👤 *الاسم:* ${nameInput.value.trim()}%0A` +
            `📧 *الإيميل:* ${emailInput.value.trim()}%0A` +
            `🛠️ *الخدمة:* ${serviceType}%0A` +
            `💬 *الرسالة:* ${messageInput.value.trim()}`;

        // محاولة الإرسال
        try {
            if (platform === 'whatsapp') {
                const myPhoneNumber = "201211900052"; 
                window.open(`https://wa.me/${myPhoneNumber}?text=${encodedMessage}`, '_blank');
            } else {
                const myEmail = "#";
                const subject = encodeURIComponent(`مشروع جديد: ${serviceType}`);
                const body = encodedMessage.replace(/%0A/g, '\n').replace(/\*/g, '');
                window.location.href = `mailto:${myEmail}?subject=${subject}&body=${body}`;
            }

            // حالة النجاح
            showStatus('تم توجيه طلبك بنجاح!', 'success');
            
            // مسح البيانات وتصفير الفورم
            form.reset(); 
            // إزالة كلاسات التحقق الأخضر إذا وجدت
            document.querySelectorAll('.input-group').forEach(group => group.classList.remove('invalid'));

        } catch (error) {
            showStatus('حدث خطأ أثناء محاولة الإرسال', 'error');
        }
    };

    const markInvalid = (el) => el.parentElement.classList.add('invalid');
    const markValid = (el) => el.parentElement.classList.remove('invalid');
};

// --- تشغيل كل شيء ---
document.addEventListener('DOMContentLoaded', () => {
    revealSections();
    observeStats();
    handleNavbar();
    smoothScroll();
    handlePortfolioToggle();
    handleContactForm();
});