/**
 * VOLUNTEER PORTAL FUNCTIONALITY
 * Handles volunteer portal interactions, opportunity search, 
 * filtering, and application processes.
 */

(function() {
    'use strict';

    // State management
    let currentFilters = {
        search: '',
        category: '',
        location: '',
        time: ''
    };

    let opportunities = [];
    let filteredOpportunities = [];
    let currentPage = 1;
    const itemsPerPage = 6;

    // DOM elements
    const searchInput = document.getElementById('search-opportunities');
    const categoryFilter = document.getElementById('category-filter');
    const locationFilter = document.getElementById('location-filter');
    const timeFilter = document.getElementById('time-filter');
    const opportunitiesGrid = document.querySelector('.opportunities-grid');
    const loadMoreBtn = document.querySelector('.load-more-section button');
    const liveRegion = document.getElementById('live-region');

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        initializePortal();
        setupEventListeners();
        loadOpportunities();
    });

    /**
     * Initialize volunteer portal
     */
    function initializePortal() {
        // Set up lazy loading for images
        if ('IntersectionObserver' in window) {
            setupLazyLoading();
        }

        // Initialize category card interactions
        setupCategoryCards();

        // Setup search debouncing
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', function() {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(performSearch, 300);
            });
        }

        // Announce page load for screen readers
        announceToScreenReader('Portal do voluntário carregado. Use as setas ou Tab para navegar pelas oportunidades.');
    }

    /**
     * Setup event listeners
     */
    function setupEventListeners() {
        // Filter change listeners
        [categoryFilter, locationFilter, timeFilter].forEach(filter => {
            if (filter) {
                filter.addEventListener('change', handleFilterChange);
            }
        });

        // Category card clicks
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', function() {
                const category = this.dataset.category;
                filterByCategory(category);
            });

            // Keyboard navigation
            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });

            // Make cards focusable
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
        });

        // Load more button
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', loadMoreOpportunities);
        }

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Focus management for accessibility
                    if (target.hasAttribute('tabindex')) {
                        target.focus();
                    }
                }
            });
        });
    }

    /**
     * Setup lazy loading for images
     */
    function setupLazyLoading() {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    /**
     * Setup category card interactions
     */
    function setupCategoryCards() {
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-4px) scale(1.02)';
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    /**
     * Load opportunities data
     */
    function loadOpportunities() {
        // Simulated data - In real app, this would be an API call
        opportunities = [
            {
                id: 1,
                title: "Professor de Reforço Escolar - Matemática",
                description: "Procuramos voluntários para dar aulas de reforço de matemática para crianças de 8 a 12 anos em comunidade carente.",
                ongName: "Instituto Educação para Todos",
                ongLogo: "../assets/images/ongs/instituto-educacao.jpg",
                rating: 4.8,
                location: "Cidade Tiradentes - SP",
                schedule: "Sábados, 14h às 17h",
                vacancies: 3,
                category: "educacao",
                tags: ["Educação", "Matemática", "Crianças"],
                impact: "45 crianças beneficiadas",
                badge: "urgent",
                urgent: true
            },
            {
                id: 2,
                title: "Apoio em Campanha de Vacinação",
                description: "Ajude na organização e apoio logístico de campanha de vacinação em comunidades rurais da Grande São Paulo.",
                ongName: "ONG Saúde e Vida",
                ongLogo: "../assets/images/ongs/ong-saude.jpg",
                rating: 4.6,
                location: "Grande São Paulo - SP",
                schedule: "Finais de semana",
                vacancies: 10,
                category: "saude",
                tags: ["Saúde", "Prevenção", "Comunidade"],
                impact: "200+ pessoas beneficiadas",
                badge: "featured",
                featured: true
            },
            {
                id: 3,
                title: "Designer Voluntário para Campanhas Ambientais",
                description: "Criação de materiais gráficos para campanhas de conscientização ambiental. Trabalho 100% remoto e flexível.",
                ongName: "Verde Futuro",
                ongLogo: "../assets/images/ongs/verde-futuro.jpg",
                rating: 4.9,
                location: "100% Remoto",
                schedule: "Horário flexível",
                vacancies: 2,
                category: "meio-ambiente",
                tags: ["Meio Ambiente", "Design", "Remoto"],
                impact: "Alcance de 10k pessoas",
                badge: "remote",
                remote: true
            }
            // Add more opportunities as needed
        ];

        filteredOpportunities = [...opportunities];
        renderOpportunities();
    }

    /**
     * Render opportunities in the grid
     */
    function renderOpportunities() {
        if (!opportunitiesGrid) return;

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageOpportunities = filteredOpportunities.slice(startIndex, endIndex);

        if (currentPage === 1) {
            opportunitiesGrid.innerHTML = '';
        }

        pageOpportunities.forEach(opportunity => {
            const opportunityCard = createOpportunityCard(opportunity);
            opportunitiesGrid.appendChild(opportunityCard);
        });

        // Update load more button visibility
        updateLoadMoreButton();

        // Announce results for screen readers
        const totalResults = filteredOpportunities.length;
        announceToScreenReader(`${totalResults} oportunidades encontradas. Mostrando ${Math.min(currentPage * itemsPerPage, totalResults)} de ${totalResults}.`);
    }

    /**
     * Create opportunity card element
     */
    function createOpportunityCard(opportunity) {
        const article = document.createElement('article');
        article.className = 'opportunity-card';
        article.setAttribute('data-opportunity-id', opportunity.id);

        const badgeClass = opportunity.badge || '';
        const badgeText = getBadgeText(opportunity.badge);
        
        article.innerHTML = `
            <div class="opportunity-header">
                <div class="ong-info">
                    <img src="${opportunity.ongLogo}" 
                         alt="Logo da ${opportunity.ongName}" 
                         class="ong-logo"
                         loading="lazy"
                         onerror="this.style.display='none'">
                    <div>
                        <h3 class="ong-name">${opportunity.ongName}</h3>
                        <div class="ong-rating">
                            <span class="stars" aria-label="${opportunity.rating} estrelas de 5">
                                ${generateStarsHTML(opportunity.rating)}
                            </span>
                            <span class="rating-value">${opportunity.rating}</span>
                        </div>
                    </div>
                </div>
                ${badgeText ? `<div class="opportunity-badge ${badgeClass}">${badgeText}</div>` : ''}
            </div>

            <div class="opportunity-content">
                <h4 class="opportunity-title">${opportunity.title}</h4>
                <p class="opportunity-description">${opportunity.description}</p>
                
                <div class="opportunity-details">
                    <div class="detail-item">
                        <i class="fas ${opportunity.remote ? 'fa-laptop' : 'fa-map-marker-alt'}" aria-hidden="true"></i>
                        <span>${opportunity.location}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-clock" aria-hidden="true"></i>
                        <span>${opportunity.schedule}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-users" aria-hidden="true"></i>
                        <span>${opportunity.vacancies} vaga${opportunity.vacancies > 1 ? 's' : ''} disponível${opportunity.vacancies > 1 ? 'eis' : ''}</span>
                    </div>
                </div>

                <div class="opportunity-tags">
                    ${opportunity.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>

            <div class="opportunity-footer">
                <div class="opportunity-impact">
                    <i class="fas fa-heart text-accent" aria-hidden="true"></i>
                    <span>${opportunity.impact}</span>
                </div>
                <button class="btn-primary" onclick="applyToOpportunity(${opportunity.id})" 
                        aria-label="Candidatar-se à vaga ${opportunity.title}">
                    <i class="fas fa-hand-paper" aria-hidden="true"></i>
                    Candidatar-se
                </button>
            </div>
        `;

        return article;
    }

    /**
     * Generate stars HTML for rating
     */
    function generateStarsHTML(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let starsHTML = '';

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                starsHTML += '<i class="fas fa-star" aria-hidden="true"></i>';
            } else if (i === fullStars && hasHalfStar) {
                starsHTML += '<i class="fas fa-star-half-alt" aria-hidden="true"></i>';
            } else {
                starsHTML += '<i class="far fa-star" aria-hidden="true"></i>';
            }
        }

        return starsHTML;
    }

    /**
     * Get badge text based on badge type
     */
    function getBadgeText(badge) {
        const badges = {
            'urgent': 'Urgente',
            'featured': 'Destaque',
            'remote': 'Remoto',
            'new': 'Novo'
        };
        return badges[badge] || '';
    }

    /**
     * Handle filter changes
     */
    function handleFilterChange(event) {
        const filterType = event.target.id.replace('-filter', '').replace('category', 'category').replace('location', 'location').replace('time', 'time');
        const filterValue = event.target.value;

        currentFilters[filterType] = filterValue;
        applyFilters();
    }

    /**
     * Perform search
     */
    function performSearch() {
        currentFilters.search = searchInput.value.toLowerCase().trim();
        applyFilters();
    }

    /**
     * Filter by category
     */
    function filterByCategory(category) {
        if (categoryFilter) {
            categoryFilter.value = category;
            currentFilters.category = category;
            applyFilters();
            
            // Scroll to opportunities section
            const opportunitiesSection = document.getElementById('opportunities');
            if (opportunitiesSection) {
                opportunitiesSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    }

    /**
     * Apply all filters
     */
    function applyFilters() {
        filteredOpportunities = opportunities.filter(opportunity => {
            // Search filter
            if (currentFilters.search && !matchesSearch(opportunity, currentFilters.search)) {
                return false;
            }

            // Category filter
            if (currentFilters.category && opportunity.category !== currentFilters.category) {
                return false;
            }

            // Location filter (simplified)
            if (currentFilters.location && !matchesLocation(opportunity, currentFilters.location)) {
                return false;
            }

            // Time filter (simplified)
            if (currentFilters.time && !matchesTime(opportunity, currentFilters.time)) {
                return false;
            }

            return true;
        });

        currentPage = 1;
        renderOpportunities();
    }

    /**
     * Check if opportunity matches search terms
     */
    function matchesSearch(opportunity, searchTerm) {
        const searchableText = [
            opportunity.title,
            opportunity.description,
            opportunity.ongName,
            ...opportunity.tags
        ].join(' ').toLowerCase();

        return searchableText.includes(searchTerm);
    }

    /**
     * Check if opportunity matches location filter
     */
    function matchesLocation(opportunity, location) {
        if (location === 'remote') {
            return opportunity.remote || opportunity.location.includes('Remoto');
        }
        return opportunity.location.toLowerCase().includes(location.toLowerCase());
    }

    /**
     * Check if opportunity matches time filter
     */
    function matchesTime(opportunity, time) {
        const schedule = opportunity.schedule.toLowerCase();
        
        switch(time) {
            case 'weekends':
                return schedule.includes('sábado') || schedule.includes('domingo') || schedule.includes('fim');
            case 'evenings':
                return schedule.includes('noite') || schedule.includes('18h') || schedule.includes('19h') || schedule.includes('20h');
            case 'mornings':
                return schedule.includes('manhã') || schedule.includes('8h') || schedule.includes('9h') || schedule.includes('10h');
            case 'flexible':
                return schedule.includes('flexível') || schedule.includes('horário flexível');
            default:
                return true;
        }
    }

    /**
     * Load more opportunities
     */
    function loadMoreOpportunities() {
        currentPage++;
        renderOpportunities();
    }

    /**
     * Update load more button visibility
     */
    function updateLoadMoreButton() {
        if (!loadMoreBtn) return;

        const totalPages = Math.ceil(filteredOpportunities.length / itemsPerPage);
        const hasMorePages = currentPage < totalPages;

        loadMoreBtn.style.display = hasMorePages ? 'block' : 'none';
        
        if (hasMorePages) {
            const remaining = filteredOpportunities.length - (currentPage * itemsPerPage);
            loadMoreBtn.querySelector('span').textContent = `Ver Mais ${Math.min(remaining, itemsPerPage)} Oportunidades`;
        }
    }

    /**
     * Apply to opportunity
     */
    window.applyToOpportunity = function(opportunityId) {
        const opportunity = opportunities.find(opp => opp.id === opportunityId);
        if (!opportunity) return;

        // Show application modal or redirect to application page
        showApplicationModal(opportunity);
    };

    /**
     * Show application modal
     */
    function showApplicationModal(opportunity) {
        // For now, just show an alert - in real app, this would open a modal
        announceToScreenReader(`Candidatura iniciada para a vaga: ${opportunity.title}`);
        
        const confirmed = confirm(`Deseja se candidatar para a vaga "${opportunity.title}" na ${opportunity.ongName}?`);
        
        if (confirmed) {
            // Simulate application process
            setTimeout(() => {
                alert('Candidatura enviada com sucesso! A ONG entrará em contato em breve.');
                announceToScreenReader('Candidatura enviada com sucesso!');
            }, 500);
        }
    }

    /**
     * Toggle advanced filters
     */
    window.toggleAdvancedFilters = function() {
        // Implementation for advanced filters panel
        console.log('Advanced filters toggled');
    };

    /**
     * Open login modal
     */
    window.openLoginModal = function() {
        // Implementation for login modal
        console.log('Login modal opened');
    };

    /**
     * Announce to screen reader
     */
    function announceToScreenReader(message) {
        if (liveRegion) {
            liveRegion.textContent = message;
            
            // Clear after announcing
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }

    /**
     * Keyboard navigation for opportunity cards
     */
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            const focusedCard = document.activeElement.closest('.opportunity-card, .category-card');
            if (focusedCard) {
                e.preventDefault();
                
                const cards = Array.from(document.querySelectorAll('.opportunity-card, .category-card'));
                const currentIndex = cards.indexOf(focusedCard);
                
                let nextIndex;
                if (e.key === 'ArrowDown') {
                    nextIndex = (currentIndex + 1) % cards.length;
                } else {
                    nextIndex = currentIndex > 0 ? currentIndex - 1 : cards.length - 1;
                }
                
                const nextCard = cards[nextIndex];
                if (nextCard) {
                    nextCard.focus();
                    nextCard.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                }
            }
        }
    });

})();