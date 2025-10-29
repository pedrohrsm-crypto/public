/**
 * Video Player Controls
 * Controles avançados para o player de vídeo institucional
 * Funcionalidades: play/pause, tela cheia, legendas, acessibilidade
 */

class VideoPlayer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.video = this.container.querySelector('.video-element');
        this.overlay = this.container.querySelector('.video-overlay');
        this.playButton = this.container.querySelector('.play-button');
        this.fullscreenBtn = this.container.querySelector('[data-action="fullscreen"]');
        this.captionsBtn = this.container.querySelector('[data-action="captions"]');
        
        this.isPlaying = false;
        this.isFullscreen = false;
        this.captionsEnabled = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupKeyboardControls();
        this.setupAccessibility();
        this.loadVideoMetadata();
    }

    setupEventListeners() {
        // Play/Pause através do botão ou clique no vídeo
        this.playButton?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.togglePlay();
        });

        this.overlay?.addEventListener('click', () => {
            this.togglePlay();
        });

        this.video?.addEventListener('click', () => {
            this.togglePlay();
        });

        // Controles de tela cheia
        this.fullscreenBtn?.addEventListener('click', () => {
            this.toggleFullscreen();
        });

        // Controles de legendas
        this.captionsBtn?.addEventListener('click', () => {
            this.toggleCaptions();
        });

        // Eventos do vídeo
        this.video?.addEventListener('loadedmetadata', () => {
            this.onVideoLoaded();
        });

        this.video?.addEventListener('play', () => {
            this.onVideoPlay();
        });

        this.video?.addEventListener('pause', () => {
            this.onVideoPause();
        });

        this.video?.addEventListener('ended', () => {
            this.onVideoEnded();
        });

        this.video?.addEventListener('error', (e) => {
            this.onVideoError(e);
        });

        // Eventos de tela cheia
        document.addEventListener('fullscreenchange', () => {
            this.onFullscreenChange();
        });

        document.addEventListener('webkitfullscreenchange', () => {
            this.onFullscreenChange();
        });

        document.addEventListener('mozfullscreenchange', () => {
            this.onFullscreenChange();
        });

        document.addEventListener('MSFullscreenChange', () => {
            this.onFullscreenChange();
        });
    }

    setupKeyboardControls() {
        this.container?.addEventListener('keydown', (e) => {
            // Apenas reagir se o container ou seus elementos estão focados
            if (!this.container.contains(document.activeElement)) return;

            switch (e.code) {
                case 'Space':
                case 'Enter':
                    e.preventDefault();
                    this.togglePlay();
                    break;
                case 'KeyF':
                    e.preventDefault();
                    this.toggleFullscreen();
                    break;
                case 'KeyC':
                    e.preventDefault();
                    this.toggleCaptions();
                    break;
                case 'Escape':
                    if (this.isFullscreen) {
                        e.preventDefault();
                        this.exitFullscreen();
                    }
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.skipVideo(-10);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.skipVideo(10);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.changeVolume(0.1);
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.changeVolume(-0.1);
                    break;
            }
        });
    }

    setupAccessibility() {
        // Adicionar atributos de acessibilidade
        if (this.video) {
            this.video.setAttribute('tabindex', '0');
            this.video.setAttribute('role', 'video');
            this.video.setAttribute('aria-label', 'Vídeo institucional da ONGConnect');
        }

        if (this.playButton) {
            this.playButton.setAttribute('aria-label', 'Reproduzir vídeo');
            this.playButton.setAttribute('aria-describedby', 'video-description');
        }

        if (this.fullscreenBtn) {
            this.fullscreenBtn.setAttribute('aria-label', 'Tela cheia');
            this.fullscreenBtn.setAttribute('title', 'Expandir para tela cheia (F)');
        }

        if (this.captionsBtn) {
            this.captionsBtn.setAttribute('aria-label', 'Legendas');
            this.captionsBtn.setAttribute('title', 'Ativar/desativar legendas (C)');
            this.captionsBtn.setAttribute('aria-pressed', 'false');
        }

        // Adicionar descrição para leitores de tela
        const description = document.createElement('div');
        description.id = 'video-description';
        description.className = 'sr-only';
        description.textContent = 'Vídeo institucional apresentando a missão e impacto da ONGConnect. Use Espaço para reproduzir/pausar, F para tela cheia, C para legendas, setas esquerda/direita para navegar.';
        this.container?.appendChild(description);
    }

    loadVideoMetadata() {
        if (!this.video) return;

        // Detectar se há faixas de legendas disponíveis
        this.video.addEventListener('loadedmetadata', () => {
            const tracks = this.video.textTracks;
            if (tracks.length > 0 && this.captionsBtn) {
                this.captionsBtn.style.display = 'block';
                
                // Configurar primeira faixa de legendas
                for (let i = 0; i < tracks.length; i++) {
                    if (tracks[i].kind === 'captions' || tracks[i].kind === 'subtitles') {
                        tracks[i].mode = 'hidden';
                        break;
                    }
                }
            }
        });
    }

    togglePlay() {
        if (!this.video) return;

        if (this.isPlaying) {
            this.pauseVideo();
        } else {
            this.playVideo();
        }
    }

    playVideo() {
        if (!this.video) return;

        const playPromise = this.video.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    this.isPlaying = true;
                    this.hideOverlay();
                    this.announceToScreenReader('Vídeo reproduzindo');
                })
                .catch((error) => {
                    console.error('Erro ao reproduzir vídeo:', error);
                    this.announceToScreenReader('Erro ao reproduzir vídeo');
                });
        }
    }

    pauseVideo() {
        if (!this.video) return;

        this.video.pause();
        this.isPlaying = false;
        this.showOverlay();
        this.announceToScreenReader('Vídeo pausado');
    }

    toggleFullscreen() {
        if (!this.container) return;

        if (this.isFullscreen) {
            this.exitFullscreen();
        } else {
            this.enterFullscreen();
        }
    }

    enterFullscreen() {
        const element = this.container;
        
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }

    exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }

    toggleCaptions() {
        if (!this.video) return;

        const tracks = this.video.textTracks;
        let captionTrack = null;

        // Encontrar faixa de legendas
        for (let i = 0; i < tracks.length; i++) {
            if (tracks[i].kind === 'captions' || tracks[i].kind === 'subtitles') {
                captionTrack = tracks[i];
                break;
            }
        }

        if (captionTrack) {
            if (this.captionsEnabled) {
                captionTrack.mode = 'hidden';
                this.captionsEnabled = false;
                this.captionsBtn?.setAttribute('aria-pressed', 'false');
                this.captionsBtn?.classList.remove('active');
                this.announceToScreenReader('Legendas desativadas');
            } else {
                captionTrack.mode = 'showing';
                this.captionsEnabled = true;
                this.captionsBtn?.setAttribute('aria-pressed', 'true');
                this.captionsBtn?.classList.add('active');
                this.announceToScreenReader('Legendas ativadas');
            }
        }
    }

    skipVideo(seconds) {
        if (!this.video) return;

        const newTime = this.video.currentTime + seconds;
        this.video.currentTime = Math.max(0, Math.min(newTime, this.video.duration));
        
        const direction = seconds > 0 ? 'avançado' : 'retrocedido';
        const amount = Math.abs(seconds);
        this.announceToScreenReader(`Vídeo ${direction} ${amount} segundos`);
    }

    changeVolume(delta) {
        if (!this.video) return;

        const newVolume = Math.max(0, Math.min(1, this.video.volume + delta));
        this.video.volume = newVolume;
        
        const percentage = Math.round(newVolume * 100);
        this.announceToScreenReader(`Volume ${percentage}%`);
    }

    showOverlay() {
        this.overlay?.classList.remove('hidden');
        if (this.playButton) {
            this.playButton.innerHTML = '<i class="fas fa-play" aria-hidden="true"></i>';
            this.playButton.setAttribute('aria-label', 'Reproduzir vídeo');
        }
    }

    hideOverlay() {
        this.overlay?.classList.add('hidden');
        if (this.playButton) {
            this.playButton.innerHTML = '<i class="fas fa-pause" aria-hidden="true"></i>';
            this.playButton.setAttribute('aria-label', 'Pausar vídeo');
        }
    }

    onVideoLoaded() {
        console.log('Vídeo carregado com sucesso');
        this.announceToScreenReader('Vídeo pronto para reprodução');
    }

    onVideoPlay() {
        this.isPlaying = true;
        this.hideOverlay();
        
        // Adicionar classe para styling durante reprodução
        this.container?.classList.add('playing');
    }

    onVideoPause() {
        this.isPlaying = false;
        this.showOverlay();
        
        // Remover classe de reprodução
        this.container?.classList.remove('playing');
    }

    onVideoEnded() {
        this.isPlaying = false;
        this.showOverlay();
        this.container?.classList.remove('playing');
        this.announceToScreenReader('Vídeo finalizado');
        
        // Voltar ao início
        if (this.video) {
            this.video.currentTime = 0;
        }
    }

    onVideoError(error) {
        console.error('Erro no vídeo:', error);
        this.announceToScreenReader('Erro ao carregar vídeo');
        
        // Mostrar mensagem de erro amigável
        this.showErrorMessage('Não foi possível carregar o vídeo. Tente novamente mais tarde.');
    }

    onFullscreenChange() {
        this.isFullscreen = !!(
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement
        );

        this.container?.classList.toggle('fullscreen', this.isFullscreen);
        
        if (this.fullscreenBtn) {
            if (this.isFullscreen) {
                this.fullscreenBtn.innerHTML = '<i class="fas fa-compress" aria-hidden="true"></i>';
                this.fullscreenBtn.setAttribute('aria-label', 'Sair da tela cheia');
                this.fullscreenBtn.setAttribute('title', 'Sair da tela cheia (F ou Esc)');
                this.announceToScreenReader('Modo tela cheia ativado');
            } else {
                this.fullscreenBtn.innerHTML = '<i class="fas fa-expand" aria-hidden="true"></i>';
                this.fullscreenBtn.setAttribute('aria-label', 'Tela cheia');
                this.fullscreenBtn.setAttribute('title', 'Expandir para tela cheia (F)');
                this.announceToScreenReader('Modo tela cheia desativado');
            }
        }
    }

    showErrorMessage(message) {
        // Criar ou atualizar elemento de erro
        let errorElement = this.container?.querySelector('.video-error');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'video-error';
            errorElement.setAttribute('role', 'alert');
            errorElement.setAttribute('aria-live', 'polite');
            this.container?.appendChild(errorElement);
        }

        errorElement.innerHTML = `
            <div class="error-content">
                <i class="fas fa-exclamation-triangle" aria-hidden="true"></i>
                <p>${message}</p>
                <button class="retry-button" onclick="location.reload()">
                    <i class="fas fa-redo" aria-hidden="true"></i>
                    Tentar novamente
                </button>
            </div>
        `;

        // Aplicar estilos de erro
        errorElement.style.cssText = `
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            z-index: 20;
            border-radius: inherit;
        `;
    }

    announceToScreenReader(message) {
        // Criar elemento temporário para anúncios de leitores de tela
        let announcer = document.getElementById('video-announcer');
        
        if (!announcer) {
            announcer = document.createElement('div');
            announcer.id = 'video-announcer';
            announcer.className = 'sr-only';
            announcer.setAttribute('aria-live', 'polite');
            announcer.setAttribute('aria-atomic', 'true');
            document.body.appendChild(announcer);
        }

        announcer.textContent = message;
        
        // Limpar após um tempo
        setTimeout(() => {
            announcer.textContent = '';
        }, 1000);
    }

    // Método público para controle externo
    getCurrentTime() {
        return this.video?.currentTime || 0;
    }

    getDuration() {
        return this.video?.duration || 0;
    }

    setCurrentTime(time) {
        if (this.video) {
            this.video.currentTime = time;
        }
    }

    getVolume() {
        return this.video?.volume || 1;
    }

    setVolume(volume) {
        if (this.video) {
            this.video.volume = Math.max(0, Math.min(1, volume));
        }
    }

    destroy() {
        // Limpar event listeners e recursos
        this.pauseVideo();
        
        if (this.isFullscreen) {
            this.exitFullscreen();
        }

        // Remover elementos temporários
        const announcer = document.getElementById('video-announcer');
        announcer?.remove();

        const errorElement = this.container?.querySelector('.video-error');
        errorElement?.remove();
    }
}

/**
 * Intersection Observer para animações suaves das seções
 */
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            root: null,
            rootMargin: '-10% 0px',
            threshold: 0.1
        };
        
        this.init();
    }

    init() {
        // Verificar suporte ao Intersection Observer
        if (!('IntersectionObserver' in window)) {
            this.fallbackAnimation();
            return;
        }

        this.setupObserver();
        this.setupScrollIndicator();
    }

    setupObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Animar elementos filhos com delay
                    this.animateChildren(entry.target);
                }
            });
        }, this.observerOptions);

        // Observar todas as seções de história
        const storysections = document.querySelectorAll('.story-section');
        storysections.forEach(section => {
            this.observer.observe(section);
        });

        // Observar seção de vídeo
        const videoSection = document.querySelector('.video-section');
        if (videoSection) {
            this.observer.observe(videoSection);
        }
    }

    animateChildren(section) {
        const children = section.querySelectorAll('.story-image, .metric-card, .partner-category');
        
        children.forEach((child, index) => {
            setTimeout(() => {
                Object.assign(child.style, {
                    opacity: '1',
                    transform: 'translateY(0)'
                });
            }, index * 100);
        });
    }

    setupScrollIndicator() {
        const scrollIndicator = document.querySelector('.hero-scroll-indicator');
        
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                const firstSection = document.querySelector('.story-section');
                if (firstSection) {
                    firstSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }
    }

    fallbackAnimation() {
        // Fallback para navegadores sem suporte
        const sections = document.querySelectorAll('.story-section, .video-section');
        sections.forEach(section => {
            section.classList.add('visible');
        });
    }

    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

/**
 * Inicialização quando o DOM estiver carregado
 */
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar player de vídeo
    const videoContainer = document.getElementById('video-institucional');
    if (videoContainer) {
        window.videoPlayer = new VideoPlayer('video-institucional');
    }

    // Inicializar animações de scroll
    window.scrollAnimations = new ScrollAnimations();

    // Configurar navegação suave para links internos
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Melhorar performance removendo animações durante scroll rápido
    let scrollTimeout;
    let isScrolling = false;

    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            document.body.classList.add('scrolling');
            isScrolling = true;
        }

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            document.body.classList.remove('scrolling');
            isScrolling = false;
        }, 150);
    });

    console.log('Página início.html inicializada com sucesso');
});

/**
 * Limpeza ao sair da página
 */
window.addEventListener('beforeunload', () => {
    if (window.videoPlayer) {
        window.videoPlayer.destroy();
    }
    
    if (window.scrollAnimations) {
        window.scrollAnimations.destroy();
    }
});

/**
 * Exportar classes para uso externo se necessário
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VideoPlayer, ScrollAnimations };
}