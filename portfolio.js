// Animation du fond étoilé avec couleurs variées
const canvas = document.getElementById('stars-bg');
const ctx = canvas.getContext('2d');
let stars = [];

// Landing: show welcome, then transition to portfolio after 3s
function initLanding() {
    const landing = document.getElementById('landing');
    const body = document.body;
    if (!landing) return;

    // Prevent background scroll jank during landing
    body.classList.add('landing-active');

    const finishLanding = () => {
        landing.classList.add('hidden');
        // Allow time for fade-out before removing visual filter
        setTimeout(() => {
            body.classList.remove('landing-active');
            body.classList.add('landing-finished');
            // Remove landing node after transition
            if (landing && landing.parentElement) {
                landing.parentElement.removeChild(landing);
            }
        }, 700);
    };

    // Auto-finish after 3 seconds
    setTimeout(finishLanding, 3000);

    // Also finish on user interaction
    ['click', 'keydown', 'touchstart'].forEach(evt => {
        window.addEventListener(evt, () => finishLanding(), { once: true, passive: true });
    });
}
initLanding();

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
    
    // Dessiner des étoiles jaunes spéciales
    drawYellowStars();
    
    for (let star of stars) {
        ctx.save();
        ctx.globalAlpha = star.alpha;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, 2 * Math.PI);
        // Couleurs variées incluant le jaune
        const colors = ['#ffffff', '#cccccc', '#ffd700', '#ffff00', '#ffeb3b', '#8a4a8a', '#5a2a5a', '#3a1a3a'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();

        // Move star (mouvement plus lent)
        star.x += star.dx * 0.3;
        star.y += star.dy * 0.3;

        // Bounce off edges
        if (star.x < 0 || star.x > canvas.width) star.dx *= -1;
        if (star.y < 0 || star.y > canvas.height) star.dy *= -1;
    }
    requestAnimationFrame(drawStars);
}

// Fonction pour dessiner des étoiles jaunes spéciales
function drawYellowStars() {
    const time = Date.now() * 0.001;
    
    for (let i = 0; i < 15; i++) {
        const x = (Math.sin(time * 0.5 + i) * 0.5 + 0.5) * canvas.width;
        const y = (Math.cos(time * 0.3 + i * 0.7) * 0.5 + 0.5) * canvas.height;
        const size = Math.sin(time * 2 + i) * 3 + 4;
        const alpha = Math.sin(time * 1.5 + i) * 0.3 + 0.7;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#ffd700';
        ctx.shadowColor = '#ffff00';
        ctx.shadowBlur = 15;
        
        // Dessiner une étoile à 5 branches
        drawStar(ctx, x, y, size, 5, 0.5);
        
        ctx.restore();
    }
}

// Fonction pour dessiner une étoile
function drawStar(ctx, x, y, radius, spikes, inset) {
    ctx.beginPath();
    ctx.moveTo(x, y - radius);
    
    for (let i = 0; i < spikes; i++) {
        const angle = (i * Math.PI * 2) / spikes;
        const innerRadius = radius * inset;
        const outerX = x + Math.cos(angle) * radius;
        const outerY = y + Math.sin(angle) * radius;
        const innerX = x + Math.cos(angle + Math.PI / spikes) * innerRadius;
        const innerY = y + Math.sin(angle + Math.PI / spikes) * innerRadius;
        
        ctx.lineTo(outerX, outerY);
        ctx.lineTo(innerX, innerY);
    }
    
    ctx.closePath();
    ctx.fill();
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

// Observer pour la navigation active
const navObserverOptions = { threshold: 0.3 };
const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Supprimer la classe active de tous les liens
            document.querySelectorAll('nav ul li a').forEach(link => {
                link.classList.remove('active');
            });
            
            // Ajouter la classe active au lien correspondant
            const sectionId = entry.target.id;
            const correspondingLink = document.querySelector(`nav ul li a[href="#${sectionId}"]`);
            if (correspondingLink) {
                correspondingLink.classList.add('active');
            }
        }
    });
}, navObserverOptions);

// Observer toutes les sections principales
document.querySelectorAll('#header, #about, #services, #portfolio, #contact').forEach((section) => {
    navObserver.observe(section);
});

// Animation des liens de navigation
document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('mouseover', (e) => {
        link.style.color = '#ffffff';
        link.style.textShadow = '0 0 10px rgba(255,255,255,0.4)';
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

// Animation des images au survol avec effet 3D et parallax
document.querySelectorAll('.work img, .about-col-1 img').forEach(img => {
    img.addEventListener('mousemove', (e) => {
        const rect = img.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Effet 3D plus subtil
        const rotateX = (y - centerY) / 15;
        const rotateY = (x - centerX) / 15;
        
        img.style.transform = `
            perspective(1000px)
            rotateX(${-rotateX}deg)
            rotateY(${rotateY}deg)
            scale3d(1.02, 1.02, 1.02)
            translateZ(10px)
        `;
        
        // Effet d'ondulation
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            pointer-events: none;
            z-index: 1;
            animation: rippleEffect 0.6s ease-out forwards;
        `;
        
        const size = 100;
        ripple.style.width = size + 'px';
        ripple.style.height = size + 'px';
        ripple.style.left = (x - size/2) + 'px';
        ripple.style.top = (y - size/2) + 'px';
        
        img.parentElement.style.position = 'relative';
        img.parentElement.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentElement) {
                ripple.parentElement.removeChild(ripple);
            }
        }, 600);
    });
    
    img.addEventListener('mouseleave', () => {
        img.style.transform = 'none';
    });
});

// Ajouter l'animation CSS pour l'effet ripple
const style = document.createElement('style');
style.textContent = `
    @keyframes rippleEffect {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

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

// --- EFFET SUR LA PHOTO AU SURVOL AVEC PARALLAX ET OMBRE DYNAMIQUE ---
const mainPhoto = document.querySelector('.main-photo');
if(mainPhoto) {
    // Créer l'élément d'ombre dynamique
    const shadowElement = document.createElement('div');
    shadowElement.className = 'dynamic-shadow';
    shadowElement.style.cssText = `
        position: absolute;
        bottom: -20px;
        left: 50%;
        width: 80%;
        height: 20px;
        background: radial-gradient(ellipse, rgba(255,215,0,0.3) 0%, transparent 70%);
        border-radius: 50%;
        transform: translateX(-50%);
        pointer-events: none;
        z-index: -1;
        transition: all 0.3s ease;
    `;
    mainPhoto.parentElement.appendChild(shadowElement);
    
    mainPhoto.addEventListener('mousemove', (e) => {
        const rect = mainPhoto.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Effet parallax plus fluide
        const rotateX = (y - centerY) / 15;
        const rotateY = (x - centerX) / 15;
        
        mainPhoto.style.transform = `
            perspective(1000px)
            rotateX(${-rotateX}deg)
            rotateY(${rotateY}deg)
            scale(1.05)
            translateZ(20px)
        `;
        
        // Ombre dynamique qui suit la souris
        const shadowX = (x / rect.width) * 100;
        const shadowY = (y / rect.height) * 100;
        const shadowSize = 120 + (Math.sin(Date.now() * 0.005) * 20);
        
        shadowElement.style.cssText = `
            position: absolute;
            bottom: -30px;
            left: ${shadowX}%;
            width: ${shadowSize}px;
            height: 30px;
            background: radial-gradient(ellipse, rgba(255,215,0,0.4) 0%, rgba(255,215,0,0.2) 50%, transparent 70%);
            border-radius: 50%;
            transform: translateX(-50%) scale(${1 + (shadowY / 200)});
            pointer-events: none;
            z-index: -1;
            transition: all 0.2s ease;
            filter: blur(5px);
        `;
        
        // Effet d'ondulation sur la photo
        const wave = document.createElement('div');
        wave.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 200px;
            height: 200px;
            background: radial-gradient(circle, rgba(255,215,0,0.2) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: -1;
            transform: translate(-50%, -50%);
            animation: wavePulse 2s ease-in-out infinite;
        `;
        
        if (!mainPhoto.parentElement.querySelector('.wave-effect')) {
            wave.className = 'wave-effect';
            mainPhoto.parentElement.appendChild(wave);
        }
    });
    
    mainPhoto.addEventListener('mouseleave', () => {
        mainPhoto.style.transform = '';
        shadowElement.style.cssText = `
            position: absolute;
            bottom: -20px;
            left: 50%;
            width: 80%;
            height: 20px;
            background: radial-gradient(ellipse, rgba(255,215,0,0.3) 0%, transparent 70%);
            border-radius: 50%;
            transform: translateX(-50%);
            pointer-events: none;
            z-index: -1;
            transition: all 0.3s ease;
        `;
        const waveEffect = mainPhoto.parentElement.querySelector('.wave-effect');
        if (waveEffect) {
            waveEffect.remove();
        }
    });
}

// Ajouter l'animation CSS pour l'effet wave
const waveStyle = document.createElement('style');
waveStyle.textContent = `
    @keyframes wavePulse {
        0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.3;
        }
        50% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.6;
        }
    }
`;
document.head.appendChild(waveStyle);

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