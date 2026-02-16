/**
 * Pixel Forge - Professional Script 2026
 * الميزات: أنميشن الظهور، عدادات، ناف بار ذكي، وفلترة فورم مع رسائل حالة ومسح بيانات
 */

document.addEventListener('DOMContentLoaded', () => {
    // تشغيل جميع الوظائف عند تحميل الصفحة
    revealSections();
    observeStats();
    handleNavbar();
    smoothScroll();
    handlePortfolioToggle();
    handleContactForm();
});

// --- 1. تأثير ظهور العناصر عند التمرير (Reveal on Scroll) ---
const revealSections = () => {
    const observerOptions = { threshold: 0.15 };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // اختياري: إيقاف المراقبة بعد الظهور لمرة واحدة لتحسين الأداء
                // observer.unobserve(entry.target); 
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
    const targetValue = parseInt(el.getAttribute('data-target') || el.innerText); // يفضل استخدام data-target
    let count = 0;
    const duration = 2000; // مدة العد بالميلي ثانية
    const increment = targetValue / (duration / 16); // تحديث كل 16ms (60fps)

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
                observer.unobserve(entry.target); // تشغيل العداد مرة واحدة فقط
            }
        });
    }, { threshold: 0.5 });

    observer.observe(statsGrid);
};

// --- 3. التحكم في الناف بار (Navbar Style) ---
const handleNavbar = () => {
    const nav = document.querySelector('.main-navbar'); // تأكد من الكلاس في HTML
    if (!nav) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
            // التنسيقات يفضل أن تكون في CSS عبر كلاس .scrolled
            nav.style.background = "rgba(255, 255, 255, 0.95)";
            nav.style.backdropFilter = "blur(10px)";
            nav.style.boxShadow = "0 5px 20px rgba(0,0,0,0.05)";
            nav.style.padding = "10px 0"; // تعديل البادينج
        } else {
            nav.classList.remove('scrolled');
            nav.style.background = "transparent";
            nav.style.boxShadow = "none";
            nav.style.padding = "20px 0"; // العودة للوضع الطبيعي
        }
    });
};

// --- 4. التنقل الناعم (Smooth Scrolling) ---
const smoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                
                // إغلاق الموبايل منيو إذا كانت مفتوحة (اختياري)
                const navLinks = document.querySelector('.nav-links');
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });
};

const handlePortfolioToggle = () => {
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (!loadMoreBtn) return;

    const btnText = loadMoreBtn.querySelector('.btn-text');
    // نفترض أن العناصر المخفية لديها كلاس .hidden-item
    const hiddenItems = document.querySelectorAll('.portfolio-item.hidden-item'); 
    
    let isExpanded = false;

    loadMoreBtn.addEventListener('click', () => {
        isExpanded = !isExpanded;

        if (isExpanded) {
            // ظهور ناعم متتابع
            hiddenItems.forEach((item, index) => {
                item.style.display = 'block'; // تأكد من عرض العنصر أولاً
                setTimeout(() => {
                    item.classList.add('show-animated');
                    item.classList.remove('hidden-item'); // إزالة كلاس الإخفاء
                }, index * 100);
            });
            if(btnText) btnText.innerText = "إظهار أقل";
            loadMoreBtn.classList.add('active');
        } else {
            // إخفاء (يمكن عكس العملية أو إعادة تحميل الصفحة ببساطة، هنا سنقوم بالإخفاء)
            // ملاحظة: الإخفاء المتتابع قد يكون معقداً في CSS، الأسهل إخفاؤهم مباشرة
            hiddenItems.forEach(item => {
                item.classList.remove('show-animated');
                item.classList.add('hidden-item');
                item.style.display = 'none';
            });
            
            if(btnText) btnText.innerText = "عرض المزيد";
            loadMoreBtn.classList.remove('active');

            // سكرول ناعم يعود لبداية المعرض
            const portfolioSection = document.getElementById('portfolio'); // تأكد من الـ ID
            if(portfolioSection) {
                portfolioSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
};

// --- 5. نظام التنبيهات (Toast Notifications) ---
const showStatus = (message, type) => {
    // إزالة أي تنبيه قديم
    const oldToast = document.querySelector('.toast-notification');
    if (oldToast) oldToast.remove();

    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    // أيقونات RemixIcon
    const iconClass = type === 'success' ? 'ri-checkbox-circle-line' : 'ri-error-warning-line';
    
    toast.innerHTML = `
        <div class="toast-content">
            <i class="${iconClass}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);

    // أنميشن الظهور
    // نستخدم requestAnimationFrame لضمان تطبيق الكلاس بعد إضافة العنصر للـ DOM
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // الإخفاء التلقائي
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300); // انتظار انتهاء أنيميشن الاختفاء
    }, 4000);
};

// --- 6. منطق نموذج الاتصال (Contact Form Logic) ---
const handleContactForm = () => {
    // دالة التحقق وإظهار الخطأ
    const markInvalid = (el) => {
        el.style.borderColor = "#ef4444"; // لون أحمر
        el.classList.add('input-error');
    };
    
    const markValid = (el) => {
        el.style.borderColor = "#e2e8f0"; // لون حدود طبيعي
        el.classList.remove('input-error');
    };

    // تعريف دالة الإرسال لتكون متاحة عالمياً (Global Scope) لاستخدامها في HTML onclick
    window.handleSend = (platform) => {
        const form = document.querySelector('.contact-form'); // أو ID محدد
        if (!form) return;

        const nameInput = document.getElementById('user_name');
        const emailInput = document.getElementById('user_email');
        const messageInput = document.getElementById('user_message');
        const serviceType = document.getElementById('service_type')?.value || "استفسار عام";

        let isFormValid = true;

        // 1. التحقق من الاسم
        if (!nameInput || !nameInput.value.trim() || nameInput.value.trim().length < 3) {
            markInvalid(nameInput);
            isFormValid = false;
        } else { 
            markValid(nameInput); 
        }

        // 2. التحقق من الإيميل (Regex بسيط)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput || !emailRegex.test(emailInput.value.trim())) {
            markInvalid(emailInput);
            isFormValid = false;
        } else { 
            markValid(emailInput); 
        }

        // 3. التحقق من الرسالة
        if (!messageInput || !messageInput.value.trim() || messageInput.value.trim().length < 10) {
            markInvalid(messageInput);
            isFormValid = false;
        } else { 
            markValid(messageInput); 
        }

        // حالة الفشل
        if (!isFormValid) {
            showStatus('يرجى ملء الحقول المطلوبة بشكل صحيح', 'error');
            return;
        }

        // تجهيز نص الرسالة
        const encodedMessage = `*طلب مشروع جديد من الموقع*%0A%0A` +
            `👤 *الاسم:* ${nameInput.value.trim()}%0A` +
            `📧 *الإيميل:* ${emailInput.value.trim()}%0A` +
            `🛠️ *الخدمة:* ${serviceType}%0A` +
            `💬 *الرسالة:* ${messageInput.value.trim()}`;

        // محاولة التوجيه (WhatsApp أو Email)
        try {
            if (platform === 'whatsapp') {
                const myPhoneNumber = "201211900052"; // رقم الواتساب
                const url = `https://wa.me/${myPhoneNumber}?text=${encodedMessage}`;
                window.open(url, '_blank');
            } else {
                const myEmail = "info@pixelforge.com"; // بريدك الإلكتروني
                const subject = encodeURIComponent(`طلب مشروع جديد: ${serviceType}`);
                const body = encodedMessage.replace(/%0A/g, '\n').replace(/\*/g, ''); // تنظيف النص للإيميل
                window.location.href = `mailto:${myEmail}?subject=${subject}&body=${body}`;
            }

            // رسالة نجاح ومسح البيانات
            showStatus('جاري توجيهك... شكراً لتواصلك معنا!', 'success');
            
            setTimeout(() => {
                form.reset(); // تصفير الحقول
                // إعادة الألوان لطبيعتها
                [nameInput, emailInput, messageInput].forEach(input => {
                    if(input) input.style.borderColor = "";
                });
            }, 1000);

        } catch (error) {
            console.error(error);
            showStatus('حدث خطأ غير متوقع، يرجى المحاولة لاحقاً', 'error');
        }
    };
};