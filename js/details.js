async function loadProjectDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');

    try {
        const response = await fetch('data.json'); 
        const data = await response.json();
        const project = data.projects[projectId];

        if (!project) {
            document.body.innerHTML = "<h1 style='text-align:center; padding:50px;'>عذراً، المشروع غير موجود</h1>";
            return;
        }

        renderPage(project);
    } catch (error) {
        console.error("Error loading project:", error);
    }
}

function renderPage(project) {
    document.title = `${project.name} | Pixel Forge`;

    // 1. تعبئة Hero Section
    document.getElementById('hero-title').innerText = project.name;
    document.getElementById('hero-category').innerText = project.category;
    
    // استخدام صورة الغلاف أو أول صورة في المعرض كخلفية
    const coverImg = project.cover_image || (project.gallery[0] ? project.gallery[0].url : '');
    document.getElementById('project-hero').style.backgroundImage = `url('${coverImg}')`;

    // 2. تعبئة Sidebar Info
    document.getElementById('client-name').innerText = project.name;
    document.getElementById('project-date').innerText = project.date;
    document.getElementById('client-desc').innerText = project.client_info;

    // --- منطق ذكي للروابط الاجتماعية ---
    const socialLink = document.getElementById('facebook');
    if (project.insta) {
        socialLink.href = project.insta;
        socialLink.innerHTML = `<i class="ri-instagram-line"></i> <strong>الانتقال إلى إنستجرام</strong>`;
    } else if (project.facebook) {
        socialLink.href = project.facebook;
        socialLink.innerHTML = `<i class="ri-facebook-box-line"></i> <strong>الانتقال إلى صفحة الفيس</strong>`;
    } else {
        socialLink.parentElement.style.display = 'none'; // إخفاء العنصر إذا لم يوجد رابط
    }

    // 3. إنشاء أزرار الفلتر
    const filtersContainer = document.getElementById('filters');
    if (project.filters) {
        filtersContainer.innerHTML = project.filters.map((filter, index) => 
            `<button class="filter-btn ${index === 0 ? 'active' : ''}" onclick="filterGallery('${filter}', this)">
                ${filter} 
                <i class="ri-arrow-left-s-line"></i>
             </button>`
        ).join('');
    }

    // 4. تعبئة المعرض
    renderGallery(project.gallery);
}

function renderGallery(items) {
    const galleryContainer = document.getElementById('project-gallery');
    
    galleryContainer.innerHTML = items.map(item => {
        // التحقق مما إذا كان الملف فيديو
        const isVideo = item.url.toLowerCase().match(/\.(mp4|webm|ogg)$/);

        if (isVideo) {
            return `
                <div class="gallery-item video-item" data-tag="${item.tag}" onclick="openLightbox('${item.url}', '${item.tag}', true)">
                    <video muted loop onmouseover="this.play()" onmouseout="this.pause()">
                        <source src="${item.url}" type="video/mp4">
                    </video>
                    <div class="item-overlay">
                        <i class="ri-play-circle-line"></i>
                    </div>
                </div>`;
        } else {
            return `
                <div class="gallery-item" data-tag="${item.tag}" onclick="openLightbox('${item.url}', '${item.tag}', false)">
                    <img src="${item.url}" loading="lazy" alt="${item.tag}">
                    <div class="item-overlay">
                        <i class="ri-zoom-in-line"></i>
                    </div>
                </div>`;
        }
    }).join('');
}

// وظائف Lightbox المحدثة لدعم الفيديو
window.openLightbox = (url, caption, isVideo) => {
    const lightbox = document.getElementById('lightbox');
    const imgHolder = document.getElementById('lightbox-img');
    const cap = document.getElementById('lightbox-caption');
    
    // تنظيف أي فيديو سابق
    const oldVideo = lightbox.querySelector('video');
    if (oldVideo) oldVideo.remove();

    if (isVideo) {
        imgHolder.style.display = 'none';
        const videoElement = document.createElement('video');
        videoElement.src = url;
        videoElement.controls = true;
        videoElement.autoplay = true;
        videoElement.classList.add('lightbox-video');
        lightbox.insertBefore(videoElement, cap);
    } else {
        imgHolder.style.display = 'block';
        imgHolder.src = url;
    }

    cap.innerText = caption;
    lightbox.classList.add('active');
};

// إغلاق الـ Lightbox
function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    const video = lightbox.querySelector('video');
    if (video) video.pause(); // إيقاف الفيديو عند الإغلاق
}

document.querySelector('.close-lightbox').onclick = closeLightbox;

document.getElementById('lightbox').onclick = (e) => {
    if(e.target.id === 'lightbox') closeLightbox();
}

// دالة الفلترة
window.filterGallery = (tag, btn) => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const items = document.querySelectorAll('.gallery-item');
    items.forEach(item => {
        if (tag === "الكل" || item.dataset.tag === tag) {
            item.style.display = "block";
            setTimeout(() => item.style.opacity = "1", 50);
        } else {
            item.style.display = "none";
            item.style.opacity = "0";
        }
    });
};

document.addEventListener('DOMContentLoaded', loadProjectDetails);