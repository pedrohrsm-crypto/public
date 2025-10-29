/**
 * Início Page JavaScript
 * Funcionalidades específicas para a página inicial do ONGConnect
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // Menu Mobile Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            
            // Atualizar label do botão
            if (!isExpanded) {
                this.setAttribute('aria-label', 'Fechar menu de navegação');
            } else {
                this.setAttribute('aria-label', 'Abrir menu de navegação');
            }
        });
    }
    
    // Smooth Scroll para links âncora
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 100; // Compensar header fixo
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Animação de entrada para seções
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observar seções da história
    const storySections = document.querySelectorAll('.story-section');
    storySections.forEach(section => {
        observer.observe(section);
    });
    
    // Animação dos contadores nas estatísticas
    const animateCounters = () => {
        const counters = document.querySelectorAll('.stat-number, .metric-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
            const suffix = counter.textContent.replace(/[\d]/g, '');
            let current = 0;
            const increment = target / 50;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.floor(current) + suffix;
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + suffix;
                }
            };
            
            // Iniciar animação quando elemento estiver visível
            const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCounter();
                        counterObserver.unobserve(entry.target);
                    }
                });
            });
            
            counterObserver.observe(counter);
        });
    };
    
    // Inicializar animação dos contadores
    animateCounters();
    
    // Efeito parallax suave para hero
    const hero = document.querySelector('.hero-inicio');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }
    
    // Indicador de scroll no hero
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const firstSection = document.querySelector('#nossa-missao');
            if (firstSection) {
                firstSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Tooltip para informações do host
    const hostTrigger = document.querySelector('.host-trigger');
    const hostTooltip = document.querySelector('.host-tooltip');
    
    if (hostTrigger && hostTooltip) {
        hostTrigger.addEventListener('mouseenter', () => {
            hostTooltip.setAttribute('aria-hidden', 'false');
            hostTooltip.style.opacity = '1';
            hostTooltip.style.visibility = 'visible';
        });
        
        hostTrigger.addEventListener('mouseleave', () => {
            hostTooltip.setAttribute('aria-hidden', 'true');
            hostTooltip.style.opacity = '0';
            hostTooltip.style.visibility = 'hidden';
        });
        
        // Suporte a teclado
        hostTrigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const isVisible = hostTooltip.getAttribute('aria-hidden') === 'false';
                
                if (isVisible) {
                    hostTooltip.setAttribute('aria-hidden', 'true');
                    hostTooltip.style.opacity = '0';
                    hostTooltip.style.visibility = 'hidden';
                } else {
                    hostTooltip.setAttribute('aria-hidden', 'false');
                    hostTooltip.style.opacity = '1';
                    hostTooltip.style.visibility = 'visible';
                }
            }
        });
    }
    
    // Acessibilidade - Anúncios dinâmicos
    const announceToScreenReader = (message) => {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    };
    
    // Navegação por teclado melhorada
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach((link, index) => {
        link.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                const nextIndex = (index + 1) % navLinks.length;
                navLinks[nextIndex].focus();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                const prevIndex = (index - 1 + navLinks.length) % navLinks.length;
                navLinks[prevIndex].focus();
            }
        });
    });
    
    console.log('Início page JavaScript carregado com sucesso');
});

// Fallback para navegadores mais antigos
if (!window.IntersectionObserver) {
    console.warn('IntersectionObserver não suportado. Carregando polyfill...');
    // Em produção, carregaria um polyfill aqui
}