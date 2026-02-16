document.addEventListener('DOMContentLoaded', () => {
    // --- 1. ميزة تكبير الصور (Image Lightbox) ---
    const cards = document.querySelectorAll('.project-card');
    
    // إنشاء عنصر المودال للصور برمجياً إذا لم يكن موجوداً
    const imageModal = document.createElement('div');
    imageModal.id = 'imageLightbox';
    imageModal.className = 'image-modal';
    imageModal.innerHTML = `
        <span class="close-lightbox">&times;</span>
        <img class="modal-img" id="fullImage">
        <div id="caption"></div>
    `;
    document.body.appendChild(imageModal);

    const modalImg = document.getElementById("fullImage");
    const captionText = document.getElementById("caption");

    // إضافة حدث الضغط على الصور داخل الكروت
    document.querySelectorAll('.media-container img').forEach(img => {
        img.style.cursor = 'zoom-in';
        img.onclick = function() {
            imageModal.style.display = "flex";
            modalImg.src = this.src;
            captionText.innerHTML = this.alt;
            document.body.style.overflow = 'hidden'; // منع التمرير عند فتح الصورة
        }
    });

    // إغلاق مودال الصور
    imageModal.onclick = function(e) {
        if (e.target !== modalImg) {
            imageModal.style.display = "none";
            document.body.style.overflow = 'auto';
        }
    };

    // --- 2. أنيميشن ظهور العناصر عند التمرير (Scroll Reveal) ---
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
            }
        });
    }, observerOptions);

    cards.forEach((card, index) => {
        card.classList.add('reveal-hidden');
        card.style.transitionDelay = `${index * 0.1}s`; // ظهور تتابعي
        observer.observe(card);
    });

    // --- 3. حركة تتبع الماوس (Tilt Effect) ---
    
});

// دالة الفيديو الموجودة مسبقاً مع تحسين
function openVideo(videoUrl) {
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('videoFrame');
    iframe.src = videoUrl; 
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeVideo() {
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('videoFrame');
    iframe.src = ""; 
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}