// Animation du fond étoilé rouge
const canvas = document.getElementById('stars-bg');
const ctx = canvas.getContext('2d');
let stars = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function createStars() {
    stars = [];
    for (let i = 0; i < 120; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.8 + 0.7,
            dx: (Math.random() - 0.5) * 0.3,
            dy: (Math.random() - 0.5) * 0.3,
            alpha: Math.random() * 0.5 + 0.5
        });
    }
}
createStars();

function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let star of stars) {
        ctx.save();
        ctx.globalAlpha = star.alpha;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, 2 * Math.PI);
        ctx.fillStyle = '#ff2222';
        ctx.shadowColor = '#ff2222';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();

        // Move star
        star.x += star.dx;
        star.y += star.dy;

        // Bounce off edges
        if (star.x < 0 || star.x > canvas.width) star.dx *= -1;
        if (star.y < 0 || star.y > canvas.height) star.dy *= -1;
    }
    requestAnimationFrame(drawStars);
}
drawStars();

// Animation des éléments au scroll
const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach((element) => {
    observer.observe(element);
});

// Animation des liens de navigation
document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('mouseover', (e) => {
        link.style.color = '#ff2222';
        link.style.textShadow = '0 0 10px #ff2222';
    });
    link.addEventListener('mouseleave', (e) => {
        link.style.color = '';
        link.style.textShadow = '';
    });
});

// Animation des cartes de services
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.boxShadow = `0 0 40px 10px rgba(255,34,34,${0.2 + 0.3 * (y/rect.height)})`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.boxShadow = '';
    });
});

// Animation du texte du header
const headerText = document.querySelector('.header-text h1');
if (headerText) {
    const text = headerText.textContent;
    headerText.textContent = '';
    text.split('').forEach((char, i) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.animation = `fadeInDown 0.7s ${i * 0.05}s both`;
        headerText.appendChild(span);
    });
}

// Animation des images au survol
document.querySelectorAll('.work img, .about-col-1 img').forEach(img => {
    img.addEventListener('mousemove', (e) => {
        const rect = img.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        img.style.transform = `
            perspective(1000px)
            rotateX(${(y - rect.height / 2) / 20}deg)
            rotateY(${(x - rect.width / 2) / 20}deg)
            scale3d(1.05, 1.05, 1.05)
        `;
    });
    img.addEventListener('mouseleave', () => {
        img.style.transform = 'none';
    });
});

// Animation du formulaire de contact
const form = document.querySelector('form');
if (form) {
    form.addEventListener('focusin', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            e.target.parentElement.classList.add('focused');
        }
    });
    form.addEventListener('focusout', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            e.target.parentElement.classList.remove('focused');
        }
    });
}

// Tabs About
function opentab(tabname){
    var tablinks = document.getElementsByClassName("tab-links");
    var tabcontents = document.getElementsByClassName("tab-contents");
    for(let tablink of tablinks){
        tablink.classList.remove("active-link");
    }
    for(let tabcontent of tabcontents){
        tabcontent.classList.remove("active-tab");
    }
    event.currentTarget.classList.add("active-link");
    document.getElementById(tabname).classList.add("active-tab");
}
window.opentab = opentab;

// Menu mobile
var sidemenu = document.getElementById("sidemenu");
window.openmenu = function(){
    sidemenu.style.right = "0";
}
window.closemenu = function(){
    sidemenu.style.right = "-200px";
}

// --- MODALE SERVICE ---
const serviceModal = document.getElementById('service-modal');
const serviceModalTitle = document.getElementById('service-modal-title');
const serviceModalDesc = document.getElementById('service-modal-desc');

const serviceDetails = {
    'Web Development': 'Création de sites web modernes, dynamiques et responsives avec les dernières technologies.',
    'UI/UX Design': 'Conception d\'interfaces intuitives et esthétiques pour web et mobile.',
    'Mobile App Development': 'Développement d\'applications mobiles performantes avec React Native et Flutter.',
    'Game Development': 'Création de jeux 2D/3D immersifs avec Raylib.'
};

document.querySelectorAll('.service-card a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const title = this.parentElement.querySelector('h2').textContent;
        serviceModalTitle.textContent = title;
        serviceModalDesc.textContent = serviceDetails[title] || '';
        serviceModal.style.display = 'flex';
    });
});
window.closeServiceModal = function() {
    serviceModal.style.display = 'none';
}

// --- MODALE WORK ---
const workModal = document.getElementById('work-modal');
const workModalTitle = document.getElementById('work-modal-title');
const workModalDesc = document.getElementById('work-modal-desc');
const workModalVideo = document.getElementById('work-modal-video');

const workDetails = [
    {
        title: 'Social Media App',
        desc: 'Application sociale pour partager des posts, discuter et se connecter avec des amis.',
        video: 'videos/demo_project_cpp.mov'
    },
    {
        title: 'Online Shop App',
        desc: 'Application e-commerce pour acheter et vendre des produits en ligne.',
        video: 'videos/online-shop-demo.mp4'
    },
    {
        title: 'Music App',
        desc: 'Application musicale pour écouter, partager et découvrir de la musique.',
        video: 'videos/demo_project_cpp.mov'
    }
];

document.querySelectorAll('.work .layer a').forEach((link, idx) => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const detail = workDetails[idx];
        workModalTitle.textContent = detail.title;
        workModalDesc.textContent = detail.desc;
        if(detail.video) {
            workModalVideo.src = detail.video;
            workModalVideo.style.display = 'block';
        } else {
            workModalVideo.style.display = 'none';
        }
        workModal.style.display = 'flex';
    });
});
window.closeWorkModal = function() {
    workModal.style.display = 'none';
    workModalVideo.pause();
    workModalVideo.currentTime = 0;
}

// --- SCROLL FLUIDE ---
document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if(href && href.startsWith('#')) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({behavior: 'smooth'});
        }
    });
});

// --- EFFET SUR LA PHOTO AU SURVOL ---
const mainPhoto = document.querySelector('.main-photo');
if(mainPhoto) {
    mainPhoto.addEventListener('mousemove', (e) => {
        const rect = mainPhoto.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        mainPhoto.style.transform = `scale(1.04) rotateY(${(x-rect.width/2)/18}deg) rotateX(${-(y-rect.height/2)/18}deg)`;
    });
    mainPhoto.addEventListener('mouseleave', () => {
        mainPhoto.style.transform = '';
    });
}

// --- TYPEWRITER ANIMATION ---
const typewriterTexts = [
    'Web Developer',
    'Mobile App Development',
    'Designer'
];
const typewriterElem = document.getElementById('typewriter');
let typewriterIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typewriterDelay = 80;
let typewriterPause = 1200;

function typewriterLoop() {
    if (!typewriterElem) return;
    const currentText = typewriterTexts[typewriterIndex];
    if (isDeleting) {
        typewriterElem.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
            isDeleting = false;
            typewriterIndex = (typewriterIndex + 1) % typewriterTexts.length;
            setTimeout(typewriterLoop, 400);
            return;
        }
    } else {
        typewriterElem.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === currentText.length) {
            isDeleting = true;
            setTimeout(typewriterLoop, typewriterPause);
            return;
        }
    }
    setTimeout(typewriterLoop, isDeleting ? 40 : typewriterDelay);
}
typewriterLoop();

// --- PORTFOLIO SEE MORE ---
const seeMoreBtn = document.getElementById('see-more-btn');
const workListMore = document.getElementById('work-list-more');
let moreVisible = false;

const moreWorks = [
    {
        title: 'Blog Platform',
        desc: 'Plateforme de blog moderne avec gestion des articles, commentaires et utilisateurs.',
        video: 'videos/blog-platform-demo.mp4',
        img: 'photos/photo2.png'
    },
    {
        title: 'Task Manager',
        desc: 'Application de gestion de tâches collaborative avec notifications et deadlines.',
        video: 'videos/task-manager-demo.mp4',
        img: 'photos/photo2.png'
    },
    {
        title: 'E-learning Platform',
        desc: 'Plateforme d\'apprentissage en ligne avec cours, quiz et suivi de progression.',
        video: 'videos/elearning-demo.mp4',
        img: 'photos/background.jpg'
    },
    {
        title: 'Portfolio V2',
        desc: 'Nouvelle version de mon portfolio avec animations avancées et responsive design.',
        video: 'videos/portfolio-v2-demo.mp4',
        img: 'photos/photo2.png'
    }
];

function renderMoreWorks() {
    workListMore.innerHTML = '';
    moreWorks.forEach((work, idx) => {
        const workDiv = document.createElement('div');
        workDiv.className = 'work animate-on-scroll';
        workDiv.innerHTML = `
            <img src="${work.img}">
            <div class="layer">
                <h3>${work.title}</h3>
                <p>${work.desc.substring(0, 50)}...</p>
                <a href="#" data-more-idx="${idx}"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>
            </div>
        `;
        workListMore.appendChild(workDiv);
    });
    // Ajoute les listeners pour les nouveaux boutons
    workListMore.querySelectorAll('.layer a').forEach((link, idx) => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const detail = moreWorks[idx];
            workModalTitle.textContent = detail.title;
            workModalDesc.textContent = detail.desc;
            if(detail.video) {
                workModalVideo.src = detail.video;
                workModalVideo.style.display = 'block';
            } else {
                workModalVideo.style.display = 'none';
            }
            workModal.style.display = 'flex';
        });
    });
}

seeMoreBtn.addEventListener('click', function(e) {
    e.preventDefault();
    moreVisible = !moreVisible;
    if(moreVisible) {
        renderMoreWorks();
        workListMore.style.display = 'flex';
        seeMoreBtn.textContent = 'see less';
    } else {
        workListMore.style.display = 'none';
        seeMoreBtn.textContent = 'see more';
    }
}); 