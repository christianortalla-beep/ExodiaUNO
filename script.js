// Global variables
let gameScore = 0;
let gameInterval;
let isGameRunning = false;
let currentGame = 'dragon-quest';
let currentSlide = 0;
let selectedHero = null;

// Carousel drag variables
let isDragging = false;
let startX = 0;
let currentX = 0;
let dragThreshold = 50;
let autoRotate = true;
let autoRotateInterval;

// Theme and customization variables
let currentTheme = 'dark';
let animationSpeed = 1;
let particleDensity = 'medium';

// Hero data
const heroData = {
    warrior: {
        name: 'Valiant Warrior',
        class: 'Tank • Guardian',
        description: 'A stalwart defender with unmatched defensive capabilities. The Valiant Warrior stands as an unbreakable shield, protecting allies while dealing devastating counter-attacks.',
        stats: { defense: 95, attack: 75, speed: 60 },
        abilities: ['Shield Bash', "Guardian's Aura"],
        special: 'Unbreakable Defense',
        lore: 'Forged in the fires of countless battles, this warrior has sworn to protect the innocent at any cost.'
    },
    mage: {
        name: 'Arcane Mage',
        class: 'Magic • DPS',
        description: 'A master of the arcane arts who wields devastating magical powers. The Arcane Mage can obliterate enemies with powerful spells while maintaining magical barriers.',
        stats: { defense: 40, attack: 95, speed: 80 },
        abilities: ['Fireball', 'Arcane Shield'],
        special: 'Mana Surge',
        lore: 'Trained in the ancient magical academies, this mage has unlocked the secrets of reality itself.'
    },
    archer: {
        name: 'Shadow Archer',
        class: 'Ranged • Assassin',
        description: 'A deadly marksman who strikes from the shadows. The Shadow Archer combines precision with stealth, eliminating targets before they even know they\'re in danger.',
        stats: { defense: 50, attack: 85, speed: 95 },
        abilities: ['Precise Shot', 'Shadow Step'],
        special: 'Shadow Strike',
        lore: 'Born in the depths of the dark forest, this archer has mastered the art of silent elimination.'
    },
    healer: {
        name: 'Divine Healer',
        class: 'Support • Healer',
        description: 'A blessed healer with the power to restore life and protect allies. The Divine Healer can turn the tide of battle with powerful healing and protective magic.',
        stats: { defense: 70, attack: 60, speed: 85 },
        abilities: ['Divine Light', 'Restoration'],
        special: 'Divine Blessing',
        lore: 'Chosen by the divine forces, this healer carries the light of hope and restoration.'
    },
    berserker: {
        name: 'Raging Berserker',
        class: 'Melee • DPS',
        description: 'A fearsome warrior who channels rage into devastating attacks. The Raging Berserker becomes stronger as the battle progresses, unleashing unstoppable fury.',
        stats: { defense: 80, attack: 100, speed: 70 },
        abilities: ['Rage Mode', 'Whirlwind'],
        special: 'Berserker Fury',
        lore: 'Once a peaceful warrior, this berserker was transformed by ancient battle magic into an unstoppable force.'
    }
};

// Team member data
const teamMembers = {
    'Alex Chen': {
        role: 'Lead Game Designer',
        bio: 'Alex has over 8 years of experience in game design, specializing in level design and narrative development. He has worked on multiple AAA titles and brings creative vision to every project.',
        projects: 12,
        experience: 8
    },
    'Sarah Johnson': {
        role: 'Senior Developer',
        bio: 'Sarah is a passionate C++ developer with expertise in graphics programming and game engine development. She has contributed to several successful game engines and loves optimizing performance.',
        projects: 15,
        experience: 6
    },
    'Mike Rodriguez': {
        role: 'Art Director',
        bio: 'Mike leads our art team with over 10 years of experience in 3D modeling, animation, and visual design. His work has been featured in numerous award-winning games.',
        projects: 18,
        experience: 10
    }
};

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Theme Customization Functions
function initializeThemePanel() {
    const themeToggle = document.querySelector('.theme-toggle');
    const themePanel = document.getElementById('themePanel');
    
    themeToggle.addEventListener('click', () => {
        themePanel.classList.toggle('open');
    });
    
    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
        if (!themePanel.contains(e.target) && !themeToggle.contains(e.target)) {
            themePanel.classList.remove('open');
        }
    });
}

function changeTheme(theme) {
    currentTheme = theme;
    document.body.className = `theme-${theme}`;
    
    // Update particles based on theme
    updateParticlesForTheme(theme);
    
    showNotification(`Theme changed to ${theme}`, 'success');
    trackEvent('theme_change', { theme: theme });
}

function changeAnimationSpeed(speed) {
    animationSpeed = parseFloat(speed);
    document.documentElement.style.setProperty('--animation-speed', speed);
    
    // Update carousel speed
    if (autoRotateInterval) {
        clearInterval(autoRotateInterval);
        startAutoRotation();
    }
    
    showNotification(`Animation speed: ${speed}x`, 'info');
}

function changeParticleDensity(density) {
    particleDensity = density;
    updateParticleDensity(density);
    showNotification(`Particle density: ${density}`, 'info');
}

function updateParticleDensity(density) {
    const densityMap = {
        low: 50,
        medium: 100,
        high: 200
    };
    
    if (window.pJSDom && window.pJSDom[0]) {
        window.pJSDom[0].pJS.particles.number.value = densityMap[density];
        window.pJSDom[0].pJS.fn.particlesRefresh();
    }
}

function updateParticlesForTheme(theme) {
    const themeConfigs = {
        dark: {
            color: '#ff6b35',
            opacity: 0.6
        },
        light: {
            color: '#333',
            opacity: 0.8
        },
        neon: {
            color: '#00ff88',
            opacity: 0.9
        }
    };
    
    const config = themeConfigs[theme];
    if (window.pJSDom && window.pJSDom[0]) {
        window.pJSDom[0].pJS.particles.color.value = config.color;
        window.pJSDom[0].pJS.particles.opacity.value = config.opacity;
        window.pJSDom[0].pJS.fn.particlesRefresh();
    }
}

// Live Statistics Functions
function initializeLiveStats() {
    updateLiveStats();
    setInterval(updateLiveStats, 5000); // Update every 5 seconds
}

function updateLiveStats() {
    const stats = {
        onlinePlayers: getRandomNumber(8000, 15000),
        activeServers: getRandomNumber(20, 30),
        tournaments: getRandomNumber(1, 5)
    };
    
    // Animate number changes
    animateLiveStat('onlinePlayers', stats.onlinePlayers);
    animateLiveStat('activeServers', stats.activeServers);
    animateLiveStat('tournaments', stats.tournaments);
}

function animateLiveStat(elementId, targetValue) {
    const element = document.getElementById(elementId);
    const currentValue = parseInt(element.textContent.replace(/,/g, ''));
    const increment = (targetValue - currentValue) / 20;
    let current = currentValue;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= targetValue) || (increment < 0 && current <= targetValue)) {
            current = targetValue;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, 50);
}

// Hero Comparison Functions
function selectComparisonHero(side, heroType) {
    if (!heroType) return;
    
    const heroData = getHeroComparisonData(heroType);
    const container = document.getElementById(`${side}HeroStats`);
    
    container.innerHTML = generateComparisonStatsHTML(heroData);
    
    // Animate stat bars
    setTimeout(() => {
        const bars = container.querySelectorAll('.comparison-stat-fill');
        bars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
    }, 100);
    
    showNotification(`${heroData.name} selected for comparison`, 'info');
}

function getHeroComparisonData(heroType) {
    const heroData = {
        warrior: {
            name: 'Iron Warrior',
            stats: {
                attack: 85,
                defense: 90,
                speed: 60,
                magic: 40,
                health: 100
            }
        },
        mage: {
            name: 'Crystal Mage',
            stats: {
                attack: 60,
                defense: 50,
                speed: 70,
                magic: 100,
                health: 70
            }
        },
        archer: {
            name: 'Shadow Archer',
            stats: {
                attack: 85,
                defense: 50,
                speed: 95,
                magic: 60,
                health: 75
            }
        },
        healer: {
            name: 'Divine Healer',
            stats: {
                attack: 60,
                defense: 70,
                speed: 85,
                magic: 90,
                health: 80
            }
        },
        berserker: {
            name: 'Raging Berserker',
            stats: {
                attack: 100,
                defense: 80,
                speed: 70,
                magic: 30,
                health: 90
            }
        }
    };
    
    return heroData[heroType];
}

function generateComparisonStatsHTML(heroData) {
    const stats = heroData.stats;
    let html = `<h3>${heroData.name}</h3>`;
    
    Object.entries(stats).forEach(([stat, value]) => {
        const statName = stat.charAt(0).toUpperCase() + stat.slice(1);
        html += `
            <div class="comparison-stat">
                <span class="comparison-stat-label">${statName}</span>
                <div class="comparison-stat-bar">
                    <div class="comparison-stat-fill" style="width: ${value}%"></div>
                </div>
                <span class="comparison-stat-value">${value}</span>
            </div>
        `;
    });
    
    return html;
}

// Parallax Effects
function initializeParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxLayers = document.querySelectorAll('.parallax-layer');
        
        parallaxLayers.forEach((layer, index) => {
            const speed = (index + 1) * 0.5;
            const yPos = -(scrolled * speed);
            layer.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Enhanced Initialization
function initializeWebsite() {
    showLoadingScreen();
    
    setTimeout(() => {
        hideLoadingScreen();
        initializeParticles();
        initializeSmoothScrolling();
        initializeMobileMenu();
        initializeTooltips();
        initializeAnimations();
        initializeCarousel();
        initializeThemePanel();
        initializeLiveStats();
        initializeParallax();
        
        // Initialize AOS
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
        
        showNotification('Welcome to Exodia UNO! 🎮', 'success');
    }, 2000);
}

// Enhanced Carousel Functions
function initializeCarousel() {
    const carousel = document.getElementById('heroCarousel');
    const cards = carousel.querySelectorAll('.hero-card');
    
    // Set initial active card
    updateActiveCard();
    update3DPositions();
    
    // Add click listeners to cards for navigation
    cards.forEach((card, index) => {
        card.addEventListener('click', (e) => {
            if (!isDragging) {
                goToSlide(index);
            }
        });
        
        // Add hover pause for auto-rotation
        card.addEventListener('mouseenter', () => {
            pauseAutoRotation();
        });
        
        card.addEventListener('mouseleave', () => {
            resumeAutoRotation();
        });
    });
    
    // Mouse drag support
    carousel.addEventListener('mousedown', startDrag);
    carousel.addEventListener('mousemove', drag);
    carousel.addEventListener('mouseup', endDrag);
    carousel.addEventListener('mouseleave', endDrag);
    
    // Touch support for mobile
    carousel.addEventListener('touchstart', startDrag);
    carousel.addEventListener('touchmove', drag);
    carousel.addEventListener('touchend', endDrag);
    
    // Keyboard support
    document.addEventListener('keydown', handleCarouselKeys);
    
    // Start auto-rotation
    startAutoRotation();
}

function startDrag(e) {
    isDragging = true;
    startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
    currentX = startX;
    
    // Pause auto-rotation during drag
    pauseAutoRotation();
    
    // Add dragging class
    document.getElementById('heroCarousel').classList.add('dragging');
}

function drag(e) {
    if (!isDragging) return;
    
    e.preventDefault();
    currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
}

function endDrag() {
    if (!isDragging) return;
    
    const dragDistance = currentX - startX;
    
    if (Math.abs(dragDistance) > dragThreshold) {
        if (dragDistance > 0) {
            moveCarousel(-1); // Swipe right = previous
        } else {
            moveCarousel(1);  // Swipe left = next
        }
    }
    
    isDragging = false;
    document.getElementById('heroCarousel').classList.remove('dragging');
    
    // Resume auto-rotation after a delay
    setTimeout(resumeAutoRotation, 1000);
}

function handleCarouselKeys(e) {
    // Don't interfere with form inputs
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
        return;
    }
    
    switch(e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
            e.preventDefault();
            moveCarousel(-1);
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            e.preventDefault();
            moveCarousel(1);
            break;
        case ' ':
            e.preventDefault();
            toggleAutoRotation();
            break;
    }
}

function startAutoRotation() {
    if (autoRotateInterval) clearInterval(autoRotateInterval);
    autoRotateInterval = setInterval(() => {
        if (autoRotate && !selectedHero) {
            moveCarousel(1);
        }
    }, 4000);
}

function pauseAutoRotation() {
    autoRotate = false;
}

function resumeAutoRotation() {
    autoRotate = true;
}

function toggleAutoRotation() {
    autoRotate = !autoRotate;
    if (autoRotate) {
        startAutoRotation();
        showNotification('Auto-rotation enabled', 'info');
    } else {
        showNotification('Auto-rotation disabled', 'info');
    }
}

function moveCarousel(direction) {
    const carousel = document.getElementById('heroCarousel');
    const cards = carousel.querySelectorAll('.hero-card');
    const totalSlides = cards.length;
    
    // Circular navigation - wraps around smoothly
    currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
    
    updateCarouselPosition();
    updateActiveCard();
    updateDots();
}

function goToSlide(index) {
    currentSlide = index;
    updateCarouselPosition();
    updateActiveCard();
    updateDots();
}

function updateCarouselPosition() {
    // 3D coverflow positions instead of translating the track
    update3DPositions();
}

function update3DPositions() {
    const carousel = document.getElementById('heroCarousel');
    if (!carousel) return;
    const cards = Array.from(carousel.querySelectorAll('.hero-card'));
    const total = cards.length;
    if (total === 0) return;

    const baseSpacingX = 260; // horizontal spacing between cards
    const baseDepthZ = -200;  // depth for side cards
    const extraDepthPerStep = -60; // additional depth for further cards
    const sideRotateDeg = 30; // rotation for side cards

    cards.forEach((card, index) => {
        // shortest signed distance on a circle
        let diff = (index - currentSlide + total) % total;
        if (diff > total / 2) diff -= total;
        const abs = Math.abs(diff);

        const translateX = diff * baseSpacingX;
        const translateZ = abs === 0 ? 0 : baseDepthZ + (abs - 1) * extraDepthPerStep;
        const rotateY = diff === 0 ? 0 : (diff < 0 ? sideRotateDeg : -sideRotateDeg);
        const scale = diff === 0 ? 1 : Math.max(0.7, 0.9 - (abs * 0.08));
        const opacity = diff === 0 ? 1 : Math.max(0.15, 0.85 - (abs * 0.2));

        card.style.transform = `translateX(-50%) translate3d(${translateX}px, 0, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
        card.style.opacity = String(opacity);
        card.style.zIndex = String(100 - abs); // center on top
    });
}

function updateActiveCard() {
    const cards = document.querySelectorAll('.hero-card');
    cards.forEach((card, index) => {
        card.classList.remove('active');
        if (index === currentSlide) {
            card.classList.add('active');
        }
    });
}

function updateDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.remove('active');
        if (index === currentSlide) {
            dot.classList.add('active');
        }
    });
}

// Hero Selection Functions
function selectHero(heroType) {
    selectedHero = heroType;
    const hero = heroData[heroType];
    
    // Update hero cards
    const cards = document.querySelectorAll('.hero-card');
    cards.forEach(card => {
        card.classList.remove('selected');
        if (card.dataset.hero === heroType) {
            card.classList.add('selected');
        }
    });
    
    // Update selected hero info
    updateSelectedHeroInfo(hero);
    
    // Show notification
    showNotification(`Hero selected: ${hero.name}!`, 'success');
    
    // Track selection
    trackEvent('hero_selected', {
        hero: heroType,
        hero_name: hero.name,
        hero_class: hero.class
    });
}

function updateSelectedHeroInfo(hero) {
    const infoContainer = document.getElementById('selectedHeroInfo');
    const startBtn = document.querySelector('.start-adventure-btn');
    
    infoContainer.innerHTML = `
        <div class="selected-hero-content">
            <h3>${hero.name}</h3>
            <p class="hero-class">${hero.class}</p>
            <p>${hero.description}</p>
            <div class="hero-details">
                <div class="hero-stats-detailed">
                    <div class="stat-detail">
                        <span class="stat-label">Defense</span>
                        <div class="stat-bar">
                            <div class="stat-fill" style="width: ${hero.stats.defense}%"></div>
                        </div>
                        <span class="stat-value">${hero.stats.defense}</span>
                    </div>
                    <div class="stat-detail">
                        <span class="stat-label">Attack</span>
                        <div class="stat-bar">
                            <div class="stat-fill" style="width: ${hero.stats.attack}%"></div>
                        </div>
                        <span class="stat-value">${hero.stats.attack}</span>
                    </div>
                    <div class="stat-detail">
                        <span class="stat-label">Speed</span>
                        <div class="stat-bar">
                            <div class="stat-fill" style="width: ${hero.stats.speed}%"></div>
                        </div>
                        <span class="stat-value">${hero.stats.speed}</span>
                    </div>
                </div>
                <div class="hero-abilities-detailed">
                    <h4>Abilities</h4>
                    <div class="abilities-list">
                        ${hero.abilities.map(ability => `<span class="ability-detailed">${ability}</span>`).join('')}
                    </div>
                    <h4>Special</h4>
                    <p class="special-ability">${hero.special}</p>
                </div>
                <div class="hero-lore">
                    <h4>Lore</h4>
                    <p>${hero.lore}</p>
                </div>
            </div>
            <button class="start-adventure-btn" onclick="startAdventure()">
                <i class="fas fa-play"></i>
                Start Adventure with ${hero.name}
            </button>
        </div>
    `;
    
    // Enable start button
    startBtn.disabled = false;
}

function startAdventure() {
    if (!selectedHero) {
        showNotification('Please select a hero first!', 'error');
        return;
    }
    
    const hero = heroData[selectedHero];
    
    // Show adventure start animation
    showNotification(`Starting adventure with ${hero.name}!`, 'success');
    
    // Simulate loading
    setTimeout(() => {
        showNotification('Loading adventure world...', 'success');
        
        setTimeout(() => {
            showNotification('Adventure started! Welcome to the world of Exodia UNO!', 'success');
            
            // Track adventure start
            trackEvent('adventure_started', {
                hero: selectedHero,
                hero_name: hero.name
            });
            
            // Reset selection after a delay
            setTimeout(() => {
                resetHeroSelection();
            }, 3000);
        }, 2000);
    }, 1000);
}

function resetHeroSelection() {
    selectedHero = null;
    
    // Remove selected class from all cards
    const cards = document.querySelectorAll('.hero-card');
    cards.forEach(card => {
        card.classList.remove('selected');
    });
    
    // Reset selected hero info
    const infoContainer = document.getElementById('selectedHeroInfo');
    infoContainer.innerHTML = `
        <div class="selected-hero-content">
            <h3>No Hero Selected</h3>
            <p>Choose a hero to see their detailed information and start your adventure!</p>
            <button class="start-adventure-btn" onclick="startAdventure()" disabled>
                <i class="fas fa-play"></i>
                Start Adventure
            </button>
        </div>
    `;
}

// Loading Screen Functions
function showLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    loadingScreen.style.display = 'flex';
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    loadingScreen.classList.add('hidden');
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 500);
}

// Particles.js Configuration
function initializeParticles() {
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: '#ff6b35' },
            shape: { type: 'circle' },
            opacity: { value: 0.5, random: false },
            size: { value: 3, random: true },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#ff6b35',
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 6,
                direction: 'none',
                random: false,
                straight: false,
                out_mode: 'out',
                bounce: false
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: { enable: true, mode: 'repulse' },
                onclick: { enable: true, mode: 'push' },
                resize: true
            }
        },
        retina_detect: true
    });
}

// Smooth Scrolling
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth'
        });
    }
}

// Mobile Menu
function initializeMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }
}

// Tooltips
function initializeTooltips() {
    const techIcons = document.querySelectorAll('.tech-icon[data-tooltip]');
    techIcons.forEach(icon => {
        icon.addEventListener('mouseenter', showTooltip);
        icon.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(event) {
    const tooltip = event.target.getAttribute('data-tooltip');
    const tooltipElement = document.createElement('div');
    tooltipElement.className = 'tooltip';
    tooltipElement.textContent = tooltip;
    tooltipElement.style.cssText = `
        position: absolute;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 5px;
        font-size: 0.8rem;
        z-index: 1000;
        pointer-events: none;
        white-space: nowrap;
    `;
    
    document.body.appendChild(tooltipElement);
    
    const rect = event.target.getBoundingClientRect();
    tooltipElement.style.left = rect.left + (rect.width / 2) - (tooltipElement.offsetWidth / 2) + 'px';
    tooltipElement.style.top = rect.bottom + 10 + 'px';
}

function hideTooltip() {
    const tooltips = document.querySelectorAll('.tooltip');
    tooltips.forEach(tooltip => tooltip.remove());
}

// Animations
function initializeAnimations() {
    // Animate stats on scroll
    const stats = document.querySelectorAll('.stat-number[data-target]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumber(entry.target);
                observer.unobserve(entry.target);
            }
        });
    });
    
    stats.forEach(stat => observer.observe(stat));
}

function animateNumber(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + (target >= 50 ? 'M+' : '+');
    }, 16);
}

// Game Demo Functions
function openGameDemo(gameName = 'Dragon Quest') {
    currentGame = gameName;
    const modal = document.getElementById('gameModal');
    const title = document.getElementById('modalGameTitle');
    
    title.textContent = gameName + ' - Demo';
    modal.classList.add('show');
    
    // Reset game state
    resetGame();
}

function closeGameModal() {
    const modal = document.getElementById('gameModal');
    modal.classList.remove('show');
    
    // Stop game if running
    if (isGameRunning) {
        pauseGame();
    }
}

function startGame() {
    if (!isGameRunning) {
        isGameRunning = true;
        gameInterval = setInterval(() => {
            gameScore += Math.floor(Math.random() * 10) + 1;
            document.getElementById('gameScore').textContent = gameScore;
            
            // Animate health bar
            const healthFill = document.querySelector('.health-fill');
            const currentWidth = parseInt(healthFill.style.width) || 80;
            const newWidth = Math.max(20, currentWidth - Math.random() * 5);
            healthFill.style.width = newWidth + '%';
            
            // Game over condition
            if (newWidth <= 20) {
                pauseGame();
                showNotification('Game Over! Final Score: ' + gameScore, 'error');
            }
        }, 1000);
        
        showNotification('Game Started!', 'success');
    }
}

function pauseGame() {
    if (isGameRunning) {
        isGameRunning = false;
        clearInterval(gameInterval);
        showNotification('Game Paused', 'success');
    }
}

function resetGame() {
    pauseGame();
    gameScore = 0;
    document.getElementById('gameScore').textContent = '0';
    document.querySelector('.health-fill').style.width = '80%';
}

// Team Member Functions
function showTeamMember(memberName) {
    const modal = document.getElementById('teamModal');
    const member = teamMembers[memberName];
    
    if (member) {
        document.getElementById('teamMemberName').textContent = memberName;
        document.getElementById('memberRole').textContent = member.role;
        document.getElementById('memberBio').textContent = member.bio;
        document.getElementById('memberProjects').textContent = member.projects;
        document.getElementById('memberExperience').textContent = member.experience;
        
        modal.classList.add('show');
    }
}

function closeTeamModal() {
    const modal = document.getElementById('teamModal');
    modal.classList.remove('show');
}

// Contact Form Functions
function submitContactForm(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };
    
    // Simulate form submission
    showNotification('Sending message...', 'success');
    
    setTimeout(() => {
        showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
        event.target.reset();
    }, 2000);
}

// Newsletter Functions
function subscribeNewsletter(event) {
    event.preventDefault();
    
    const email = event.target.querySelector('input[type="email"]').value;
    
    // Simulate subscription
    showNotification('Subscribing to newsletter...', 'success');
    
    setTimeout(() => {
        showNotification('Successfully subscribed to our newsletter!', 'success');
        event.target.reset();
    }, 1500);
}

// Career Functions
function applyForPosition(position) {
    showNotification(`Application for ${position} submitted! We'll review your profile and get back to you.`, 'success');
}

// Social Media Functions
function openSocialLink(platform) {
    const links = {
        twitter: 'https://twitter.com/exodiauno',
        discord: 'https://discord.gg/exodiauno',
        youtube: 'https://youtube.com/exodiauno',
        linkedin: 'https://linkedin.com/company/exodiauno'
    };
    
    if (links[platform]) {
        window.open(links[platform], '_blank');
    }
}

// Footer Functions
function showComingSoon() {
    showNotification('New games coming soon! Stay tuned for updates.', 'success');
}

function downloadPressKit() {
    showNotification('Press kit download started...', 'success');
    // Simulate download
    setTimeout(() => {
        showNotification('Press kit downloaded successfully!', 'success');
    }, 2000);
}

function showInvestorInfo() {
    showNotification('Investor information page coming soon!', 'success');
}

function openHelpCenter() {
    showNotification('Help center will be available soon!', 'success');
}

function openCommunity() {
    showNotification('Join our Discord community for updates!', 'success');
}

function reportBug() {
    showNotification('Bug report submitted! Our team will investigate.', 'success');
}

function openFeedback() {
    showNotification('Thank you for your feedback!', 'success');
}

function showPrivacyPolicy() {
    showNotification('Privacy policy page coming soon!', 'success');
}

function showTermsOfService() {
    showNotification('Terms of service page coming soon!', 'success');
}

function showCookiePolicy() {
    showNotification('Cookie policy page coming soon!', 'success');
}

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const messageElement = notification.querySelector('.notification-message');
    
    notification.className = `notification ${type}`;
    messageElement.textContent = message;
    
    notification.classList.add('show');
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
}

// Utility Functions
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Don't interfere with form inputs
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.isContentEditable) {
        return;
    }
    
    // ESC to close modals
    if (event.key === 'Escape') {
        const gameModal = document.getElementById('gameModal');
        const teamModal = document.getElementById('teamModal');
        const authModal = document.getElementById('authModal'); // Added auth modal
        
        if (gameModal.classList.contains('show')) {
            closeGameModal();
        }
        if (teamModal.classList.contains('show')) {
            closeTeamModal();
        }
        if (authModal.classList.contains('active')) { // Added auth modal
            closeAuthModal();
        }
    }
    
    // Space to start/pause game
    if (event.key === ' ' && document.getElementById('gameModal').classList.contains('show')) {
        event.preventDefault();
        if (isGameRunning) {
            pauseGame();
        } else {
            startGame();
        }
    }
    
    // Arrow keys for carousel
    if (event.key === 'ArrowLeft') {
        moveCarousel(-1);
    }
    if (event.key === 'ArrowRight') {
        moveCarousel(1);
    }
});

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    const gameModal = document.getElementById('gameModal');
    const teamModal = document.getElementById('teamModal');
    const authModal = document.getElementById('authModal'); // Added auth modal
    
    if (event.target === gameModal) {
        closeGameModal();
    }
    if (event.target === teamModal) {
        closeTeamModal();
    }
    if (event.target === authModal) { // Added auth modal
        closeAuthModal();
    }
});

// Performance optimization
let scrollTimeout;
window.addEventListener('scroll', function() {
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    
    scrollTimeout = setTimeout(() => {
        // Optimize particles on scroll
        if (window.pJSDom && window.pJSDom[0]) {
            window.pJSDom[0].pJS.pJS.fn.pauseAnim();
            setTimeout(() => {
                window.pJSDom[0].pJS.pJS.fn.playAnim();
            }, 100);
        }
    }, 100);
});

// Analytics simulation
function trackEvent(eventName, data = {}) {
    console.log('Analytics Event:', eventName, data);
    // In a real implementation, this would send data to analytics service
}

// Track user interactions
document.addEventListener('click', function(event) {
    if (event.target.matches('.cta-button, .game-item, .team-member, .apply-btn')) {
        trackEvent('button_click', {
            element: event.target.textContent.trim(),
            section: event.target.closest('section')?.id || 'unknown'
        });
    }
});

// Initialize tracking
trackEvent('page_view', {
    page: 'home',
    timestamp: new Date().toISOString()
});

        // Toggle Stats Dashboard Minimize Function
        function toggleStatsDashboard() {
            const statsDashboard = document.getElementById('liveStats');
            const minimizeBtn = statsDashboard.querySelector('.minimize-btn i');
            
            if (statsDashboard.classList.contains('minimized')) {
                // Expand the dashboard
                statsDashboard.classList.remove('minimized');
                minimizeBtn.className = 'fas fa-minus';
                minimizeBtn.parentElement.title = 'Minimize';
                showNotification('Stats dashboard expanded', 'info');
            } else {
                // Minimize the dashboard
                statsDashboard.classList.add('minimized');
                minimizeBtn.className = 'fas fa-plus';
                minimizeBtn.parentElement.title = 'Expand';
                showNotification('Stats dashboard minimized', 'info');
            }
        }

        // Function to show/hide the entire live stats dashboard
        function toggleLiveStatsVisibility() {
            const statsDashboard = document.getElementById('liveStats');
            if (statsDashboard.style.display === 'none' || statsDashboard.style.display === '') {
                statsDashboard.style.display = 'block';
                showNotification('Live stats dashboard shown', 'info');
            } else {
                statsDashboard.style.display = 'none';
                showNotification('Live stats dashboard hidden', 'info');
            }
        }

        // Authentication System
        let currentUser = null;
        let isAuthenticated = false;

        // Check if user is already logged in on page load
        document.addEventListener('DOMContentLoaded', function() {
            checkAuthStatus();
        });

        function showAuthBlocker() {
            document.getElementById('authBlocker').style.display = 'block';
        }
        function hideAuthBlocker() {
            document.getElementById('authBlocker').style.display = 'none';
        }

        function checkAuthStatus() {
            const savedUser = localStorage.getItem('exodiaUser');
            if (savedUser) {
                currentUser = JSON.parse(savedUser);
                isAuthenticated = true;
                updateAuthUI();
                hideAuthBlocker();
                showNotification(`Welcome back, ${currentUser.username}!`, 'success');
            } else {
                showAuthBlocker();
                setTimeout(() => {
                    openAuthModal();
                }, 2000);
            }
        }

        function openAuthModal() {
            const modal = document.getElementById('authModal');
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Ensure form inputs can receive focus
            setTimeout(() => {
                const firstInput = modal.querySelector('input');
                if (firstInput) {
                    firstInput.focus();
                }
            }, 100);
        }

        function closeAuthModal() {
            const modal = document.getElementById('authModal');
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
            hideAuthBlocker();
        }

        function switchAuthTab(tab) {
            const loginTab = document.getElementById('loginTab');
            const signupTab = document.getElementById('signupTab');
            const loginForm = document.getElementById('loginForm');
            const signupForm = document.getElementById('signupForm');

            if (tab === 'login') {
                loginTab.classList.add('active');
                signupTab.classList.remove('active');
                loginForm.classList.add('active');
                signupForm.classList.remove('active');
            } else {
                signupTab.classList.add('active');
                loginTab.classList.remove('active');
                signupForm.classList.add('active');
                loginForm.classList.remove('active');
            }
        }

        // Store user credentials in localStorage under 'exodiaUserAccount'
        function handleSignup(event) {
            event.preventDefault();

            // Clear all field errors
            ['errorFullName','errorEmail','errorPassword','errorConfirmPassword','errorPhone','errorTerms'].forEach(id => {
                document.getElementById(id).textContent = '';
            });

            const fullName = document.getElementById('signupFullName').value.trim();
            const email = document.getElementById('signupEmail').value.trim();
            const phone = document.getElementById('signupPhone').value.trim();
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const agreeTerms = document.getElementById('agreeTerms').checked;

            let hasError = false;

            if (!fullName) {
                document.getElementById('errorFullName').textContent = 'Full name is required.';
                hasError = true;
            }
            if (!email) {
                document.getElementById('errorEmail').textContent = 'Email is required.';
                hasError = true;
            }
            if (!phone) {
                document.getElementById('errorPhone').textContent = 'Phone number is required.';
                hasError = true;
            }
            if (!password) {
                document.getElementById('errorPassword').textContent = 'Password is required.';
                hasError = true;
            } else if (password.length < 6) {
                document.getElementById('errorPassword').textContent = 'Password must be at least 6 characters.';
                hasError = true;
            }
            if (!confirmPassword) {
                document.getElementById('errorConfirmPassword').textContent = 'Please confirm your password.';
                hasError = true;
            } else if (password !== confirmPassword) {
                document.getElementById('errorConfirmPassword').textContent = 'Passwords do not match.';
                hasError = true;
            }
            if (!agreeTerms) {
                document.getElementById('errorTerms').textContent = 'You must agree to the terms.';
                hasError = true;
            }

            if (hasError) return;

            // Save credentials to localStorage
            const account = { fullName, email, phone, password };
            localStorage.setItem('exodiaUserAccount', JSON.stringify(account));

            showNotification('Creating account...', 'info');
            setTimeout(() => {
                currentUser = {
                    fullName: fullName,
                    email: email,
                    phone: phone,
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName)}`
                };
                isAuthenticated = true;
                localStorage.setItem('exodiaUser', JSON.stringify(currentUser));
                updateAuthUI();
                showNotification(`Account created! Welcome, ${fullName}!`, 'success');
                document.getElementById('signupForm').reset();
                closeAuthModal();
            }, 1500);
        }

        function handleLogin(event) {
            event.preventDefault();
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;
            const loginError = document.getElementById('loginError');

            if (loginError) loginError.style.display = 'none';

            // Fetch credentials from localStorage
            const accountStr = localStorage.getItem('exodiaUserAccount');
            if (!accountStr) {
                showNotification('No account found. Please sign up first.', 'error');
                if (loginError) {
                    loginError.textContent = 'No account found. Please sign up first.';
                    loginError.style.display = 'block';
                }
                return;
            }
            const account = JSON.parse(accountStr);

            // Validate credentials
            if (email !== account.email || password !== account.password) {
                showNotification('Invalid email or password', 'error');
                if (loginError) {
                    loginError.textContent = 'Invalid email or password.';
                    loginError.style.display = 'block';
                }
                return;
            }

            showNotification('Logging in...', 'info');
            setTimeout(() => {
                currentUser = {
                    fullName: account.fullName,
                    email: account.email,
                    phone: account.phone,
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(account.fullName)}`
                };
                isAuthenticated = true;
                localStorage.setItem('exodiaUser', JSON.stringify(currentUser));
                updateAuthUI();
                closeAuthModal();
                showNotification(`Welcome back, ${account.fullName}!`, 'success');
                document.getElementById('loginForm').reset();
            }, 1200);
        }

        function updateAuthUI() {
            const loginBtn = document.getElementById('loginBtn');
            const userProfileBtn = document.getElementById('userProfileBtn');
            const userNameSpan = document.getElementById('userName');
            if (isAuthenticated && currentUser) {
                loginBtn.style.display = 'none';
                userProfileBtn.style.display = 'flex';
                userNameSpan.textContent = currentUser.fullName;
            } else {
                loginBtn.style.display = 'inline-block';
                userProfileBtn.style.display = 'none';
            }
        }

        function logout() {
            isAuthenticated = false;
            currentUser = null;
            updateAuthUI();
            showNotification('You have been logged out.', 'info');
        }

        function deleteAccount() {
            localStorage.removeItem('exodiaUserAccount');
            localStorage.removeItem('exodiaUser');
            showNotification('Account deleted. You must sign up again to access the site.', 'info');
            isAuthenticated = false;
            currentUser = null;
            updateAuthUI();
            showAuthBlocker();
            openAuthModal();
        }

        // Close modal when clicking outside - DISABLED for security
        // document.addEventListener('click', function(event) {
        //     const modal = document.getElementById('authModal');
        //     if (event.target === modal) {
        //         closeAuthModal();
        //     }
        // });

        // Close modal with Escape key - DISABLED for security
        // document.addEventListener('keydown', function(event) {
        //     if (event.key === 'Escape') {
        //         closeAuthModal();
        //     }
        // });

        // User profile button click handler
        document.getElementById('userProfileBtn').addEventListener('click', function() {
            if (isAuthenticated) {
                // Show user profile dropdown or modal
                showNotification(`Logged in as ${currentUser.username}`, 'info');
            }
        });


