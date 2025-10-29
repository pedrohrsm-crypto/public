/**
 * Sistema de Paginação para Cards de ONGs
 * Controla a exibição progressiva dos cards em layout 3x3
 * Integra com o sistema de filtros existente
 */

class ONGPagination {
    constructor() {
        this.cardsPerPage = {
            desktop: 9,  // 3x3
            tablet: 8,   // 2x4  
            mobile: 6    // 1x6
        };
        
        this.currentPage = 1;
        this.allCards = [];
        this.filteredCards = [];
        
        this.init();
    }
    
    init() {
        // Aguarda o DOM estar pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        // Seleciona todos os cards das ONGs
        this.allCards = Array.from(document.querySelectorAll('.ngo-card'));
        this.filteredCards = [...this.allCards]; // Inicialmente todos os cards
        
        this.showMoreBtn = document.getElementById('showMoreBtn');
        this.paginationInfo = document.querySelector('.pagination-info');
        this.cardsContainer = document.querySelector('.hero-cards-grid');
        
        if (!this.allCards.length) {
            console.warn('Nenhum card de ONG encontrado');
            return;
        }
        
        // Configura eventos
        this.setupEventListeners();
        
        // Configura exibição inicial
        this.updateDisplay();
        this.updatePaginationInfo();
        
        // Escuta mudanças de tamanho da tela
        window.addEventListener('resize', this.debounce(() => {
            this.updateDisplay();
            this.updatePaginationInfo();
        }, 250));
        
        // Integra com sistema de filtros
        this.integrateWithFilters();
    }
    
    setupEventListeners() {
        if (this.showMoreBtn) {
            this.showMoreBtn.addEventListener('click', () => this.showMoreCards());
        }
    }
    
    integrateWithFilters() {
        // Observa mudanças nos filtros
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Aguarda o filtro ser aplicado
                setTimeout(() => {
                    this.updateFilteredCards();
                    this.reset();
                }, 100);
            });
        });
    }
    
    updateFilteredCards() {
        // Coleta cards atualmente visíveis (não filtrados)
        this.filteredCards = this.allCards.filter(card => {
            return !card.classList.contains('hidden');
        });
    }
    
    getCurrentBreakpoint() {
        const width = window.innerWidth;
        if (width <= 768) return 'mobile';
        if (width <= 1024) return 'tablet';
        return 'desktop';
    }
    
    getCardsPerPage() {
        return this.cardsPerPage[this.getCurrentBreakpoint()];
    }
    
    updateDisplay() {
        const cardsToShow = this.getCardsPerPage() * this.currentPage;
        
        // Esconde todos os cards primeiro
        this.allCards.forEach(card => {
            if (!card.classList.contains('hidden')) { // Mantém filtros
                card.style.display = 'none';
            }
        });
        
        // Mostra apenas os cards filtrados até o limite
        this.filteredCards.forEach((card, index) => {
            if (index < cardsToShow) {
                card.style.display = 'block';
                
                // Adiciona animação apenas para novos cards
                if (index >= cardsToShow - this.getCardsPerPage()) {
                    card.classList.add('fade-in');
                    setTimeout(() => card.classList.remove('fade-in'), 500);
                }
            } else {
                card.style.display = 'none';
            }
        });
        
        // Atualiza estado do botão
        this.updateShowMoreButton(cardsToShow);
    }
    
    updateShowMoreButton(cardsToShow) {
        if (!this.showMoreBtn) return;
        
        const hasMoreCards = cardsToShow < this.filteredCards.length;
        
        if (hasMoreCards) {
            this.showMoreBtn.style.display = 'inline-flex';
            this.showMoreBtn.classList.remove('hidden');
            this.showMoreBtn.parentElement.style.display = 'flex';
        } else {
            this.showMoreBtn.style.display = 'none';
            this.showMoreBtn.classList.add('hidden');
            
            // Se não há mais cards para mostrar, esconde toda a seção
            if (this.filteredCards.length === 0) {
                this.showMoreBtn.parentElement.style.display = 'none';
            }
        }
    }
    
    showMoreCards() {
        if (!this.showMoreBtn) return;
        
        // Adiciona estado de loading
        this.showMoreBtn.classList.add('loading');
        this.showMoreBtn.disabled = true;
        
        // Simula carregamento (pode ser removido em produção)
        setTimeout(() => {
            this.currentPage++;
            this.updateDisplay();
            this.updatePaginationInfo();
            
            // Remove estado de loading
            this.showMoreBtn.classList.remove('loading');
            this.showMoreBtn.disabled = false;
            
            // Scroll suave para os novos cards
            this.scrollToNewCards();
        }, 300);
    }
    
    scrollToNewCards() {
        const cardsPerPage = this.getCardsPerPage();
        const firstNewCardIndex = (this.currentPage - 1) * cardsPerPage;
        const firstNewCard = this.filteredCards[firstNewCardIndex];
        
        if (firstNewCard) {
            firstNewCard.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
    
    updatePaginationInfo() {
        if (!this.paginationInfo) return;
        
        const cardsPerPage = this.getCardsPerPage();
        const currentlyShowing = Math.min(
            cardsPerPage * this.currentPage,
            this.filteredCards.length
        );
        
        const totalCards = this.filteredCards.length;
        
        if (totalCards === 0) {
            this.paginationInfo.textContent = 'Nenhuma ONG encontrada para este filtro.';
            this.paginationInfo.parentElement.style.display = 'none';
        } else {
            this.paginationInfo.textContent = 
                `Mostrando ${currentlyShowing} de ${totalCards} ONGs`;
            this.paginationInfo.parentElement.style.display = 'flex';
        }
    }
    
    // Função auxiliar para debounce
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Método público para resetar a paginação
    reset() {
        this.currentPage = 1;
        this.updateDisplay();
        this.updatePaginationInfo();
    }
    
    // Método público para quando filtros são aplicados
    onFilterApplied() {
        this.updateFilteredCards();
        this.reset();
    }
}

// Inicializa a paginação
let ongPagination;

// Aguarda o DOM carregar
document.addEventListener('DOMContentLoaded', function() {
    ongPagination = new ONGPagination();
    
    // Exporta para uso global (integração com filtros)
    window.ONGPagination = ONGPagination;
    window.ongPagination = ongPagination;
});