/**
 * ONGs Page JavaScript
 * Scripts específicos para funcionalidades da página de ONGs
 * Incluindo filtros, acessibilidade e interações
 */

// Sistema de Filtros para ONGs
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const ongCards = document.querySelectorAll('.ngo-card');
    const resultsContainer = document.querySelector('.ngos-grid');
    
    // Função para atualizar contagem de resultados (removida para melhor UX)
    function updateResultsCount(visibleCount, totalCount) {
        // Função removida conforme solicitação do usuário
        // A contagem não altera a leitura da página
        return;
    }
    
    // Função para filtrar cards
    function filterCards(category) {
        let visibleCount = 0;
        const totalCount = ongCards.length;
        
        ongCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            
            if (category === 'all' || cardCategory === category) {
                card.classList.remove('hidden');
                card.classList.add('show');
                visibleCount++;
            } else {
                card.classList.add('hidden');
                card.classList.remove('show');
            }
        });
        
        // Anunciar mudança para screen readers
        const announcement = `Filtro aplicado. ${visibleCount} ONGs sendo exibidas.`;
        announceToScreenReader(announcement);
    }
    
    // Função para anunciar mudanças para leitores de tela
    function announceToScreenReader(message) {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
        }
    }
    
    // Event listeners para botões de filtro
    filterButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover classe active de todos os botões
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Adicionar classe active ao botão clicado
            this.classList.add('active');
            
            // Aplicar filtro
            const category = this.getAttribute('data-category');
            filterCards(category);
            
            // Atualizar ARIA states
            this.setAttribute('aria-pressed', 'true');
            filterButtons.forEach(btn => {
                if (btn !== this) {
                    btn.setAttribute('aria-pressed', 'false');
                }
            });
        });
        
        // Navegação por teclado nos filtros
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Navegação por teclado entre filtros
    let currentFilterIndex = 0;
    
    document.addEventListener('keydown', function(e) {
        // Alt + F para focar nos filtros
        if (e.altKey && e.key === 'f') {
            e.preventDefault();
            filterButtons[0].focus();
            announceToScreenReader('Foco movido para os filtros de categoria');
        }
        
        // Navegação com setas quando focado nos filtros
        if (document.activeElement && document.activeElement.classList.contains('filter-btn')) {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                currentFilterIndex = (currentFilterIndex + 1) % filterButtons.length;
                filterButtons[currentFilterIndex].focus();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                currentFilterIndex = currentFilterIndex === 0 ? filterButtons.length - 1 : currentFilterIndex - 1;
                filterButtons[currentFilterIndex].focus();
            }
        }
    });
    
    // Tooltip host info functionality
    const hostTrigger = document.querySelector('.host-trigger');
    const hostTooltip = document.getElementById('host-info-tooltip');
    
    if (hostTrigger && hostTooltip) {
        // Show tooltip on hover/focus
        function showTooltip() {
            hostTooltip.setAttribute('aria-hidden', 'false');
            Object.assign(hostTooltip.style, {
                opacity: '1',
                visibility: 'visible'
            });
        }
        
        // Hide tooltip
        function hideTooltip() {
            hostTooltip.setAttribute('aria-hidden', 'true');
            Object.assign(hostTooltip.style, {
                opacity: '0',
                visibility: 'hidden'
            });
        }
        
        hostTrigger.addEventListener('mouseenter', showTooltip);
        hostTrigger.addEventListener('mouseleave', hideTooltip);
        hostTrigger.addEventListener('focus', showTooltip);
        hostTrigger.addEventListener('blur', hideTooltip);
        
        // Keyboard interaction for tooltip
        hostTrigger.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (hostTooltip.getAttribute('aria-hidden') === 'true') {
                    showTooltip();
                } else {
                    hideTooltip();
                }
            }
            if (e.key === 'Escape') {
                hideTooltip();
                hostTrigger.blur();
            }
        });
    }
    
    // Enhanced card animations with accessibility considerations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                Object.assign(entry.target.style, {
                    opacity: '1',
                    transform: 'translateY(0)'
                });
            }
        });
    }, { threshold: 0.1 });
    
    // Apply observer to cards
    ongCards.forEach(card => {
        Object.assign(card.style, {
            opacity: '0',
            transform: 'translateY(20px)',
            transition: 'all 0.6s ease-out'
        });
        observer.observe(card);
    });
});

// Enhanced accessibility features for ONGConnect platform
document.addEventListener('DOMContentLoaded', function() {
    // Announce page load
    const liveRegion = document.getElementById('live-region');
    if (liveRegion) {
        setTimeout(() => {
            liveRegion.textContent = 'Página inicial da ONGConnect carregada. Explore ONGs em destaque.';
        }, 1000);
    }
    
    // Enhanced focus management for NGO cards
    const ngoCards = document.querySelectorAll('.ngo-card');
    ngoCards.forEach(card => {
        // Add hover effect for zoom
        card.addEventListener('mouseenter', function() {
            Object.assign(this.style, {
                transform: 'scale(1.05)',
                zIndex: '10'
            });
        });
        
        card.addEventListener('mouseleave', function() {
            Object.assign(this.style, {
                transform: 'scale(1)',
                zIndex: '1'
            });
        });
        
        // Keyboard navigation
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const button = card.querySelector('.view-details-btn');
                if (button) {
                    button.click();
                }
            }
        });
        
        // Click handler for the card
        card.addEventListener('click', function(e) {
            if (e.target.classList.contains('view-details-btn')) {
                const ongId = this.getAttribute('data-ong-id');
                const ongName = this.querySelector('.card-title').textContent;
                
                const alertRegion = document.getElementById('alert-region');
                if (alertRegion) {
                    alertRegion.textContent = `Carregando página da ${ongName}...`;
                }
                
                // Navigate to NGO page
                setTimeout(() => {
                    window.location.href = `ong-detalhes.html?id=${ongId}`;
                }, 1000);
            }
        });
    });
    
    // Mobile navigation enhancement
    const navToggle = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            
            // Update screen reader announcement
            const announcement = isExpanded ? 'Menu de navegação fechado' : 'Menu de navegação aberto';
            const liveRegion = document.getElementById('live-region');
            if (liveRegion) {
                liveRegion.textContent = announcement;
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navToggle.click();
                navToggle.focus();
            }
        });
    }
    
    // Enhanced search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const query = this.value.toLowerCase().trim();
                filterCardsBySearch(query);
            }, 300);
        });
        
        function filterCardsBySearch(query) {
            const cards = document.querySelectorAll('.ngo-card');
            let visibleCount = 0;
            
            cards.forEach(card => {
                const title = card.querySelector('.card-title').textContent.toLowerCase();
                const description = card.querySelector('.card-description').textContent.toLowerCase();
                
                if (query === '' || title.includes(query) || description.includes(query)) {
                    card.classList.remove('hidden');
                    card.classList.add('show');
                    visibleCount++;
                } else {
                    card.classList.add('hidden');
                    card.classList.remove('show');
                }
            });
            
            // Announce search results
            const announcement = query === '' ? 
                'Busca limpa. Todas as ONGs visíveis.' : 
                `Busca por "${query}": ${visibleCount} ONGs encontradas.`;
            
            const liveRegion = document.getElementById('live-region');
            if (liveRegion) {
                liveRegion.textContent = announcement;
            }
        }
    }
    
    // Performance optimization: Debounced scroll handler
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            // Update navigation state based on scroll position
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                if (window.scrollY > 100) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }
        }, 10);
    });
});