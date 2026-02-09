async function loadProjectDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');

    try {
        const response = await fetch('data.json'); // تأكد أن المسار صحيح
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
    document.getElementById('project-hero').style.backgroundImage = `url('${project.cover_image || project.gallery[0].url}')`;

    // 2. تعبئة Sidebar Info
    document.getElementById('client-name').innerText = project.name; // أو اسم العميل إذا كان مختلفاً
    document.getElementById('facebook').href = project.facebook; // أو اسم العميل إذا كان مختلفاً
    document.getElementById('project-date').innerText = project.date;
    document.getElementById('client-desc').innerText = project.client_info;

    // 3. إنشاء أزرار الفلتر
    const filtersContainer = document.getElementById('filters');
    filtersContainer.innerHTML = project.filters.map((filter, index) => 
        `<button class="filter-btn ${index === 0 ? 'active' : ''}" onclick="filterGallery('${filter}', this)">
            ${filter} 
            <i class="ri-arrow-left-s-line"></i>
         </button>`
    ).join('');

    // 4. تعبئة المعرض
    renderGallery(project.gallery);
}

function renderGallery(images) {
    const galleryContainer = document.getElementById('project-gallery');
    galleryContainer.innerHTML = images.map(img => `
        <div class="gallery-item" data-tag="${img.tag}" onclick="openLightbox('${img.url}', '${img.tag}')">
            <img src="${img.url}" loading="lazy" alt="${img.tag}">
            <div class="item-overlay">
                <i class="ri-zoom-in-line"></i>
            </div>
        </div>
    `).join('');
}

// دالة الفلترة
window.filterGallery = (tag, btn) => {
    // تحديث الزر النشط
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // إظهار/إخفاء الصور
    const items = document.querySelectorAll('.gallery-item');
    items.forEach(item => {
        if (tag === "الكل" || item.dataset.tag === tag) {
            item.style.display = "block";
            setTimeout(() => item.style.opacity = "1", 50); // تأثير نعومة
        } else {
            item.style.display = "none";
            item.style.opacity = "0";
        }
    });
};

// وظائف Lightbox
window.openLightbox = (url, caption) => {
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    const cap = document.getElementById('lightbox-caption');
    
    img.src = url;
    cap.innerText = caption;
    lightbox.classList.add('active');
};

document.querySelector('.close-lightbox').onclick = () => {
    document.getElementById('lightbox').classList.remove('active');
};

// إغلاق عند الضغط خارج الصورة
document.getElementById('lightbox').onclick = (e) => {
    if(e.target.id === 'lightbox') {
        document.getElementById('lightbox').classList.remove('active');
    }
}

document.addEventListener('DOMContentLoaded', loadProjectDetails);