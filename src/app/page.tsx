// @ts-nocheck
"use client";
import React, { useEffect } from "react";
import "./clint.css";
import { createClient } from "@/lib/supabase/client";

const CLINT_HTML = `

  <!-- AURORA BACKGROUND (CLINT SIGNATURE) -->
  <div class="aurora-bg">
    <div class="aurora-orb-center"></div>
    <div class="aurora-orb-left"></div>
    <div class="aurora-orb-right"></div>
    <div class="aurora-beam"></div>
    <div class="aurora-beam-2"></div>
  </div>
  <div class="bg-grid-overlay"></div>

  <!-- NAVBAR COM O LOGOTIPO ORIGINAL + MENUS 'BAIXAR VÍDEO' E 'BLOG' -->
  <header class="navbar">
    <div class="container navbar-inner">
      <a href="#" style="display: flex; align-items: center;">
        <img src="/logo.png" alt="Peguei o Texto" class="brand-logo-img">
      </a>

      <nav>
        <ul class="nav-links">
          <li><a href="#como-funciona" class="nav-link">Como funciona</a></li>
          <li><a href="#recursos" class="nav-link">Recursos</a></li>
          <li><a href="/baixar-video" class="nav-link" style="color: var(--brand-violet-light); font-weight: 600;">Baixar Vídeo</a></li>
          <li><a href="/blog" class="nav-link">Blog</a></li>
          <li><a href="/precos" class="nav-link">Preços</a></li>
          <li><a href="#duvidas" class="nav-link">Dúvidas</a></li>
        </ul>
      </nav>

      <div class="nav-actions">
        <a href="/login" class="nav-login" id="navLoginLink">Entrar</a>
        <a href="/login?signup=true" class="btn-primary nav-cta" id="navCtaLink" onclick="handleStartFree(event)">
          <span>Começar grátis</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>

      <button class="menu-mobile-btn" aria-label="Menu Mobile" onclick="toggleMobileMenu()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
    </div>

    <!-- Gaveta Mobile -->
    <div id="mobileDrawer" style="display: none; padding: 20px 24px; background: rgba(12,8,22,0.98); border-bottom: 1px solid rgba(255,255,255,0.1); flex-direction: column; gap: 14px;">
      <a href="#como-funciona" class="nav-link" onclick="toggleMobileMenu()">Como funciona</a>
      <a href="#recursos" class="nav-link" onclick="toggleMobileMenu()">Recursos</a>
      <a href="/baixar-video" class="nav-link" onclick="toggleMobileMenu()" style="color: var(--brand-violet-light); font-weight: 600;">Baixar Vídeo</a>
      <a href="/blog" class="nav-link" onclick="toggleMobileMenu()">Blog</a>
      <a href="/precos" class="nav-link" onclick="toggleMobileMenu()">Preços</a>
      <a href="#duvidas" class="nav-link" onclick="toggleMobileMenu()">Dúvidas</a>
      <a href="/login" class="nav-link" id="mobileNavLoginLink" onclick="toggleMobileMenu()">Entrar</a>
      <a href="/login?signup=true" class="btn-primary" id="mobileNavCtaLink" style="margin-top: 8px; width: 100%;" onclick="toggleMobileMenu(); handleStartFree(event)">Começar grátis</a>
    </div>
  </header>

  <main>
    <!-- HERO SECTION -->
    <section class="hero" id="transcrever">
      <div class="container hero-content">
        
        <!-- Badge Pill estilo Clint -->
        <div style="margin-bottom: 24px;">
          <a href="/login?signup=true" class="badge-pill" onclick="handleStartFree(event)">
            <span class="pill-dot"></span>
            <span>✦ IA +rápida e +precisa</span>
            <span style="color: var(--brand-violet-light);">iniciar grátis →</span>
          </a>
        </div>

        <!-- Headline Ajustada com o título exato: 'Cole o link. Pegue o texto.' -->
        <h1 class="hero-title">
          Cole o link.<br>
          <span class="gradient-text">Pegue o texto.</span>
        </h1>

        <!-- Subtítulo de Alta Conversão -->
        <p class="hero-subtitle">
          Transcreva vídeos e áudios do YouTube, Instagram Reels, TikTok, WhatsApp e mais de 1.700 sites.
          IA de última geração com 98% de precisão em PT-BR, resumos executivos, legendas .SRT e privacidade total.
        </p>

        <!-- CAIXA INTERATIVA DE TRANSCRIÇÃO COM O BOTÃO PRINCIPAL 'COMEÇAR GRÁTIS' -->
        <div class="hero-transcribe-box clint-card">
          <!-- Abas de Entrada -->
          <div class="transcribe-tabs">
            <button class="transcribe-tab active" onclick="switchTranscribeTab('url', this)">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              Link da Internet
            </button>
            <button class="transcribe-tab" onclick="switchTranscribeTab('upload', this)">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Upload de Arquivo (MP3, MP4)
            </button>
            <button class="transcribe-tab" onclick="switchTranscribeTab('mic', this)">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>
              Gravar Áudio
            </button>
          </div>

          <!-- Linha de Input Principal com Botão 'Começar grátis' -->
          <input type="file" id="heroFileInput" style="display: none;" accept="audio/*,video/*" onchange="handleHeroFileSelected(this)">
          <div class="transcribe-input-row" id="inputContainer">
            <div class="transcribe-input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
            </div>
            <input 
              type="text" 
              class="transcribe-input" 
              id="heroUrlInput" 
              placeholder="Cole aqui o link do YouTube, Instagram Reels, TikTok, Vimeo ou Twitter..."
              value="https://www.youtube.com/watch?v=leNA0tw7Fzk"
              onkeydown="if(event.key === 'Enter') handleTranscribeAction()"
            >
            <button class="btn-primary transcribe-btn" onclick="handleTranscribeAction()">
              <span>Começar grátis</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>

          <!-- Chips Rápidos de Exemplo -->
          <div class="quick-chips-row">
            <span>Exemplos rápidos:</span>
            <button class="chip-btn" onclick="fillSample('youtube')">
              <span style="color:#FF0000;">▶</span> YouTube
            </button>
            <button class="chip-btn" onclick="fillSample('instagram')">
              <span style="color:#E1306C;">📷</span> Instagram Reels
            </button>
            <button class="chip-btn" onclick="fillSample('tiktok')">
              <span style="color:#00F2EA;">♪</span> TikTok
            </button>
            <button class="chip-btn" onclick="fillSample('whatsapp')">
              <span style="color:#25D366;">💬</span> WhatsApp Áudio
            </button>
            <button class="chip-btn" onclick="fillSample('podcast')">
              <span style="color:#A855F7;">🎙️</span> Podcast / Entrevista
            </button>
          </div>
        </div>

        <!-- MOCKUP INTERATIVO (PALCO CENTRAL DE PRODUTO) -->
        <div class="hero-showcase-wrapper" id="demo">
          
          <!-- Floating Metrics estilo Clint -->
          <div class="floating-metric metric-1">
            <div class="floating-metric-icon" style="background: rgba(124, 58, 237, 0.25); color: #C4A4FF;">
              ⚡
            </div>
            <div>
              <p style="font-size: 11px; color: var(--text-dim); text-transform: uppercase;">Velocidade Extrema</p>
              <p style="font-size: 14px; font-weight: 700; color: #fff;">1h de áudio em 28s</p>
            </div>
          </div>

          <div class="floating-metric metric-2">
            <div class="floating-metric-icon" style="background: rgba(6, 182, 212, 0.25); color: #67E8F9;">
              🎯
            </div>
            <div>
              <p style="font-size: 11px; color: var(--text-dim); text-transform: uppercase;">Acurácia PT-BR</p>
              <p style="font-size: 14px; font-weight: 700; color: #fff;">98.4% de Precisão</p>
            </div>
          </div>

          <div class="floating-metric metric-3">
            <div class="floating-metric-icon" style="background: rgba(16, 185, 129, 0.25); color: #6EE7B7;">
              🔒
            </div>
            <div>
              <p style="font-size: 11px; color: var(--text-dim); text-transform: uppercase;">Zero-Retention</p>
              <p style="font-size: 14px; font-weight: 700; color: #6EE7B7;">Mídia Deletada pós-download</p>
            </div>
          </div>

          <!-- Product Stage (Simulador com Abas e Player) -->
          <div class="product-stage">
            
            <!-- Barra de Janela -->
            <div class="stage-browser-header">
              <div class="window-dots">
                <span class="window-dot dot-red"></span>
                <span class="window-dot dot-yellow"></span>
                <span class="window-dot dot-green"></span>
              </div>
              <div class="browser-url-bar">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <span>pegueiotexto.com.br/dashboard</span>
              </div>
              <div style="font-size: 11px; font-weight: 600; color: #10B981; display: flex; align-items: center; gap: 5px;">
                <span style="width:6px; height:6px; border-radius:50%; background:#10B981;"></span>
                Concluído em 4.2s
              </div>
            </div>

            <!-- Corpo do Simulador -->
            <div class="stage-body">
              
              <!-- Painel Esquerdo: Mídia & Player -->
              <div class="stage-media-card">
                <div class="media-thumb-box">
                  <div class="play-btn-pulse" onclick="togglePlayAudio(this)">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  </div>
                  <div style="position: absolute; bottom: 10px; left: 12px; right: 12px; display: flex; justify-content: space-between; align-items: center; font-size: 11px; font-weight: 600; z-index: 2; text-shadow: 0 1px 4px rgba(0,0,0,0.8);">
                    <span id="playerCurrentTime">00:14</span>
                    <span id="playerTotalTime">01:08</span>
                  </div>
                </div>

                <div>
                  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                    <span class="source-tag" id="sourceBadge">▶ YouTube</span>
                    <span style="font-size: 12px; color: var(--text-dim); font-family: var(--font-mono);">128 kbps • Estéreo</span>
                  </div>
                  <h4 style="font-size: 14px; font-weight: 700; color: #fff; line-height: 1.4;" id="videoTitleDemo">
                    Apresentação: Como a Inteligência Artificial Transforma o Trabalho com Áudio
                  </h4>
                </div>

                <!-- Waveform animada -->
                <div class="waveform-visualizer" id="waveVisualizer">
                  <!-- Barras geradas dinamicamente via JS -->
                </div>

                <div class="media-info-row">
                  <span>Velocidade: <strong style="color:#C4A4FF;">1.5x</strong></span>
                  <span>Falantes: <strong style="color:var(--brand-cyan);">2 Detectados</strong></span>
                  <span>Idioma: <strong style="color:#fff;">Português (BR)</strong></span>
                </div>
              </div>

              <!-- Painel Direito: Transcrição, Resumo IA e Legendas -->
              <div class="stage-transcript-card">
                
                <!-- Abas Superiores do Resultado -->
                <div class="transcript-view-tabs">
                  <div class="view-tab-buttons">
                    <button class="view-tab-btn active" onclick="switchResultTab('full', this)">
                      Transcrição
                    </button>
                    <button class="view-tab-btn" onclick="switchResultTab('summary', this)">
                      ✦ Resumo IA
                    </button>
                    <button class="view-tab-btn" onclick="switchResultTab('srt', this)">
                      Legendas .SRT
                    </button>
                  </div>

                  <!-- Ações de Cópia e Download -->
                  <div class="action-icons-group">
                    <button class="action-icon-btn" onclick="copyMockText(this)" title="Copiar Texto">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                      <span>Copiar</span>
                    </button>
                    <button class="action-icon-btn" onclick="alert('Download em .DOCX / .PDF / .SRT liberado no plano!')" title="Exportar Formato">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      <span>Exportar</span>
                    </button>
                  </div>
                </div>

                <!-- Conteúdo 1: Transcrição com Timestamps -->
                <div class="transcript-stream" id="tabContentFull">
                  <div class="transcript-entry">
                    <div class="entry-header">
                      <span class="timestamp-badge">00:00</span>
                      <span class="speaker-name">🎙️ Falante 1</span>
                    </div>
                    <p class="entry-text">
                      "Bem-vindos ao nosso canal! Hoje vamos falar sobre como a inteligência artificial está transformando a forma como trabalhamos com conteúdo audiovisual."
                    </p>
                  </div>

                  <div class="transcript-entry">
                    <div class="entry-header">
                      <span class="timestamp-badge">00:14</span>
                      <span class="speaker-name">🎙️ Falante 1</span>
                    </div>
                    <p class="entry-text">
                      "Nos últimos anos, vimos uma explosão no volume de vídeos produzidos, de podcasts a webinars e reuniões. Mas todo esse conteúdo fica inacessível se você não tiver o texto indexado."
                    </p>
                  </div>

                  <div class="transcript-entry">
                    <div class="entry-header">
                      <span class="timestamp-badge">00:32</span>
                      <span class="speaker-name">🎙️ Falante 2</span>
                    </div>
                    <p class="entry-text">
                      "Exatamente! Com o Peguei o Texto, basta colar o link ou subir o arquivo para gerar legendas sincronizadas, resumos pontuais e exportar direto para Word ou PDF."
                    </p>
                  </div>

                  <div class="transcript-entry">
                    <div class="entry-header">
                      <span class="timestamp-badge">00:50</span>
                      <span class="speaker-name">🎙️ Falante 1</span>
                    </div>
                    <p class="entry-text">
                      "E o melhor: com privacidade absoluta. O arquivo é deletado automaticamente dos servidores assim que você conclui o download."
                    </p>
                  </div>
                </div>

                <!-- Conteúdo 2: Resumo Executivo IA -->
                <div class="summary-card-view" id="tabContentSummary" style="display: none;">
                  <div class="summary-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z"/></svg>
                    <span>Síntese Executiva Gerada por IA</span>
                  </div>
                  <ul class="summary-bullets">
                    <li>
                      <span class="bullet-check">✓</span>
                      <span><strong>Objetivo Principal:</strong> Apresentar a automação de transcrição e indexação de arquivos de vídeo e áudio em múltiplos formatos.</span>
                    </li>
                    <li>
                      <span class="bullet-check">✓</span>
                      <span><strong>Principais Dores Resolvidas:</strong> Fim da digitação manual de reuniões, geração de legendas prontas para edição e extração rápida de citações de entrevistas.</span>
                    </li>
                    <li>
                      <span class="bullet-check">✓</span>
                      <span><strong>Privacidade & Segurança:</strong> Política estrita de Zero-Retention com deleção irreversível dos arquivos após a entrega do documento.</span>
                    </li>
                    <li>
                      <span class="bullet-check">✓</span>
                      <span><strong>Formatos Disponíveis:</strong> Exportação instantânea para .DOCX (Word formatado), .PDF com capa, .SRT com timestamps e .TXT puro.</span>
                    </li>
                  </ul>
                </div>

                <!-- Conteúdo 3: Legendas .SRT -->
                <div class="transcript-stream" id="tabContentSrt" style="display: none; font-family: var(--font-mono); font-size: 13px;">
                  <div class="transcript-entry" style="border-left-color: #06B6D4;">
                    <p style="color:var(--text-dim);">1</p>
                    <p style="color:#67E8F9; font-weight:600;">00:00:00,000 --> 00:00:12,400</p>
                    <p style="color:#fff;">Bem-vindos ao nosso canal! Hoje vamos falar sobre como a inteligência artificial transforma o áudio.</p>
                  </div>
                  <div class="transcript-entry" style="border-left-color: #06B6D4;">
                    <p style="color:var(--text-dim);">2</p>
                    <p style="color:#67E8F9; font-weight:600;">00:00:12,500 --> 00:00:28,200</p>
                    <p style="color:#fff;">Nos últimos anos, vimos uma explosão no volume de vídeos e podcasts produzidos.</p>
                  </div>
                  <div class="transcript-entry" style="border-left-color: #06B6D4;">
                    <p style="color:var(--text-dim);">3</p>
                    <p style="color:#67E8F9; font-weight:600;">00:00:28,300 --> 00:00:48,000</p>
                    <p style="color:#fff;">Basta colar o link para gerar legendas sincronizadas e resumos executivos.</p>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>

    <!-- MARQUEE INFINITO DAS PLATAFORMAS -->
    <section class="marquee-section">
      <div class="marquee-title">Compatível com mais de 1.700 plataformas e formatos universais</div>
      <div class="marquee-track">
        <span class="platform-pill"><span style="color:#FF0000; font-size:16px;">▶</span> YouTube & Shorts</span>
        <span class="platform-pill"><span style="color:#E1306C; font-size:16px;">📷</span> Instagram Reels</span>
        <span class="platform-pill"><span style="color:#00F2EA; font-size:16px;">♪</span> TikTok</span>
        <span class="platform-pill"><span style="color:#25D366; font-size:16px;">💬</span> WhatsApp Áudios</span>
        <span class="platform-pill"><span style="color:#1DB954; font-size:16px;">🎧</span> Spotify Podcasts</span>
        <span class="platform-pill"><span style="color:#2D8CFF; font-size:16px;">🎥</span> Zoom Reuniões</span>
        <span class="platform-pill"><span style="color:#00897B; font-size:16px;">👥</span> Google Meet</span>
        <span class="platform-pill"><span style="color:#5059C9; font-size:16px;">💼</span> Microsoft Teams</span>
        <span class="platform-pill"><span style="color:#1AB7EA; font-size:16px;">🎬</span> Vimeo</span>
        <span class="platform-pill"><span style="color:#1DA1F2; font-size:16px;">𝕏</span> Twitter / X</span>
        <span class="platform-pill"><span style="color:#9146FF; font-size:16px;">🎮</span> Twitch</span>
        <span class="platform-pill"><span style="color:#FF5500; font-size:16px;">☁️</span> Soundcloud</span>
        <span class="platform-pill"><span style="color:#A78BFA; font-size:16px;">📁</span> MP3, MP4, WAV, M4A</span>

        <!-- Duplicação para loop infinito -->
        <span class="platform-pill"><span style="color:#FF0000; font-size:16px;">▶</span> YouTube & Shorts</span>
        <span class="platform-pill"><span style="color:#E1306C; font-size:16px;">📷</span> Instagram Reels</span>
        <span class="platform-pill"><span style="color:#00F2EA; font-size:16px;">♪</span> TikTok</span>
        <span class="platform-pill"><span style="color:#25D366; font-size:16px;">💬</span> WhatsApp Áudios</span>
        <span class="platform-pill"><span style="color:#1DB954; font-size:16px;">🎧</span> Spotify Podcasts</span>
        <span class="platform-pill"><span style="color:#2D8CFF; font-size:16px;">🎥</span> Zoom Reuniões</span>
        <span class="platform-pill"><span style="color:#00897B; font-size:16px;">👥</span> Google Meet</span>
        <span class="platform-pill"><span style="color:#5059C9; font-size:16px;">💼</span> Microsoft Teams</span>
        <span class="platform-pill"><span style="color:#1AB7EA; font-size:16px;">🎬</span> Vimeo</span>
        <span class="platform-pill"><span style="color:#1DA1F2; font-size:16px;">𝕏</span> Twitter / X</span>
        <span class="platform-pill"><span style="color:#9146FF; font-size:16px;">🎮</span> Twitch</span>
        <span class="platform-pill"><span style="color:#FF5500; font-size:16px;">☁️</span> Soundcloud</span>
        <span class="platform-pill"><span style="color:#A78BFA; font-size:16px;">📁</span> MP3, MP4, WAV, M4A</span>
      </div>
    </section>

    <!-- PRODUCT TOUR / VÍDEO DEMONSTRAÇÃO -->
    <section class="video-section">
      <div class="container">
        <span class="section-eyebrow">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          Tour da Plataforma
        </span>
        <h2 class="section-title">
          Veja o Peguei o Texto funcionando <span class="gradient-text">em tempo real</span>
        </h2>
        <p class="section-subtitle">
          Assista em 2 minutos como colar um link, extrair a transcrição com sotaques preservados, gerar o resumo executivo e exportar as legendas.
        </p>

        <div class="video-frame-container">
          <div class="video-ambient-glow"></div>
          <div class="video-frame">
            <div class="video-aspect">
              <iframe 
                src="https://www.youtube.com/embed/leNA0tw7Fzk?rel=0&modestbranding=1" 
                title="Apresentação do Peguei o Texto" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowfullscreen>
              </iframe>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- BENTO GRID DE RECURSOS -->
    <section class="bento-section" id="recursos">
      <div class="container">
        <div style="text-align: center; margin-bottom: 56px;">
          <span class="section-eyebrow">✦ Recursos Poderosos</span>
          <h2 class="section-title">Construído para quem valoriza cada minuto</h2>
          <p class="section-subtitle">A união perfeita de velocidade brutal, inteligência analítica e rigor absoluto em privacidade.</p>
        </div>

        <div class="bento-grid">
          
          <div class="bento-card-8 clint-card">
            <div class="bento-inner">
              <div>
                <span class="bento-badge badge-purple">Suporte Universal</span>
                <h3 class="bento-title">+1.700 Plataformas Sem Instalação</h3>
                <p class="bento-desc">
                  Cole qualquer link público ou privado. Funciona perfeitamente com YouTube, Reels, TikTok, Vimeo, podcasts, gravações de aulas e áudios encaminhados do WhatsApp. Sem necessidade de plugins, extensões ou downloads pesados.
                </p>
              </div>
              <div class="format-pills-row">
                <span class="format-pill">▶ YouTube 4K</span>
                <span class="format-pill">📷 Instagram Reels</span>
                <span class="format-pill">♪ TikTok Viral</span>
                <span class="format-pill">💬 Áudios WhatsApp</span>
                <span class="format-pill">🎧 Spotify / Deezer</span>
                <span class="format-pill">📁 Arquivos de até 2GB</span>
              </div>
            </div>
          </div>

          <div class="bento-card-4 clint-card">
            <div class="bento-inner">
              <div>
                <span class="bento-badge badge-cyan">Síntese Cognitiva</span>
                <h3 class="bento-title">Resumo & Atas com IA</h3>
                <p class="bento-desc">
                  Não quer ler 40 páginas de transcrição? Nossa IA sintetiza reuniões e aulas em tópicos estruturados, decisões tomadas e planos de ação em 5 segundos.
                </p>
              </div>
              <div style="padding: 16px; border-radius: 12px; background: rgba(6, 182, 212, 0.08); border: 1px solid rgba(6, 182, 212, 0.2);">
                <p style="font-size: 11px; font-weight: 700; color: #67E8F9; text-transform: uppercase; margin-bottom: 6px;">Exemplo de Saída:</p>
                <p style="font-size: 12.5px; color: #E2E8F0; line-height: 1.5;">"Reunião Comercial: Alinhada proposta de R$ 180k. Próximo passo: envio da minuta contratual até sexta."</p>
              </div>
            </div>
          </div>

          <div class="bento-card-4 clint-card">
            <div class="bento-inner">
              <div>
                <span class="bento-badge badge-purple">Produtividade</span>
                <h3 class="bento-title">4 Formatos Prontos</h3>
                <p class="bento-desc">
                  Exporte no formato que o seu software ou cliente exige.
                </p>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                <div class="format-pill" style="justify-content: center;">📄 .DOCX Word</div>
                <div class="format-pill" style="justify-content: center;">📕 .PDF Formatado</div>
                <div class="format-pill" style="justify-content: center;">🎬 .SRT Legenda</div>
                <div class="format-pill" style="justify-content: center;">📝 .TXT Puro</div>
              </div>
            </div>
          </div>

          <div class="bento-card-8 clint-card" style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(6, 3, 10, 0.95)); border-color: rgba(16, 185, 129, 0.3);">
            <div class="bento-inner">
              <div>
                <span class="bento-badge badge-emerald">Segurança Militar • LGPD</span>
                <h3 class="bento-title">Sua Mídia Nunca Fica Armazenada. Deletada Após o Download.</h3>
                <p class="bento-desc">
                  Sigilo absoluto para entrevistas confidenciais, reuniões de diretoria, dados jurídicos e depoimentos. Criptografia ponta a ponta durante o tráfego, isolamento em sandbox efêmero e deleção irreversível em no máximo 24h ou assim que você clica em baixar.
                </p>
              </div>
              <div style="display: flex; gap: 18px; flex-wrap: wrap;">
                <div style="display:flex; align-items:center; gap:8px; font-size:13px; color:#A7F3D0;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Sem treino de IA com seus dados
                </div>
                <div style="display:flex; align-items:center; gap:8px; font-size:13px; color:#A7F3D0;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Conformidade com a LGPD
                </div>
                <div style="display:flex; align-items:center; gap:8px; font-size:13px; color:#A7F3D0;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Nomes de arquivo com UUID hash
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- CASOS DE USO -->
    <section class="usecases-section" id="casos-de-uso">
      <div class="container">
        <div style="text-align: center; margin-bottom: 40px;">
          <span class="section-eyebrow">Soluções por Perfil</span>
          <h2 class="section-title">Feito sob medida para quem precisa de agilidade</h2>
          <p class="section-subtitle">Escolha o seu caso de uso e descubra como o Peguei o Texto economiza até 15 horas da sua semana.</p>
        </div>

        <div class="usecase-tabs-nav">
          <button class="usecase-tab-pill active" onclick="switchUseCase(0, this)">
            <span>🎬</span> Criadores & Editores
          </button>
          <button class="usecase-tab-pill" onclick="switchUseCase(1, this)">
            <span>💼</span> Empresas & Reuniões
          </button>
          <button class="usecase-tab-pill" onclick="switchUseCase(2, this)">
            <span>🎓</span> Estudantes & Pesquisa
          </button>
          <button class="usecase-tab-pill" onclick="switchUseCase(3, this)">
            <span>📰</span> Jornalistas & Podcasters
          </button>
          <button class="usecase-tab-pill" onclick="switchUseCase(4, this)">
            <span>⚖️</span> Advogados & Jurídico
          </button>
        </div>

        <div class="usecase-content-box clint-card" id="useCaseContent">
          <!-- Renderizado via JS -->
        </div>

      </div>
    </section>

    <!-- COMO FUNCIONA -->
    <section class="steps-section" id="como-funciona">
      <div class="container">
        <div style="text-align: center; margin-bottom: 56px;">
          <span class="section-eyebrow">Fluxo Direto</span>
          <h2 class="section-title">3 passos simples. Sem atrito.</h2>
          <p class="section-subtitle">Zero complicações. Você não precisa nem de cartão de crédito para experimentar.</p>
        </div>

        <div class="steps-row">
          <div class="step-card clint-card">
            <div class="step-number">01</div>
            <h3 class="step-title">Cole o link ou envie o arquivo</h3>
            <p class="step-desc">
              Insira o link de qualquer vídeo ou faça upload de um arquivo de áudio (MP3, WAV, M4A) ou vídeo (MP4, MOV) de até 2GB.
            </p>
          </div>

          <div class="step-card clint-card">
            <div class="step-number">02</div>
            <h3 class="step-title">A IA processa e formata</h3>
            <p class="step-desc">
              Nossa IA +rápida e +precisa transcreve com pontuação natural, separa os falantes e identifica expressões e termos técnicos em português.
            </p>
          </div>

          <div class="step-card clint-card">
            <div class="step-number">03</div>
            <h3 class="step-title">Baixe seu texto e o arquivo é apagado</h3>
            <p class="step-desc">
              Faça download em .TXT, .DOCX, .PDF ou .SRT. Sua mídia original é deletada de forma definitiva e automática para sua total segurança.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- TABELA DE PREÇOS (DESTAQUE NA ASSINATURA ANUAL + SEGUNDA OPÇÃO AVULSA) -->
    <section class="pricing-section" id="precos">
      <div class="container">
        <div style="text-align: center; margin-bottom: 30px;">
          <span class="section-eyebrow">Planos Transparentes</span>
          <h2 class="section-title">Pague apenas pelo que usar</h2>
          <p class="section-subtitle">Escolha entre a máxima economia da Assinatura Anual ou compre créditos avulsos sem mensalidade.</p>
        </div>

        <!-- TOGGLE: DESTAQUE NA ASSINATURA ANUAL COMO 1ª OPÇÃO -->
        <div class="pricing-toggle-wrap">
          <div class="pricing-toggle-pill">
            <button class="pricing-toggle-btn active" id="btnToggleAnual" onclick="setPricingMode('anual')">
              <span>Assinatura Anual</span>
              <span class="discount-badge">3 Meses Grátis</span>
            </button>
            <button class="pricing-toggle-btn" id="btnToggleAvulso" onclick="setPricingMode('avulso')">
              <span>Compra Avulsa (Créditos)</span>
            </button>
          </div>
        </div>

        <!-- Grid de 4 Cards de Preço com Valores Anuais como Padrão -->
        <div class="pricing-grid">
          
          <!-- Plano 1: Grátis -->
          <div class="pricing-card clint-card">
            <div>
              <div class="plan-name" style="color:#10B981;">Gratuito</div>
              <p style="font-size:13px; color:var(--text-muted);">Para testar a velocidade e a precisão da IA</p>
              
              <div class="plan-price-row">
                <span class="plan-price">R$&nbsp;0</span>
                <span class="plan-period">/ grátis</span>
              </div>
              <div class="plan-billing-detail">Gratuito para sempre</div>

              <div class="plan-minutes-pill" style="color:#10B981; border: 1px solid rgba(16,185,129,0.3);">
                ⏱️ 5 min para começar
              </div>

              <ul class="plan-features-list">
                <li><span style="color:#10B981;">✓</span> 5 minutos grátis imediatos no cadastro</li>
                <li><span style="color:#10B981;">✓</span> YouTube, Reels, TikTok e +1.700 sites</li>
                <li><span style="color:#10B981;">✓</span> Download do texto em arquivo .TXT</li>
                <li><span style="color:#10B981;">✓</span> Sem necessidade de cartão de crédito</li>
                <li><span style="color:#10B981;">✓</span> Deleção automática com privacidade</li>
              </ul>
            </div>

            <a href="/login?signup=true" class="btn-secondary" style="width:100%; border-color: rgba(16,185,129,0.4); color:#6EE7B7;" onclick="handleStartFree(event)">
              Começar grátis
            </a>
          </div>

          <!-- Plano 2: Starter -->
          <div class="pricing-card clint-card" id="cardStarter">
            <div>
              <div class="plan-name" style="color:#06B6D4;">Starter Anual</div>
              <p style="font-size:13px; color:var(--text-muted);" id="starterDesc">Transcreva todo mês com a máxima economia anual</p>
              
              <div class="plan-price-row">
                <span class="plan-price" id="starterPrice">R$&nbsp;3,74</span>
                <span class="plan-period" id="starterPeriod">/ mês</span>
              </div>
              <div class="plan-billing-detail" id="starterDetail">R$ 44,90 faturados ao ano (ou 12x de R$ 4,49)</div>

              <div class="plan-minutes-pill" style="color:#06B6D4; border: 1px solid rgba(6,182,212,0.3);" id="starterMinutes">
                ⏱️ 720 min/ano (60 min/mês)
              </div>

              <ul class="plan-features-list" id="starterFeatures">
                <li><span style="color:#06B6D4;">✓</span> 720 minutos no ano (60 min/mês)</li>
                <li><span style="color:#06B6D4;">✓</span> Economia de R$ 13,90 (3 meses grátis)</li>
                <li><span style="color:#06B6D4;">✓</span> Download em arquivo .TXT</li>
                <li><span style="color:#06B6D4;">✓</span> Suporte a +1.700 plataformas e links</li>
                <li><span style="color:#06B6D4;">✓</span> Acesso garantido durante o ano todo</li>
              </ul>
            </div>

            <a href="/precos" class="btn-secondary" style="width:100%;" id="starterCta">
              Assinar Starter Anual
            </a>
          </div>

          <!-- Plano 3: PRO (POPULAR DESTAQUE COM BADGE CORRIGIDA) -->
          <div class="pricing-card clint-card popular" id="cardPro">
            
            <!-- BADGE 'MAIS ESCOLHIDO' CORRIGIDA COM ÍCONE NA MESMA LINHA -->
            <span class="popular-tag">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              <span>Mais escolhido</span>
            </span>

            <div>
              <div class="plan-name" style="color:#C4A4FF;" id="proTitle">Pro Anual</div>
              <p style="font-size:13px; color:rgba(255,255,255,0.7);" id="proDesc">O plano perfeito para quem cria conteúdo com frequência</p>
              
              <div class="plan-price-row">
                <span class="plan-price" id="proPrice" style="color:#fff;">R$&nbsp;13,25</span>
                <span class="plan-period" id="proPeriod">/ mês</span>
              </div>
              <div class="plan-billing-detail" id="proDetail" style="color:rgba(255,255,255,0.7);">R$ 159,00 faturados ao ano (ou 12x de R$ 15,90)</div>

              <div class="plan-minutes-pill" style="background: rgba(124,58,237,0.3); color:#fff; border: 1px solid rgba(255,255,255,0.3);" id="proMinutes">
                ⏱️ 3.600 min/ano (300 min/mês)
              </div>

              <ul class="plan-features-list" id="proFeatures" style="color:rgba(255,255,255,0.85);">
                <li><span style="color:#A78BFA; font-weight:700;">✓</span> <strong>3.600 minutos no ano (300 min/mês)</strong></li>
                <li><span style="color:#A78BFA; font-weight:700;">✓</span> <strong>Economia de R$ 55,80 (3 meses grátis)</strong></li>
                <li><span style="color:#A78BFA; font-weight:700;">✓</span> <strong>Resumos Executivos com IA inclusos</strong></li>
                <li><span style="color:#A78BFA; font-weight:700;">✓</span> <strong>Exportação .SRT, .DOCX Word e .PDF</strong></li>
                <li><span style="color:#A78BFA; font-weight:700;">✓</span> Player com timestamps e sincronia</li>
                <li><span style="color:#A78BFA; font-weight:700;">✓</span> Suporte a +1.700 plataformas e links</li>
              </ul>
            </div>

            <a href="/precos" class="btn-primary" style="width:100%; box-shadow: 0 4px 20px rgba(236,72,153,0.5);" id="proCta">
              Assinar Pro Anual →
            </a>
          </div>

          <!-- Plano 4: Business -->
          <div class="pricing-card clint-card" id="cardBusiness">
            <div>
              <div class="plan-name" style="color:#EC4899;" id="businessTitle">Business Anual</div>
              <p style="font-size:13px; color:var(--text-muted);" id="businessDesc">Para equipes, agências e alto volume de transcrição</p>
              
              <div class="plan-price-row">
                <span class="plan-price" id="businessPrice">R$&nbsp;59,90</span>
                <span class="plan-period" id="businessPeriod">/ mês</span>
              </div>
              <div class="plan-billing-detail" id="businessDetail">R$ 718,80 faturados ao ano (ou 12x de R$ 71,88)</div>

              <div class="plan-minutes-pill" style="color:#EC4899; border: 1px solid rgba(236,72,153,0.3);" id="businessMinutes">
                ⏱️ 12.000 min/ano (1.000 min/mês)
              </div>

              <ul class="plan-features-list" id="businessFeatures">
                <li><span style="color:#EC4899;">✓</span> 12.000 min no ano (1.000 min/mês)</li>
                <li><span style="color:#EC4899;">✓</span> Economia de R$ 240,00 no plano anual</li>
                <li><span style="color:#EC4899;">✓</span> Todos os formatos (.DOCX, .PDF, .SRT, .TXT)</li>
                <li><span style="color:#EC4899;">✓</span> Resumos executivos ilimitados</li>
                <li><span style="color:#EC4899;">✓</span> Suporte prioritário via WhatsApp e e-mail</li>
              </ul>
            </div>

            <a href="/precos" class="btn-secondary" style="width:100%;" id="businessCta">
              Assinar Business Anual
            </a>
          </div>

        </div>
      </div>
    </section>

    <!-- DEPOIMENTOS -->
    <section class="testimonials-section">
      <div class="container">
        <div style="text-align: center; margin-bottom: 56px;">
          <span class="section-eyebrow">Quem usa recomenda</span>
          <h2 class="section-title">Avaliado com 4.9 de 5 estrelas</h2>
          <p class="section-subtitle">Profissionais que substituíram horas de digitação manual por alguns cliques.</p>
        </div>

        <div class="testimonials-grid">
          <div class="testimonial-card clint-card">
            <div class="stars-row">★★★★★</div>
            <p class="quote-text">
              "Uso todo dia para transcrever entrevistas de campo. Economizo facilmente 4 a 5 horas por matéria. A identificação de gírias e pontuação em português brasileiro é disparada a melhor do mercado."
            </p>
            <div class="user-info">
              <div class="user-avatar" style="background:#7C3AED;">JF</div>
              <div>
                <p style="font-weight:700; font-size:14px;">Juliana Ferreira</p>
                <p style="font-size:12px; color:var(--text-dim);">Jornalista Investigativa • Folha/UOL</p>
              </div>
            </div>
          </div>

          <div class="testimonial-card clint-card">
            <div class="stars-row">★★★★★</div>
            <p class="quote-text">
              "O recurso de exportar o arquivo .SRT direto para o CapCut e Premiere cortou o tempo de edição dos meus Reels pela metade. Não consigo mais viver sem isso na minha produtora."
            </p>
            <div class="user-info">
              <div class="user-avatar" style="background:#EC4899;">RS</div>
              <div>
                <p style="font-weight:700; font-size:14px;">Rafael Souza</p>
                <p style="font-size:12px; color:var(--text-dim);">Criador de Conteúdo & Editor (450k seguidores)</p>
              </div>
            </div>
          </div>

          <div class="testimonial-card clint-card">
            <div class="stars-row">★★★★★</div>
            <p class="quote-text">
              "Transcrevo reuniões de diretoria e audiências preliminares. O que me convenceu foi a política de privacidade estrita: o arquivo é destruído após o download. Segurança indispensável."
            </p>
            <div class="user-info">
              <div class="user-avatar" style="background:#06B6D4;">ML</div>
              <div>
                <p style="font-weight:700; font-size:14px;">Dr. Marcelo Lacerda</p>
                <p style="font-size:12px; color:var(--text-dim);">Sócio de Advocacia Empresarial</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ ACCORDION -->
    <section class="faq-section" id="duvidas">
      <div class="container">
        <div style="text-align: center; margin-bottom: 56px;">
          <span class="section-eyebrow">Tire suas Dúvidas</span>
          <h2 class="section-title">Perguntas Frequentes</h2>
          <p class="section-subtitle">Tudo o que você precisa saber antes de começar.</p>
        </div>

        <div class="faq-accordion">
          
          <div class="faq-item open">
            <div class="faq-question" onclick="toggleFaq(this)">
              <span>Quais sites e formatos de vídeo e áudio são aceitos?</span>
              <span class="faq-icon">+</span>
            </div>
            <div class="faq-answer">
              Suportamos mais de 1.700 plataformas pela internet: YouTube, Instagram Reels, TikTok, Vimeo, Facebook, Twitter/X, Twitch, Soundcloud, além de áudios encaminhados do WhatsApp. Você também pode enviar arquivos diretamente do seu computador ou celular nos formatos MP3, MP4, WAV, M4A, OGG, FLAC e MOV de até 2GB.
            </div>
          </div>

          <div class="faq-item">
            <div class="faq-question" onclick="toggleFaq(this)">
              <span>Como funciona a garantia de privacidade e a deleção de mídia?</span>
              <span class="faq-icon">+</span>
            </div>
            <div class="faq-answer">
              Levamos a privacidade muito a sério. Nenhuma mídia de áudio ou vídeo permanece armazenada em nossos servidores de forma duradoura. Após o processamento e download da sua transcrição, o arquivo de mídia original é excluído permanentemente dos servidores em conformidade estrita com a LGPD. Seus dados nunca são comercializados nem usados para treinar modelos públicos.
            </div>
          </div>

          <div class="faq-item">
            <div class="faq-question" onclick="toggleFaq(this)">
              <span>Preciso cadastrar cartão de crédito para testar?</span>
              <span class="faq-icon">+</span>
            </div>
            <div class="faq-answer">
              Não! Novos usuários recebem 5 minutos de transcrição totalmente gratuitos no cadastro sem precisar inserir nenhum dado de cartão de crédito. É só colar o link ou subir o arquivo para conferir a qualidade.
            </div>
          </div>

          <div class="faq-item">
            <div class="faq-question" onclick="toggleFaq(this)">
              <span>Qual a precisão da IA para português brasileiro e sotaques?</span>
              <span class="faq-icon">+</span>
            </div>
            <div class="faq-answer">
              Utilizamos uma tecnologia de IA +rápida e +precisa, otimizada especialmente para português brasileiro. Ela alcança mais de 98% de precisão mesmo com sotaques do Nordeste, Sul, Sudeste ou interior, sobreposições de vozes, termos técnicos e pequenos ruídos de fundo.
            </div>
          </div>

          <div class="faq-item">
            <div class="faq-question" onclick="toggleFaq(this)">
              <span>Como funcionam os resumos executivos com IA?</span>
              <span class="faq-icon">+</span>
            </div>
            <div class="faq-answer">
              Disponível a partir do plano Pro, o nosso motor analisa o contexto da conversa inteira e produz uma síntese de alta densidade: lista dos tópicos principais discutidos, decisões acordadas, citações relevantes e tarefas atribuídas a cada participante, poupando a leitura de dezenas de páginas.
            </div>
          </div>

          <div class="faq-item">
            <div class="faq-question" onclick="toggleFaq(this)">
              <span>Os minutos comprados têm prazo de expiração?</span>
              <span class="faq-icon">+</span>
            </div>
            <div class="faq-answer">
              Nos pacotes avulsos, os minutos não têm cobrança mensal recorrente e têm validade generosa: 6 meses para o Starter, 12 meses para o Pro e 24 meses para o Business. Na assinatura anual, seus minutos renovam todo mês durante os 12 meses de contrato.
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- SUPER CTA FINAL -->
    <section class="cta-banner-section">
      <div class="container">
        <div class="cta-glow-box">
          <span class="badge-pill" style="margin-bottom: 24px;">
            <span class="pill-dot"></span>
            <span>Comece agora mesmo em menos de 30 segundos</span>
          </span>
          <h2 class="cta-title">
            Pronto para parar de perder tempo<br>
            <span class="gradient-text">digitando o que pode ser automatizado?</span>
          </h2>
          <p class="cta-desc">
            Junte-se a milhares de criadores, jornalistas, acadêmicos e empresas. Comece com 5 minutos gratuitos hoje mesmo.
          </p>
          <div class="cta-buttons-row">
            <a href="/login?signup=true" class="btn-primary" style="padding: 16px 36px; font-size: 16px;" onclick="handleStartFree(event)">
              <span>Começar grátis</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <a href="/precos" class="btn-secondary" style="padding: 16px 32px; font-size: 16px;">
              Ver todos os planos →
            </a>
          </div>
          <p style="font-size: 12px; color: var(--text-dim); margin-top: 24px;">
            🔒 Sem cartão de crédito • 100% em conformidade com a LGPD • Ativação imediata
          </p>
        </div>
      </div>
    </section>

  </main>

  <!-- FOOTER COM O LOGO ORIGINAL E O E-MAIL CONTATO@PEGUEIOTEXTO.COM.BR -->
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        
        <div>
          <a href="#" style="display: flex; align-items: center; margin-bottom: 16px;">
            <img src="/logo.png" alt="Peguei o Texto" class="brand-logo-img">
          </a>
          <p class="footer-desc">
            A ferramenta mais rápida e precisa para transformar áudios e vídeos da internet em textos, resumos e legendas profissionais com Inteligência Artificial.
          </p>
          <div style="margin-top: 20px;">
            <p style="font-size: 12px; color: var(--text-dim); text-transform: uppercase; font-weight: 700; letter-spacing: 0.08em; margin-bottom: 6px;">Atendimento & Dúvidas:</p>
            <a href="mailto:contato@pegueiotexto.com.br" class="footer-email-highlight">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              <span>contato@pegueiotexto.com.br</span>
            </a>
          </div>
        </div>

        <div>
          <h4 class="footer-col-title">Ferramentas</h4>
          <ul class="footer-links">
            <li><a href="#transcrever" class="footer-link">Transcrever YouTube</a></li>
            <li><a href="#transcrever" class="footer-link">Transcrever Reels</a></li>
            <li><a href="#transcrever" class="footer-link">Transcrever TikTok</a></li>
            <li><a href="#transcrever" class="footer-link">Transcrever WhatsApp</a></li>
            <li><a href="#transcrever" class="footer-link">Gerar Legendas .SRT</a></li>
            <li><a href="#baixar-video" class="footer-link" style="color:var(--brand-violet-light);">Baixar Vídeo Online</a></li>
          </ul>
        </div>

        <div>
          <h4 class="footer-col-title">Navegação</h4>
          <ul class="footer-links">
            <li><a href="#como-funciona" class="footer-link">Como funciona</a></li>
            <li><a href="#recursos" class="footer-link">Recursos IA</a></li>
            <li><a href="#blog" class="footer-link">Blog & Conteúdos</a></li>
            <li><a href="#precos" class="footer-link">Planos e Preços</a></li>
            <li><a href="#casos-de-uso" class="footer-link">Casos de Uso</a></li>
            <li><a href="#duvidas" class="footer-link">Central de Ajuda</a></li>
          </ul>
        </div>

        <div>
          <h4 class="footer-col-title">Privacidade & Legal</h4>
          <ul class="footer-links">
            <li><a href="#" class="footer-link">Política de Privacidade</a></li>
            <li><a href="#" class="footer-link">Termos de Serviço</a></li>
            <li><a href="#" class="footer-link">Conformidade LGPD</a></li>
            <li><a href="#" class="footer-link">Política Zero-Retention</a></li>
            <li><a href="mailto:contato@pegueiotexto.com.br" class="footer-link">Fale Conosco</a></li>
          </ul>
        </div>

      </div>

      <div class="footer-bottom">
        <div>
          © 2026 Peguei o Texto. Todos os direitos reservados.
        </div>
        <div style="display: flex; gap: 16px;">
          <span>Privacidade Zero-Retention Garantida</span>
          <span>•</span>
          <span>contato@pegueiotexto.com.br</span>
        </div>
      </div>
    </div>
  </footer>

  <!-- ==========================================================================
       SCRIPTS INTERATIVOS
       ========================================================================== */ -->
  `;

export default function HomePage() {
  useEffect(() => {
    
    // 1. Gerador da Waveform do Player
    function initWaveform() {
      const visualizer = document.getElementById('waveVisualizer');
      if (!visualizer) return;
      visualizer.innerHTML = '';
      const barCount = 36;
      for (let i = 0; i < barCount; i++) {
        const bar = document.createElement('div');
        bar.className = 'wave-bar' + (i < 14 ? ' active' : '');
        const h = Math.floor(Math.sin(i * 0.45) * 14 + 18);
        bar.style.height = h + 'px';
        visualizer.appendChild(bar);
      }
    }
    initWaveform();

    // 2. Play / Pause Simulado
    let isPlaying = false;
    let waveInterval;
    function togglePlayAudio(btn) {
      isPlaying = !isPlaying;
      if (isPlaying) {
        btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
        waveInterval = setInterval(() => {
          const bars = document.querySelectorAll('.wave-bar');
          bars.forEach((b) => {
            const randomH = Math.floor(Math.random() * 26 + 8);
            b.style.height = randomH + 'px';
          });
        }, 120);
      } else {
        btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
        clearInterval(waveInterval);
        initWaveform();
      }
    }

    // 3. Abas de Modo de Transcrição
    let currentTranscribeMode = 'url';

    function switchTranscribeTab(mode, btn) {
      document.querySelectorAll('.transcribe-tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      currentTranscribeMode = mode;
      const input = document.getElementById('heroUrlInput');
      if (mode === 'url') {
        input.placeholder = 'Cole aqui o link do YouTube, Instagram Reels, TikTok, Vimeo ou Twitter...';
        input.value = 'https://www.youtube.com/watch?v=leNA0tw7Fzk';
      } else if (mode === 'upload') {
        input.placeholder = 'Clique para selecionar arquivo de áudio ou vídeo (MP3, MP4, WAV, M4A)...';
        input.value = '';
        const fileInput = document.getElementById('heroFileInput');
        if (fileInput) fileInput.click();
      } else {
        input.placeholder = 'Gravação Direta: clique em Começar grátis para gravar no seu painel...';
        input.value = '';
      }
    }

    function handleHeroFileSelected(fileInput) {
      if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        const input = document.getElementById('heroUrlInput');
        if (input) {
          const mb = (file.size / (1024 * 1024)).toFixed(1);
          input.value = `📁 ${file.name} (${mb} MB)`;
        }
      }
    }

    async function handleTranscribeAction() {
      const btn = document.querySelector('.transcribe-btn');
      const input = document.getElementById('heroUrlInput');
      const rawValue = input ? input.value.trim() : '';

      if (btn) {
        btn.innerHTML = '<span>Redirecionando...</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
        btn.style.opacity = '0.7';
      }

      // Se inseriu link de vídeo no modo URL, salva no localStorage para processar no dashboard
      if (currentTranscribeMode === 'url' && rawValue && !rawValue.startsWith('📁')) {
        try {
          localStorage.setItem('pegueiotexto_pending_url', rawValue);
        } catch (e) {}
      }

      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          window.location.href = '/dashboard?auto_transcribe=true';
        } else {
          window.location.href = '/login?signup=true&reason=transcribe&redirect=/dashboard?auto_transcribe=true';
        }
      } catch (err) {
        window.location.href = '/login?signup=true&reason=transcribe&redirect=/dashboard?auto_transcribe=true';
      }
    }

    async function handleStartFree(e) {
      if (e) e.preventDefault();
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          window.location.href = '/dashboard';
        } else {
          window.location.href = '/login?signup=true';
        }
      } catch (err) {
        window.location.href = '/login?signup=true';
      }
    }

    // 4. Chips Rápidos
    const samplePresets = {
      youtube: {
        url: 'https://www.youtube.com/watch?v=leNA0tw7Fzk',
        badge: '▶ YouTube',
        title: 'Como a Inteligência Artificial Transforma o Trabalho com Áudio',
      },
      instagram: {
        url: 'https://www.instagram.com/reel/C892189x/',
        badge: '📷 Instagram Reels',
        title: '3 Dicas para Gravar Vídeos Verticais com Áudio Cristalino',
      },
      tiktok: {
        url: 'https://www.tiktok.com/@growth/video/728192837192',
        badge: '♪ TikTok',
        title: 'Cortes Virais: Estratégia de Conteúdo e Retenção em 2026',
      },
      whatsapp: {
        url: 'whatsapp_audio_2026-11-04_1420.ogg',
        badge: '💬 WhatsApp Áudio',
        title: 'Áudio de Reunião com Diretor Comercial e Alinhamento de Metas',
      },
      podcast: {
        url: 'https://open.spotify.com/episode/9283718928',
        badge: '🎙️ Podcast',
        title: 'Episódio #42: Os Segredos da Produtividade em Comunicação',
      }
    };

    function fillSample(type) {
      const data = samplePresets[type];
      if (!data) return;
      document.getElementById('heroUrlInput').value = data.url;
      document.getElementById('sourceBadge').textContent = data.badge;
      document.getElementById('videoTitleDemo').textContent = data.title;
      
      const container = document.getElementById('inputContainer');
      container.style.borderColor = '#A78BFA';
      setTimeout(() => {
        container.style.borderColor = 'rgba(255, 255, 255, 0.08)';
      }, 500);
    }

    function simulateTranscribe() {
      const btn = document.querySelector('.transcribe-btn');
      btn.innerHTML = '<span>Processando IA...</span>';
      btn.style.opacity = '0.7';
      setTimeout(() => {
        btn.innerHTML = '<span>Começar grátis</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
        btn.style.opacity = '1';
        document.getElementById('demo').scrollIntoView({ behavior: 'smooth' });
      }, 600);
    }

    // 5. Abas do Palco do Resultado
    function switchResultTab(tabName, btn) {
      document.querySelectorAll('.view-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      document.getElementById('tabContentFull').style.display = tabName === 'full' ? 'flex' : 'none';
      document.getElementById('tabContentSummary').style.display = tabName === 'summary' ? 'flex' : 'none';
      document.getElementById('tabContentSrt').style.display = tabName === 'srt' ? 'flex' : 'none';
    }

    // 6. Copiar Texto
    function copyMockText(btn) {
      const textToCopy = `[00:00] Bem-vindos ao nosso canal! Hoje vamos falar sobre como a inteligência artificial está transformando a forma como trabalhamos com conteúdo audiovisual.
[00:14] Nos últimos anos, vimos uma explosão no volume de vídeos produzidos, de podcasts a webinars.
[00:32] Com o Peguei o Texto, basta colar o link ou subir o arquivo para gerar legendas sincronizadas e resumos executivos.`;
      
      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span style="color:#10B981;">✓ Copiado!</span>';
        setTimeout(() => {
          btn.innerHTML = originalText;
        }, 1800);
      });
    }

    // 7. Dados dos Casos de Uso
    const useCaseData = [
      {
        tag: "Para Criadores de Conteúdo & Youtubers",
        title: "Legendas automáticas e cortes de podcast sem dor de cabeça",
        desc: "Transforme vídeos longos em dezenas de Reels e TikToks legendados. Exporte o arquivo .SRT com timestamps milissegundo a milissegundo prontos para importar no Premiere, CapCut ou DaVinci Resolve.",
        stats: "Economia média: 12 horas por semana de edição",
        bullets: [
          "Exportação de legendas .SRT sincronizadas",
          "Criação de títulos, descrições e roteiros derivados com IA",
          "Fim do trabalho braçal de digitar cada palavra dita"
        ]
      },
      {
        tag: "Para Empresas, Consultores & Gestores",
        title: "Atas de reuniões do Meet, Teams e Zoom em segundos",
        desc: "Grave suas reuniões comerciais, one-on-ones e alinhamentos de diretoria. Nossa IA extrai as principais decisões, acordos de preço e planos de ação para compartilhar no Slack, Notion ou e-mail.",
        stats: "100% dos participantes alinhados após cada chamada",
        bullets: [
          "Identificação clara de quem falou o quê (diarização)",
          "Geração de atas formatadas para Word e PDF",
          "Conformidade total com a LGPD e privacidade garantida"
        ]
      },
      {
        tag: "Para Estudantes, Concurseiros & Acadêmicos",
        title: "Transforme horas de videoaulas em apostilas de estudo",
        desc: "Não perca tempo pausando o vídeo a cada 30 segundos para fazer anotações. Cole o link da aula e receba o texto integral com resumo dos tópicos fundamentais para revisar antes da prova.",
        stats: "Retenção de aprendizado 3x maior com leitura ativa",
        bullets: [
          "Transcrição de palestras, webinars e defesas de tese",
          "Destaque automático de conceitos e definições-chave",
          "Exportação em PDF diagramado para imprimir ou grifar no tablet"
        ]
      },
      {
        tag: "Para Jornalistas, Redatores & Pesquisadores",
        title: "Entrevistas longas decupadas e citáveis com precisão",
        desc: "Chega de passar a madrugada ouvindo gravações no gravador de voz. O Peguei o Texto entrega o texto com timestamps clicáveis: clique em qualquer trecho para ouvir exatamente aquele segundo do áudio.",
        stats: "Matérias e artigos publicados no mesmo dia da apuração",
        bullets: [
          "Suporte a áudios de baixa qualidade e com ruído de rua",
          "Preservação rigorosa de aspas e declarações de fontes",
          "Busca por palavras-chave em segundos dentro do texto"
        ]
      },
      {
        tag: "Para Advogados, Peritos & Cartórios",
        title: "Oitivas e audiências registradas com sigilo profissional",
        desc: "Degravação de audiências judiciais, depoimentos de testemunhas e sessões de mediação. Nossos servidores não mantêm histórico de áudio nem armazenam mídias após a entrega do documento.",
        stats: "Sigilo absoluto garantido por arquitetura efêmera",
        bullets: [
          "Documento formatado em .DOCX pronto para juntada aos autos",
          "Criptografia de ponta a ponta durante o envio",
          "Conformidade com os padrões éticos e de proteção de dados"
        ]
      }
    ];

    function switchUseCase(index, btn) {
      document.querySelectorAll('.usecase-tab-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderUseCase(index);
    }

    function renderUseCase(index) {
      const d = useCaseData[index];
      const box = document.getElementById('useCaseContent');
      box.innerHTML = `
        <div class="usecase-grid">
          <div>
            <span class="bento-badge badge-purple" style="margin-bottom:14px;">${d.tag}</span>
            <h3 style="font-size:26px; font-weight:800; line-height:1.25; margin-bottom:16px;">${d.title}</h3>
            <p style="font-size:15px; color:var(--text-muted); line-height:1.7; margin-bottom:24px;">${d.desc}</p>
            <div style="padding:14px 18px; border-radius:12px; background:rgba(124,58,237,0.12); border:1px solid rgba(124,58,237,0.25); font-size:13.5px; font-weight:700; color:#C4A4FF; margin-bottom:24px;">
              ⚡ ${d.stats}
            </div>
            <a href="/login?signup=true" class="btn-primary" style="padding:12px 24px; font-size:14px;" onclick="handleStartFree(event)">
              Começar grátis neste cenário →
            </a>
          </div>

          <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:18px; padding:28px;">
            <p style="font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.12em; color:var(--brand-cyan); margin-bottom:18px;">
              Vantagens Imediatas:
            </p>
            <ul style="list-style:none; display:flex; flex-direction:column; gap:16px;">
              ${d.bullets.map(b => `
                <li style="display:flex; align-items:flex-start; gap:12px; font-size:14px; color:#E2E8F0; line-height:1.5;">
                  <span style="color:#10B981; font-weight:700; margin-top:2px;">✓</span>
                  <span>${b}</span>
                </li>
              `).join('')}
            </ul>
          </div>
        </div>
      `;
    }
    renderUseCase(0);

    // 8. Toggle de Preços: Assinatura Anual (Destaque Principal) vs Compra Avulsa
    function setPricingMode(mode) {
      const btnAnual = document.getElementById('btnToggleAnual');
      const btnAvulso = document.getElementById('btnToggleAvulso');
      
      const starterTitle = document.querySelector('#cardStarter .plan-name');
      const starterDesc = document.getElementById('starterDesc');
      const starterPrice = document.getElementById('starterPrice');
      const starterPeriod = document.getElementById('starterPeriod');
      const starterDetail = document.getElementById('starterDetail');
      const starterMinutes = document.getElementById('starterMinutes');
      const starterFeatures = document.getElementById('starterFeatures');
      const starterCta = document.querySelector('#cardStarter a');

      const proTitle = document.getElementById('proTitle');
      const proDesc = document.getElementById('proDesc');
      const proPrice = document.getElementById('proPrice');
      const proPeriod = document.getElementById('proPeriod');
      const proDetail = document.getElementById('proDetail');
      const proMinutes = document.getElementById('proMinutes');
      const proFeatures = document.getElementById('proFeatures');
      const proCta = document.getElementById('proCta');

      const businessTitle = document.getElementById('businessTitle');
      const businessDesc = document.getElementById('businessDesc');
      const businessPrice = document.getElementById('businessPrice');
      const businessPeriod = document.getElementById('businessPeriod');
      const businessDetail = document.getElementById('businessDetail');
      const businessMinutes = document.getElementById('businessMinutes');
      const businessFeatures = document.getElementById('businessFeatures');
      const businessCta = document.getElementById('businessCta');

      if (mode === 'anual') {
        btnAnual.classList.add('active');
        btnAvulso.classList.remove('active');

        // Starter Anual
        starterTitle.textContent = 'Starter Anual';
        starterDesc.textContent = 'Transcreva todo mês com a máxima economia anual';
        starterPrice.innerHTML = 'R$&nbsp;3,74';
        starterPeriod.textContent = '/ mês';
        starterDetail.textContent = 'R$ 44,90 faturados ao ano (ou 12x de R$ 4,49)';
        starterMinutes.textContent = '⏱️ 720 min/ano (60 min/mês)';
        starterFeatures.innerHTML = `
          <li><span style="color:#06B6D4;">✓</span> 720 minutos no ano (60 min/mês)</li>
          <li><span style="color:#06B6D4;">✓</span> Economia de R$ 13,90 (3 meses grátis)</li>
          <li><span style="color:#06B6D4;">✓</span> Download em arquivo .TXT</li>
          <li><span style="color:#06B6D4;">✓</span> Suporte a +1.700 plataformas e links</li>
          <li><span style="color:#06B6D4;">✓</span> Acesso garantido durante o ano todo</li>
        `;
        starterCta.textContent = 'Assinar Starter Anual';

        // Pro Anual (Mais Escolhido)
        proTitle.textContent = 'Pro Anual';
        proDesc.textContent = 'O plano perfeito para quem cria conteúdo com frequência';
        proPrice.innerHTML = 'R$&nbsp;13,25';
        proPeriod.textContent = '/ mês';
        proDetail.textContent = 'R$ 159,00 faturados ao ano (ou 12x de R$ 15,90)';
        proMinutes.textContent = '⏱️ 3.600 min/ano (300 min/mês)';
        proFeatures.innerHTML = `
          <li><span style="color:#A78BFA; font-weight:700;">✓</span> <strong>3.600 minutos no ano (300 min/mês)</strong></li>
          <li><span style="color:#A78BFA; font-weight:700;">✓</span> <strong>Economia de R$ 55,80 (3 meses grátis)</strong></li>
          <li><span style="color:#A78BFA; font-weight:700;">✓</span> <strong>Resumos Executivos com IA inclusos</strong></li>
          <li><span style="color:#A78BFA; font-weight:700;">✓</span> <strong>Exportação .SRT, .DOCX Word e .PDF</strong></li>
          <li><span style="color:#A78BFA; font-weight:700;">✓</span> Player com timestamps e sincronia</li>
          <li><span style="color:#A78BFA; font-weight:700;">✓</span> Suporte a +1.700 plataformas e links</li>
        `;
        proCta.textContent = 'Assinar Pro Anual →';

        // Business Anual
        businessTitle.textContent = 'Business Anual';
        businessDesc.textContent = 'Para equipes, agências e alto volume de transcrição';
        businessPrice.innerHTML = 'R$&nbsp;59,90';
        businessPeriod.textContent = '/ mês';
        businessDetail.textContent = 'R$ 718,80 faturados ao ano (ou 12x de R$ 71,88)';
        businessMinutes.textContent = '⏱️ 12.000 min/ano (1.000 min/mês)';
        businessFeatures.innerHTML = `
          <li><span style="color:#EC4899;">✓</span> 12.000 min no ano (1.000 min/mês)</li>
          <li><span style="color:#EC4899;">✓</span> Economia de R$ 240,00 no plano anual</li>
          <li><span style="color:#EC4899;">✓</span> Todos os formatos (.DOCX, .PDF, .SRT, .TXT)</li>
          <li><span style="color:#EC4899;">✓</span> Resumos executivos ilimitados</li>
          <li><span style="color:#EC4899;">✓</span> Suporte prioritário via WhatsApp e e-mail</li>
        `;
        businessCta.textContent = 'Assinar Business Anual';

      } else {
        btnAnual.classList.remove('active');
        btnAvulso.classList.add('active');

        // Starter Avulso
        starterTitle.textContent = 'Starter';
        starterDesc.textContent = 'Perfeito para uso esporádico e testes rápidos';
        starterPrice.innerHTML = 'R$&nbsp;4,90';
        starterPeriod.textContent = 'pagamento único';
        starterDetail.textContent = 'Apenas R$ 0,08 por minuto • Sem mensalidades';
        starterMinutes.textContent = '⏱️ 60 minutos de áudio';
        starterFeatures.innerHTML = `
          <li><span style="color:#06B6D4;">✓</span> 60 minutos de transcrição com IA</li>
          <li><span style="color:#06B6D4;">✓</span> Download em arquivo de texto puro (.TXT)</li>
          <li><span style="color:#06B6D4;">✓</span> Suporte a +1.700 plataformas e links</li>
          <li><span style="color:#06B6D4;">✓</span> Deleção automática com privacidade</li>
          <li><span style="color:#06B6D4;">✓</span> Validade de 6 meses para consumir</li>
        `;
        starterCta.textContent = 'Comprar Starter';

        // Pro Avulso (Mais Escolhido)
        proTitle.textContent = 'Pro';
        proDesc.textContent = 'Para criadores, editores e profissionais de conteúdo';
        proPrice.innerHTML = 'R$&nbsp;17,90';
        proPeriod.textContent = 'pagamento único';
        proDetail.textContent = 'Apenas R$ 0,05 por minuto • Sem mensalidades';
        proMinutes.textContent = '⏱️ 300 minutos de áudio';
        proFeatures.innerHTML = `
          <li><span style="color:#A78BFA; font-weight:700;">✓</span> <strong>300 minutos de transcrição com IA</strong></li>
          <li><span style="color:#A78BFA; font-weight:700;">✓</span> <strong>Download em .TXT, .SRT (Legendas) e .DOCX</strong></li>
          <li><span style="color:#A78BFA; font-weight:700;">✓</span> <strong>Exportação de documento PDF formatado</strong></li>
          <li><span style="color:#A78BFA; font-weight:700;">✓</span> <strong>Síntese e resumos executivos com IA inclusos</strong></li>
          <li><span style="color:#A78BFA; font-weight:700;">✓</span> Player de áudio sincronizado com timestamps</li>
          <li><span style="color:#A78BFA; font-weight:700;">✓</span> Validade de 12 meses para consumir</li>
        `;
        proCta.textContent = 'Comprar Pro →';

        // Business Avulso
        businessTitle.textContent = 'Business';
        businessDesc.textContent = 'Para equipes, agências e alto volume de transcrição';
        businessPrice.innerHTML = 'R$&nbsp;79,90';
        businessPeriod.textContent = 'pagamento único';
        businessDetail.textContent = 'Apenas R$ 0,07 por minuto • Sem mensalidades';
        businessMinutes.textContent = '⏱️ 1.000 minutos de áudio';
        businessFeatures.innerHTML = `
          <li><span style="color:#EC4899;">✓</span> 1.000 minutos de transcrição com IA</li>
          <li><span style="color:#EC4899;">✓</span> Download em todos os formatos (.DOCX, .PDF, .SRT)</li>
          <li><span style="color:#EC4899;">✓</span> Síntese e resumos executivos com IA ilimitados</li>
          <li><span style="color:#EC4899;">✓</span> Suporte prioritário via WhatsApp e e-mail</li>
          <li><span style="color:#EC4899;">✓</span> Validade de 24 meses para consumir</li>
        `;
        businessCta.textContent = 'Comprar Business';
      }
    }

    // 9. FAQ Toggle
    function toggleFaq(element) {
      const item = element.parentElement;
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) {
        item.classList.add('open');
      }
    }

    // 10. Drawer Mobile Toggle
    function toggleMobileMenu() {
      const drawer = document.getElementById('mobileDrawer');
      drawer.style.display = drawer.style.display === 'flex' ? 'none' : 'flex';
    }
  

    // Bind to window for inline onclicks
    if (typeof window !== "undefined") {
      (window as any).initWaveform = initWaveform;
      (window as any).togglePlayAudio = togglePlayAudio;
      (window as any).switchTranscribeTab = switchTranscribeTab;
      (window as any).handleHeroFileSelected = handleHeroFileSelected;
      (window as any).handleTranscribeAction = handleTranscribeAction;
      (window as any).handleStartFree = handleStartFree;
      (window as any).fillSample = fillSample;
      (window as any).simulateTranscribe = handleTranscribeAction;
      (window as any).switchResultTab = switchResultTab;
      (window as any).copyMockText = copyMockText;
      (window as any).switchUseCase = switchUseCase;
      (window as any).renderUseCase = renderUseCase;
      (window as any).setPricingMode = setPricingMode;
      (window as any).toggleFaq = toggleFaq;
      (window as any).toggleMobileMenu = toggleMobileMenu;

      initWaveform();
      renderUseCase(0);
      setPricingMode('anual');

      // Detect user session and update navbar
      try {
        const supabase = createClient();
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user) {
            const navLogin = document.getElementById('navLoginLink');
            const navCta = document.getElementById('navCtaLink');
            if (navLogin) {
              navLogin.textContent = 'Sair';
              navLogin.setAttribute('href', '#');
              navLogin.onclick = async (e) => {
                e.preventDefault();
                await supabase.auth.signOut();
                window.location.reload();
              };
            }
            if (navCta) {
              navCta.setAttribute('href', '/dashboard');
              const span = navCta.querySelector('span');
              if (span) span.textContent = 'Meu Painel';
            }
            const mobileLogin = document.getElementById('mobileNavLoginLink');
            const mobileCta = document.getElementById('mobileNavCtaLink');
            if (mobileLogin) {
              mobileLogin.textContent = 'Sair';
              mobileLogin.setAttribute('href', '#');
              mobileLogin.onclick = async (e) => {
                e.preventDefault();
                await supabase.auth.signOut();
                window.location.reload();
              };
            }
            if (mobileCta) {
              mobileCta.setAttribute('href', '/dashboard');
              mobileCta.textContent = 'Meu Painel';
            }
          }
        });
      } catch (e) {}

      // Click on input in upload mode opens file selector
      const heroInput = document.getElementById('heroUrlInput');
      if (heroInput) {
        heroInput.addEventListener('click', () => {
          if (currentTranscribeMode === 'upload') {
            const fileInput = document.getElementById('heroFileInput');
            if (fileInput) fileInput.click();
          }
        });
      }
    }
  }, []);

  return (
    <main suppressHydrationWarning style={{ minHeight: "100vh", background: "var(--bg-base, #060309)" }}>
      <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: CLINT_HTML }} />
    </main>
  );
}
