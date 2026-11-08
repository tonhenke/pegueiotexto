// @ts-nocheck
"use client";
import React, { useEffect } from "react";
import "@/app/clint.css";
import { createClient } from "@/lib/supabase/client";
import { savePendingMedia } from "@/lib/pendingMedia";

const CLINT_HTML_EN = `

  <!-- AURORA BACKGROUND (CLINT SIGNATURE) -->
  <div class="aurora-bg">
    <div class="aurora-orb-center"></div>
    <div class="aurora-orb-left"></div>
    <div class="aurora-orb-right"></div>
    <div class="aurora-beam"></div>
    <div class="aurora-beam-2"></div>
  </div>
  <div class="bg-grid-overlay"></div>

  <!-- NAVBAR COM O LOGOTIPO ORIGINAL + MENUS 'DOWNLOAD VIDEO' E 'BLOG' -->
  <header class="navbar">
    <div class="container navbar-inner">
      <a href="/en" style="display: flex; align-items: center;">
        <img src="/logo.png" alt="Peguei o Texto" class="brand-logo-img">
      </a>

      <nav>
        <ul class="nav-links">
          <li><a href="#how-it-works" class="nav-link">How it works</a></li>
          <li><a href="#features" class="nav-link">Features</a></li>
          <li><a href="/en/download-video" class="nav-link" style="color: var(--brand-violet-light); font-weight: 600;">Download Video</a></li>
          <li><a href="/en/blog" class="nav-link">Blog</a></li>
          <li><a href="/en/pricing" class="nav-link">Pricing</a></li>
          <li><a href="#faq" class="nav-link">FAQ</a></li>
        </ul>
      </nav>

      <div class="nav-actions">
        <!-- Language Dropdown Selector (Active: English 🇺🇸 EN) -->
        <div id="langDropdownWrapper" style="position: relative; display: inline-block;">
          <button
            type="button"
            id="langDropdownBtn"
            onclick="toggleLangDropdown(event)"
            aria-label="Select language / Selecionar idioma"
            style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 8px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.12); color: rgba(255, 255, 255, 0.85); font-size: 13px; font-weight: 600; cursor: pointer; transition: background 0.2s, border-color 0.2s;"
            onmouseenter="this.style.background='rgba(255, 255, 255, 0.1)'; this.style.borderColor='rgba(255, 255, 255, 0.25)';"
            onmouseleave="this.style.background='rgba(255, 255, 255, 0.05)'; this.style.borderColor='rgba(255, 255, 255, 0.12)';"
          >
            <span style="font-size: 14px;">🇺🇸</span>
            <span>EN</span>
            <svg id="langChevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="opacity: 0.6; transition: transform 0.2s;"><path d="m6 9 6 6 6-6"/></svg>
          </button>

          <div
            id="langDropdownMenu"
            style="display: none; position: absolute; top: calc(100% + 6px); right: 0; background: rgba(15, 15, 35, 0.96); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 12px; padding: 6px; min-width: 140px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5); z-index: 9999; flex-direction: column; gap: 2px;"
          >
            <a
              href="/"
              onclick="try { localStorage.setItem('pegueiotexto_lang', 'pt'); } catch(e) {}"
              style="display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 8px 12px; border-radius: 8px; background: transparent; color: rgba(255, 255, 255, 0.8); text-decoration: none; font-size: 13px; font-weight: 600; transition: background 0.2s;"
              onmouseenter="this.style.background='rgba(255, 255, 255, 0.08)';"
              onmouseleave="this.style.background='transparent';"
            >
              <span style="display: flex; align-items: center; gap: 8px;">
                <span>🇧🇷</span>
                <span>Português</span>
              </span>
            </a>

            <a
              href="/en"
              onclick="try { localStorage.setItem('pegueiotexto_lang', 'en'); } catch(e) {}"
              style="display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 8px 12px; border-radius: 8px; background: rgba(139, 92, 246, 0.18); color: #c084fc; text-decoration: none; font-size: 13px; font-weight: 600;"
            >
              <span style="display: flex; align-items: center; gap: 8px;">
                <span>🇺🇸</span>
                <span>English</span>
              </span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c084fc" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </a>
          </div>
        </div>

        <a href="/login" class="nav-login" id="navLoginLink">Log in</a>
        <a href="/login?signup=true" class="btn-primary nav-cta" id="navCtaLink" onclick="handleStartFree(event)">
          <span>Start free</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>

      <button class="menu-mobile-btn" aria-label="Menu Mobile" onclick="toggleMobileMenu()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
    </div>

    <!-- Mobile Drawer -->
    <div id="mobileDrawer" style="display: none; padding: 20px 24px; background: rgba(12,8,22,0.98); border-bottom: 1px solid rgba(255,255,255,0.1); flex-direction: column; gap: 14px;">
      <a href="#how-it-works" class="nav-link" onclick="toggleMobileMenu()">How it works</a>
      <a href="#features" class="nav-link" onclick="toggleMobileMenu()">Features</a>
      <a href="/en/download-video" class="nav-link" onclick="toggleMobileMenu()" style="color: var(--brand-violet-light); font-weight: 600;">Download Video</a>
      <a href="/en/blog" class="nav-link" onclick="toggleMobileMenu()">Blog</a>
      <a href="/en/pricing" class="nav-link" onclick="toggleMobileMenu()">Pricing</a>
      <a href="#faq" class="nav-link" onclick="toggleMobileMenu()">FAQ</a>
      <a href="/login" class="nav-link" id="mobileNavLoginLink" onclick="toggleMobileMenu()">Log in</a>
      <div style="display: flex; align-items: center; gap: 10px; padding: 8px 0; border-top: 1px solid rgba(255,255,255,0.06); border-bottom: 1px solid rgba(255,255,255,0.06); margin: 4px 0;">
        <span style="font-size: 12px; color: rgba(255,255,255,0.45); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Language:</span>
        <a href="/" onclick="try { localStorage.setItem('pegueiotexto_lang', 'pt'); } catch(e) {}" style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 8px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.12); color: rgba(255, 255, 255, 0.75); font-size: 13px; font-weight: 600; text-decoration: none;">
          <span>🇧🇷</span>
          <span>Português</span>
        </a>
        <a href="/en" onclick="try { localStorage.setItem('pegueiotexto_lang', 'en'); } catch(e) {}" style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 8px; background: rgba(139, 92, 246, 0.2); border: 1px solid rgba(139, 92, 246, 0.4); color: #c084fc; font-size: 13px; font-weight: 700; text-decoration: none;">
          <span>🇺🇸</span>
          <span>English</span>
        </a>
      </div>
      <a href="/login?signup=true" class="btn-primary" id="mobileNavCtaLink" style="margin-top: 8px; width: 100%;" onclick="toggleMobileMenu(); handleStartFree(event)">Start free</a>
    </div>
  </header>

  <main>
    <!-- HERO SECTION -->
    <section class="hero" id="transcribe">
      <div class="container hero-content">
        
        <!-- Badge Pill Clint Style -->
        <div style="margin-bottom: 24px;">
          <a href="/login?signup=true" class="badge-pill" onclick="handleStartFree(event)">
            <span class="pill-dot"></span>
            <span>✦ Faster & more accurate AI</span>
            <span style="color: var(--brand-violet-light);">start free →</span>
          </a>
        </div>

        <!-- Headline: 'Paste the link. Get the text.' -->
        <h1 class="hero-title">
          Paste the link.<br>
          <span class="gradient-text">Get the text.</span>
        </h1>

        <!-- High-Conversion Subtitle -->
        <p class="hero-subtitle">
          Transcribe video and audio from YouTube, TikTok, Instagram Reels, Vimeo and 1,700+ websites.
          Next-gen AI with 99.2% accuracy, executive summaries, synced .SRT subtitles, and total privacy.
        </p>

        <!-- INTERACTIVE TRANSCRIBE BOX WITH PRIMARY 'START FREE' BUTTON -->
        <div class="hero-transcribe-box clint-card">
          <!-- Input Tabs -->
          <div class="transcribe-tabs">
            <button class="transcribe-tab active" onclick="switchTranscribeTab('url', this)">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              Web Link
            </button>
            <button class="transcribe-tab" onclick="switchTranscribeTab('upload', this)">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              File Upload (MP3, MP4)
            </button>
            <button class="transcribe-tab" onclick="switchTranscribeTab('mic', this)">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>
              Record Audio
            </button>
          </div>

          <!-- Main Input Row with 'Start free' Button -->
          <input type="file" id="heroFileInput" style="display: none;" accept="audio/*,video/*" onchange="handleHeroFileSelected(this)">
          <div class="transcribe-input-row" id="inputContainer">
            <div class="transcribe-input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
            </div>
            <input 
              type="text" 
              class="transcribe-input" 
              id="heroUrlInput" 
              placeholder="Paste YouTube, TikTok, Instagram Reels, Vimeo or Twitter link here..."
              value="https://www.youtube.com/watch?v=leNAOtw7Fzk"
              onkeydown="if(event.key === 'Enter') handleTranscribeAction()"
            >
            <button class="btn-primary transcribe-btn" onclick="handleTranscribeAction()">
              <span>Start free</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>

          <!-- Quick Example Chips -->
          <div class="quick-chips-row">
            <span>Quick examples:</span>
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
              <span style="color:#25D366;">💬</span> WhatsApp Audio
            </button>
            <button class="chip-btn" onclick="fillSample('podcast')">
              <span style="color:#A855F7;">🎙️</span> Podcast / Interview
            </button>
          </div>
        </div>

        <!-- INTERACTIVE PRODUCT SHOWCASE -->
        <div class="hero-showcase-wrapper" id="demo">
          
          <!-- Floating Metrics Clint Style -->
          <div class="floating-metric metric-1">
            <div class="floating-metric-icon" style="background: rgba(124, 58, 237, 0.25); color: #C4A4FF;">
              ⚡
            </div>
            <div>
              <p style="font-size: 11px; color: var(--text-dim); text-transform: uppercase;">Extreme Speed</p>
              <p style="font-size: 14px; font-weight: 700; color: #fff;">1h of audio in 28s</p>
            </div>
          </div>

          <div class="floating-metric metric-2">
            <div class="floating-metric-icon" style="background: rgba(6, 182, 212, 0.25); color: #67E8F9;">
              🎯
            </div>
            <div>
              <p style="font-size: 11px; color: var(--text-dim); text-transform: uppercase;">AI Accuracy</p>
              <p style="font-size: 14px; font-weight: 700; color: #fff;">99.2% Precision</p>
            </div>
          </div>

          <div class="floating-metric metric-3">
            <div class="floating-metric-icon" style="background: rgba(16, 185, 129, 0.25); color: #6EE7B7;">
              🔒
            </div>
            <div>
              <p style="font-size: 11px; color: var(--text-dim); text-transform: uppercase;">Zero-Retention</p>
              <p style="font-size: 14px; font-weight: 700; color: #6EE7B7;">Media Purged Post-Download</p>
            </div>
          </div>

          <!-- Product Stage (Simulator with Tabs & Audio Player) -->
          <div class="product-stage">
            
            <!-- Window Header -->
            <div class="stage-browser-header">
              <div class="window-dots">
                <span class="window-dot dot-red"></span>
                <span class="window-dot dot-yellow"></span>
                <span class="window-dot dot-green"></span>
              </div>
              <div class="browser-url-bar">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <span>pegueiotexto.com.br/en/dashboard</span>
              </div>
              <div style="font-size: 11px; font-weight: 600; color: #10B981; display: flex; align-items: center; gap: 5px;">
                <span style="width:6px; height:6px; border-radius:50%; background:#10B981;"></span>
                Completed in 4.2s
              </div>
            </div>

            <!-- Stage Body -->
            <div class="stage-body">
              
              <!-- Left Panel: Media & Player -->
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
                    <span style="font-size: 12px; color: var(--text-dim); font-family: var(--font-mono);">128 kbps • Stereo</span>
                  </div>
                  <h4 style="font-size: 14px; font-weight: 700; color: #fff; line-height: 1.4;" id="videoTitleDemo">
                    Keynote: How Artificial Intelligence Transforms Audio & Video Content
                  </h4>
                </div>

                <!-- Animated Waveform -->
                <div class="waveform-visualizer" id="waveVisualizer">
                  <!-- Dynamically rendered via JS -->
                </div>

                <div class="media-info-row">
                  <span>Speed: <strong style="color:#C4A4FF;">1.5x</strong></span>
                  <span>Speakers: <strong style="color:var(--brand-cyan);">2 Detected</strong></span>
                  <span>Language: <strong style="color:#fff;">English (US)</strong></span>
                </div>
              </div>

              <!-- Right Panel: Full Transcript, AI Summary & Subtitles -->
              <div class="stage-transcript-card">
                
                <!-- Result View Tabs -->
                <div class="transcript-view-tabs">
                  <div class="view-tab-buttons">
                    <button class="view-tab-btn active" onclick="switchResultTab('full', this)">
                      Transcript
                    </button>
                    <button class="view-tab-btn" onclick="switchResultTab('summary', this)">
                      ✦ AI Summary
                    </button>
                    <button class="view-tab-btn" onclick="switchResultTab('srt', this)">
                      .SRT Subtitles
                    </button>
                  </div>

                  <!-- Copy and Download Actions -->
                  <div class="action-icons-group">
                    <button class="action-icon-btn" onclick="copyMockText(this)" title="Copy text">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                      <span>Copy</span>
                    </button>
                    <button class="action-icon-btn" onclick="alert('Export in .DOCX / .PDF / .SRT unlocked on all plans!')" title="Export format">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      <span>Export</span>
                    </button>
                  </div>
                </div>

                <!-- Content 1: Transcript with Timestamps -->
                <div class="transcript-stream" id="tabContentFull">
                  <div class="transcript-entry">
                    <div class="entry-header">
                      <span class="timestamp-badge">00:00</span>
                      <span class="speaker-name">🎙️ Speaker 1</span>
                    </div>
                    <p class="entry-text">
                      "Welcome everyone! Today we're diving into how artificial intelligence is transforming the way we work with audio and video content."
                    </p>
                  </div>

                  <div class="transcript-entry">
                    <div class="entry-header">
                      <span class="timestamp-badge">00:14</span>
                      <span class="speaker-name">🎙️ Speaker 1</span>
                    </div>
                    <p class="entry-text">
                      "Over the past few years, video production has exploded — from podcasts to webinars and interviews. But all that content remains locked away unless you index the full transcript."
                    </p>
                  </div>

                  <div class="transcript-entry">
                    <div class="entry-header">
                      <span class="timestamp-badge">00:32</span>
                      <span class="speaker-name">🎙️ Speaker 2</span>
                    </div>
                    <p class="entry-text">
                      "Exactly! With Peguei o Texto, simply paste a link or upload a file to get synced subtitles, executive takeaways, and export directly to Word or PDF."
                    </p>
                  </div>

                  <div class="transcript-entry">
                    <div class="entry-header">
                      <span class="timestamp-badge">00:50</span>
                      <span class="speaker-name">🎙️ Speaker 1</span>
                    </div>
                    <p class="entry-text">
                      "And best of all: complete privacy. Your media is automatically purged from the servers as soon as you finish downloading."
                    </p>
                  </div>
                </div>

                <!-- Content 2: AI Executive Summary -->
                <div class="summary-card-view" id="tabContentSummary" style="display: none;">
                  <div class="summary-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z"/></svg>
                    <span>AI-Generated Executive Summary</span>
                  </div>
                  <ul class="summary-bullets">
                    <li>
                      <span class="bullet-check">✓</span>
                      <span><strong>Primary Goal:</strong> Automate speech-to-text transcription, video indexing, and multi-format subtitle export.</span>
                    </li>
                    <li>
                      <span class="bullet-check">✓</span>
                      <span><strong>Key Pain Points Solved:</strong> Eliminates manual meeting minutes, generates ready-to-import video subtitles, and extracts interview quotes in seconds.</span>
                    </li>
                    <li>
                      <span class="bullet-check">✓</span>
                      <span><strong>Privacy & Security:</strong> Strict Zero-Retention architecture with irreversible media deletion immediately after processing.</span>
                    </li>
                    <li>
                      <span class="bullet-check">✓</span>
                      <span><strong>Export Formats:</strong> One-click download in .DOCX (Word), styled .PDF, timestamped .SRT, and plain .TXT.</span>
                    </li>
                  </ul>
                </div>

                <!-- Content 3: .SRT Subtitles -->
                <div class="transcript-stream" id="tabContentSrt" style="display: none; font-family: var(--font-mono); font-size: 13px;">
                  <div class="transcript-entry" style="border-left-color: #06B6D4;">
                    <p style="color:var(--text-dim);">1</p>
                    <p style="#67E8F9; font-weight:600;">00:00:00,000 --> 00:00:12,400</p>
                    <p style="color:#fff;">Welcome everyone! Today we're diving into how AI transforms audio content.</p>
                  </div>
                  <div class="transcript-entry" style="border-left-color: #06B6D4;">
                    <p style="color:var(--text-dim);">2</p>
                    <p style="#67E8F9; font-weight:600;">00:00:12,500 --> 00:00:28,200</p>
                    <p style="color:#fff;">In recent years, video and podcast production has experienced exponential growth.</p>
                  </div>
                  <div class="transcript-entry" style="border-left-color: #06B6D4;">
                    <p style="color:var(--text-dim);">3</p>
                    <p style="#67E8F9; font-weight:600;">00:00:28,300 --> 00:00:48,000</p>
                    <p style="color:#fff;">Simply paste any link to generate synced subtitles and executive summaries.</p>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>

    <!-- INFINITE PLATFORMS MARQUEE -->
    <section class="marquee-section">
      <div class="marquee-title">Compatible with over 1,700 platforms and universal formats</div>
      <div class="marquee-track">
        <span class="platform-pill"><span style="color:#FF0000; font-size:16px;">▶</span> YouTube & Shorts</span>
        <span class="platform-pill"><span style="color:#E1306C; font-size:16px;">📷</span> Instagram Reels</span>
        <span class="platform-pill"><span style="color:#00F2EA; font-size:16px;">♪</span> TikTok</span>
        <span class="platform-pill"><span style="color:#25D366; font-size:16px;">💬</span> WhatsApp Audio</span>
        <span class="platform-pill"><span style="color:#1DB954; font-size:16px;">🎧</span> Spotify Podcasts</span>
        <span class="platform-pill"><span style="color:#2D8CFF; font-size:16px;">🎥</span> Zoom Meetings</span>
        <span class="platform-pill"><span style="color:#00897B; font-size:16px;">👥</span> Google Meet</span>
        <span class="platform-pill"><span style="color:#5059C9; font-size:16px;">💼</span> Microsoft Teams</span>
        <span class="platform-pill"><span style="color:#1AB7EA; font-size:16px;">🎬</span> Vimeo</span>
        <span class="platform-pill"><span style="color:#1DA1F2; font-size:16px;">𝕏</span> Twitter / X</span>
        <span class="platform-pill"><span style="color:#9146FF; font-size:16px;">🎮</span> Twitch</span>
        <span class="platform-pill"><span style="color:#FF5500; font-size:16px;">☁️</span> SoundCloud</span>
        <span class="platform-pill"><span style="color:#A78BFA; font-size:16px;">📁</span> MP3, MP4, WAV, M4A</span>

        <!-- Loop duplication -->
        <span class="platform-pill"><span style="color:#FF0000; font-size:16px;">▶</span> YouTube & Shorts</span>
        <span class="platform-pill"><span style="color:#E1306C; font-size:16px;">📷</span> Instagram Reels</span>
        <span class="platform-pill"><span style="color:#00F2EA; font-size:16px;">♪</span> TikTok</span>
        <span class="platform-pill"><span style="color:#25D366; font-size:16px;">💬</span> WhatsApp Audio</span>
        <span class="platform-pill"><span style="color:#1DB954; font-size:16px;">🎧</span> Spotify Podcasts</span>
        <span class="platform-pill"><span style="color:#2D8CFF; font-size:16px;">🎥</span> Zoom Meetings</span>
        <span class="platform-pill"><span style="color:#00897B; font-size:16px;">👥</span> Google Meet</span>
        <span class="platform-pill"><span style="color:#5059C9; font-size:16px;">💼</span> Microsoft Teams</span>
        <span class="platform-pill"><span style="color:#1AB7EA; font-size:16px;">🎬</span> Vimeo</span>
        <span class="platform-pill"><span style="color:#1DA1F2; font-size:16px;">𝕏</span> Twitter / X</span>
        <span class="platform-pill"><span style="color:#9146FF; font-size:16px;">🎮</span> Twitch</span>
        <span class="platform-pill"><span style="color:#FF5500; font-size:16px;">☁️</span> SoundCloud</span>
        <span class="platform-pill"><span style="color:#A78BFA; font-size:16px;">📁</span> MP3, MP4, WAV, M4A</span>
      </div>
    </section>

    <!-- PRODUCT TOUR / VIDEO DEMO -->
    <section class="video-section">
      <div class="container">
        <span class="section-eyebrow">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          Platform Tour
        </span>
        <h2 class="section-title">
          Watch Peguei o Texto in action <span class="gradient-text">in real time</span>
        </h2>
        <p class="section-subtitle">
          See in 2 minutes how to paste a link, extract highly accurate transcriptions, generate executive summaries, and export ready-to-import subtitles.
        </p>

        <div class="video-frame-container">
          <div class="video-ambient-glow"></div>
          <div class="video-frame">
            <div class="video-aspect">
              <iframe 
                src="https://www.youtube.com/embed/leNAOtw7Fzk?rel=0&modestbranding=1" 
                title="Peguei o Texto Platform Walkthrough" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowfullscreen>
              </iframe>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- BENTO GRID FEATURES -->
    <section class="bento-section" id="features">
      <div class="container">
        <div style="text-align: center; margin-bottom: 56px;">
          <span class="section-eyebrow">✦ Powerful Features</span>
          <h2 class="section-title">Built for professionals who value every minute</h2>
          <p class="section-subtitle">The ultimate blend of blistering speed, deep analytical intelligence, and uncompromising privacy.</p>
        </div>

        <div class="bento-grid">
          
          <div class="bento-card-8 clint-card">
            <div class="bento-inner">
              <div>
                <span class="bento-badge badge-purple">Universal Support</span>
                <h3 class="bento-title">1,700+ Platforms Without Installation</h3>
                <p class="bento-desc">
                  Paste any public or unlisted link. Works seamlessly with YouTube, Reels, TikTok, Vimeo, podcasts, lectures, and audio files. No plugins, browser extensions, or bulky software required.
                </p>
              </div>
              <div class="format-pills-row">
                <span class="format-pill">▶ YouTube 4K</span>
                <span class="format-pill">📷 Instagram Reels</span>
                <span class="format-pill">♪ TikTok Viral</span>
                <span class="format-pill">💬 WhatsApp Audio</span>
                <span class="format-pill">🎧 Spotify / Podcasts</span>
                <span class="format-pill">📁 Files up to 2GB</span>
              </div>
            </div>
          </div>

          <div class="bento-card-4 clint-card">
            <div class="bento-inner">
              <div>
                <span class="bento-badge badge-cyan">Cognitive Synthesis</span>
                <h3 class="bento-title">AI Summaries & Meeting Notes</h3>
                <p class="bento-desc">
                  Don't want to read a 40-page transcript? Our AI distills meetings, webinars, and lectures into structured bullet points, key takeaways, and action items in 5 seconds.
                </p>
              </div>
              <div style="padding: 16px; border-radius: 12px; background: rgba(6, 182, 212, 0.08); border: 1px solid rgba(6, 182, 212, 0.2);">
                <p style="font-size: 11px; font-weight: 700; color: #67E8F9; text-transform: uppercase; margin-bottom: 6px;">Sample Output:</p>
                <p style="font-size: 12.5px; color: #E2E8F0; line-height: 1.5;">"Sales Meeting: Proposal aligned at $35k. Next step: legal agreement sent by Friday."</p>
              </div>
            </div>
          </div>

          <div class="bento-card-4 clint-card">
            <div class="bento-inner">
              <div>
                <span class="bento-badge badge-purple">Productivity</span>
                <h3 class="bento-title">4 Ready-to-Use Formats</h3>
                <p class="bento-desc">
                  Export in the exact format your software, team, or clients require.
                </p>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                <div class="format-pill" style="justify-content: center;">📄 .DOCX Word</div>
                <div class="format-pill" style="justify-content: center;">📕 Formatted .PDF</div>
                <div class="format-pill" style="justify-content: center;">🎬 .SRT Subtitles</div>
                <div class="format-pill" style="justify-content: center;">📝 Plain .TXT</div>
              </div>
            </div>
          </div>

          <div class="bento-card-8 clint-card" style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(6, 3, 10, 0.95)); border-color: rgba(16, 185, 129, 0.3);">
            <div class="bento-inner">
              <div>
                <span class="bento-badge badge-emerald">Military-Grade Security • Zero-Retention</span>
                <h3 class="bento-title">Your Media is Never Stored. Permanently Purged After Download.</h3>
                <p class="bento-desc">
                  Absolute confidentiality for sensitive interviews, executive meetings, legal depositions, and internal training. End-to-end encryption, ephemeral sandbox processing, and irreversible deletion immediately after download.
                </p>
              </div>
              <div style="display: flex; gap: 18px; flex-wrap: wrap;">
                <div style="display:flex; align-items:center; gap:8px; font-size:13px; color:#A7F3D0;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  No AI training on your private data
                </div>
                <div style="display:flex; align-items:center; gap:8px; font-size:13px; color:#A7F3D0;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Strict GDPR & LGPD Compliance
                </div>
                <div style="display:flex; align-items:center; gap:8px; font-size:13px; color:#A7F3D0;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  UUID hash encrypted filenames
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- USE CASES -->
    <section class="usecases-section" id="usecases">
      <div class="container">
        <div style="text-align: center; margin-bottom: 40px;">
          <span class="section-eyebrow">Solutions by Profile</span>
          <h2 class="section-title">Tailored for teams and creators who demand speed</h2>
          <p class="section-subtitle">Choose your use case and see how Peguei o Texto saves up to 15 hours every single week.</p>
        </div>

        <div class="usecase-tabs-nav">
          <button class="usecase-tab-pill active" onclick="switchUseCase(0, this)">
            <span>🎬</span> Creators & Editors
          </button>
          <button class="usecase-tab-pill" onclick="switchUseCase(1, this)">
            <span>💼</span> Business & Meetings
          </button>
          <button class="usecase-tab-pill" onclick="switchUseCase(2, this)">
            <span>🎓</span> Students & Research
          </button>
          <button class="usecase-tab-pill" onclick="switchUseCase(3, this)">
            <span>📰</span> Journalists & Podcasters
          </button>
          <button class="usecase-tab-pill" onclick="switchUseCase(4, this)">
            <span>⚖️</span> Legal & Law
          </button>
        </div>

        <div class="usecase-content-box clint-card" id="useCaseContent">
          <!-- Rendered via JS -->
        </div>

      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="steps-section" id="how-it-works">
      <div class="container">
        <div style="text-align: center; margin-bottom: 56px;">
          <span class="section-eyebrow">Direct Workflow</span>
          <h2 class="section-title">3 simple steps. Zero friction.</h2>
          <p class="section-subtitle">No complexity. You don't even need a credit card to try it.</p>
        </div>

        <div class="steps-row">
          <div class="step-card clint-card">
            <div class="step-number">01</div>
            <h3 class="step-title">Paste the link or upload your file</h3>
            <p class="step-desc">
              Paste a link from any video or upload an audio (MP3, WAV, M4A) or video (MP4, MOV) file up to 2GB.
            </p>
          </div>

          <div class="step-card clint-card">
            <div class="step-number">02</div>
            <h3 class="step-title">AI processes and formats</h3>
            <p class="step-desc">
              Our neural Whisper engine transcribes natural speech with timestamps, speaker separation, and noise filtering.
            </p>
          </div>

          <div class="step-card clint-card">
            <div class="step-number">03</div>
            <h3 class="step-title">Download your text & media is purged</h3>
            <p class="step-desc">
              Download your formatted .TXT, .DOCX, .PDF, or .SRT subtitles. Your original media is permanently and automatically deleted.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- PRICING SECTION -->
    <section class="pricing-section" id="pricing">
      <div class="container">
        <div style="text-align: center; margin-bottom: 30px;">
          <span class="section-eyebrow">Transparent Pricing</span>
          <h2 class="section-title">Only pay for what you actually use</h2>
          <p class="section-subtitle">Choose between maximum savings with Annual Subscriptions or flexible one-time credit packs with zero monthly fees.</p>
        </div>

        <!-- TOGGLE: ANNUAL HIGHLIGHT VS ONE-TIME PACKS -->
        <div class="pricing-toggle-wrap">
          <div class="pricing-toggle-pill">
            <button class="pricing-toggle-btn active" id="btnToggleAnual" onclick="setPricingMode('anual')">
              <span>Annual Subscription</span>
              <span class="discount-badge">3 Months Free</span>
            </button>
            <button class="pricing-toggle-btn" id="btnToggleAvulso" onclick="setPricingMode('avulso')">
              <span>One-Time Packs (Credits)</span>
            </button>
          </div>
        </div>

        <!-- 4 Pricing Cards -->
        <div class="pricing-grid">
          
          <!-- Plan 1: Free -->
          <div class="pricing-card clint-card">
            <div>
              <div class="plan-name" style="color:#10B981;">Free Trial</div>
              <p style="font-size:13px; color:var(--text-muted);">Test our AI speed and accuracy with zero commitment</p>
              
              <div class="plan-price-row">
                <span class="plan-price">$0</span>
                <span class="plan-period">/ free</span>
              </div>
              <div class="plan-billing-detail">Free forever</div>

              <div class="plan-minutes-pill" style="color:#10B981; border: 1px solid rgba(16,185,129,0.3);">
                ⏱️ 5 min to start
              </div>

              <ul class="plan-features-list">
                <li><span style="color:#10B981;">✓</span> 5 free minutes immediately upon signup</li>
                <li><span style="color:#10B981;">✓</span> YouTube, Reels, TikTok and 1,700+ websites</li>
                <li><span style="color:#10B981;">✓</span> Download transcript in plain .TXT</li>
                <li><span style="color:#10B981;">✓</span> No credit card required</li>
                <li><span style="color:#10B981;">✓</span> Automatic media deletion with privacy</li>
              </ul>
            </div>

            <a href="/login?signup=true" class="btn-secondary" style="width:100%; border-color: rgba(16,185,129,0.4); color:#6EE7B7;" onclick="handleStartFree(event)">
              Start free
            </a>
          </div>

          <!-- Plan 2: Starter -->
          <div class="pricing-card clint-card" id="cardStarter">
            <div>
              <div class="plan-name" style="color:#06B6D4;">Starter Annual</div>
              <p style="font-size:13px; color:var(--text-muted);" id="starterDesc">Transcribe every month with maximum annual savings</p>
              
              <div class="plan-price-row">
                <span class="plan-price" id="starterPrice">R$&nbsp;3.74</span>
                <span class="plan-period" id="starterPeriod">/ month</span>
              </div>
              <div class="plan-billing-detail" id="starterDetail">R$ 44.90 billed annually (~$8.90/yr)</div>

              <div class="plan-minutes-pill" style="color:#06B6D4; border: 1px solid rgba(6,182,212,0.3);" id="starterMinutes">
                ⏱️ 720 min/yr (60 min/mo)
              </div>

              <ul class="plan-features-list" id="starterFeatures">
                <li><span style="color:#06B6D4;">✓</span> 720 minutes per year (60 min/mo)</li>
                <li><span style="color:#06B6D4;">✓</span> Save 30% with 3 months free</li>
                <li><span style="color:#06B6D4;">✓</span> Download in clean .TXT format</li>
                <li><span style="color:#06B6D4;">✓</span> Supports 1,700+ platforms & links</li>
                <li><span style="color:#06B6D4;">✓</span> Guaranteed priority service year-round</li>
              </ul>
            </div>

            <a href="/en/pricing" class="btn-secondary" style="width:100%;" id="starterCta">
              Subscribe Starter Annual
            </a>
          </div>

          <!-- Plan 3: PRO (POPULAR HIGHLIGHT) -->
          <div class="pricing-card clint-card popular" id="cardPro">
            
            <span class="popular-tag">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              <span>Most Popular</span>
            </span>

            <div>
              <div class="plan-name" style="color:#C4A4FF;" id="proTitle">Pro Annual</div>
              <p style="font-size:13px; color:rgba(255,255,255,0.7);" id="proDesc">The favorite plan for digital creators, YouTubers & editors</p>
              
              <div class="plan-price-row">
                <span class="plan-price" id="proPrice" style="color:#fff;">R$&nbsp;13.25</span>
                <span class="plan-period" id="proPeriod">/ month</span>
              </div>
              <div class="plan-billing-detail" id="proDetail" style="color:rgba(255,255,255,0.7);">R$ 159.00 billed annually (~$31.00/yr)</div>

              <div class="plan-minutes-pill" style="background: rgba(124,58,237,0.3); color:#fff; border: 1px solid rgba(255,255,255,0.3);" id="proMinutes">
                ⏱️ 3,600 min/yr (300 min/mo)
              </div>

              <ul class="plan-features-list" id="proFeatures" style="color:rgba(255,255,255,0.85);">
                <li><span style="color:#A78BFA; font-weight:700;">✓</span> <strong>3,600 minutes per year (300 min/mo)</strong></li>
                <li><span style="color:#A78BFA; font-weight:700;">✓</span> <strong>Save 30% compared to monthly packs</strong></li>
                <li><span style="color:#A78BFA; font-weight:700;">✓</span> <strong>AI Executive Bullet Summaries included</strong></li>
                <li><span style="color:#A78BFA; font-weight:700;">✓</span> <strong>Export to .SRT, .DOCX Word & .PDF</strong></li>
                <li><span style="color:#A78BFA; font-weight:700;">✓</span> Synced player with timestamps</li>
                <li><span style="color:#A78BFA; font-weight:700;">✓</span> Supports 1,700+ platforms & links</li>
              </ul>
            </div>

            <a href="/en/pricing" class="btn-primary" style="width:100%; box-shadow: 0 4px 20px rgba(236,72,153,0.5);" id="proCta">
              Subscribe Pro Annual →
            </a>
          </div>

          <!-- Plan 4: Business -->
          <div class="pricing-card clint-card" id="cardBusiness">
            <div>
              <div class="plan-name" style="color:#EC4899;" id="businessTitle">Business Annual</div>
              <p style="font-size:13px; color:var(--text-muted);" id="businessDesc">For agencies, production teams and high volume</p>
              
              <div class="plan-price-row">
                <span class="plan-price" id="businessPrice">R$&nbsp;59.90</span>
                <span class="plan-period" id="businessPeriod">/ month</span>
              </div>
              <div class="plan-billing-detail" id="businessDetail">R$ 718.80 billed annually (~$140.00/yr)</div>

              <div class="plan-minutes-pill" style="color:#EC4899; border: 1px solid rgba(236,72,153,0.3);" id="businessMinutes">
                ⏱️ 12,000 min/yr (1,000 min/mo)
              </div>

              <ul class="plan-features-list" id="businessFeatures">
                <li><span style="color:#EC4899;">✓</span> 12,000 min per year (1,000 min/mo)</li>
                <li><span style="color:#EC4899;">✓</span> Save R$ 240.00 on the annual plan</li>
                <li><span style="color:#EC4899;">✓</span> All formats (.DOCX, .PDF, .SRT, .TXT)</li>
                <li><span style="color:#EC4899;">✓</span> Unlimited AI executive summaries</li>
                <li><span style="color:#EC4899;">✓</span> Priority 24/7 WhatsApp & email support</li>
              </ul>
            </div>

            <a href="/en/pricing" class="btn-secondary" style="width:100%;" id="businessCta">
              Subscribe Business Annual
            </a>
          </div>

        </div>
      </div>
    </section>

    <!-- TESTIMONIALS -->
    <section class="testimonials-section">
      <div class="container">
        <div style="text-align: center; margin-bottom: 56px;">
          <span class="section-eyebrow">Loved by professionals</span>
          <h2 class="section-title">Rated 4.9 out of 5 stars</h2>
          <p class="section-subtitle">Hear from creators, researchers, and teams who replaced hours of manual typing with a single click.</p>
        </div>

        <div class="testimonials-grid">
          <div class="testimonial-card clint-card">
            <div class="stars-row">★★★★★</div>
            <p class="quote-text">
              "I use it every day to transcribe field interviews. It easily saves me 4 to 5 hours per story. The punctuation and slang recognition is by far the best on the market."
            </p>
            <div class="user-info">
              <div class="user-avatar" style="background:#7C3AED;">JF</div>
              <div>
                <p style="font-weight:700; font-size:14px;">Juliana Ferreira</p>
                <p style="font-size:12px; color:var(--text-dim);">Investigative Journalist</p>
              </div>
            </div>
          </div>

          <div class="testimonial-card clint-card">
            <div class="stars-row">★★★★★</div>
            <p class="quote-text">
              "Exporting .SRT subtitles directly for CapCut and Premiere cut my video editing time in half. I can no longer run my production agency without it."
            </p>
            <div class="user-info">
              <div class="user-avatar" style="background:#EC4899;">RS</div>
              <div>
                <p style="font-weight:700; font-size:14px;">Rafael Souza</p>
                <p style="font-size:12px; color:var(--text-dim);">Content Creator & Video Editor (450k followers)</p>
              </div>
            </div>
          </div>

          <div class="testimonial-card clint-card">
            <div class="stars-row">★★★★★</div>
            <p class="quote-text">
              "I transcribe board meetings and preliminary hearings. What sold me was the strict privacy policy: the media file is permanently deleted after download. Indispensable security."
            </p>
            <div class="user-info">
              <div class="user-avatar" style="background:#06B6D4;">ML</div>
              <div>
                <p style="font-weight:700; font-size:14px;">Michael Larson</p>
                <p style="font-size:12px; color:var(--text-dim);">Senior Legal Counsel</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ ACCORDION -->
    <section class="faq-section" id="faq">
      <div class="container">
        <div style="text-align: center; margin-bottom: 56px;">
          <span class="section-eyebrow">Got Questions?</span>
          <h2 class="section-title">Frequently Asked Questions</h2>
          <p class="section-subtitle">Everything you need to know before getting started.</p>
        </div>

        <div class="faq-accordion">
          
          <div class="faq-item open">
            <div class="faq-question" onclick="toggleFaq(this)">
              <span>Which video and audio platforms and formats are supported?</span>
              <span class="faq-icon">+</span>
            </div>
            <div class="faq-answer">
              We support over 1,700 web platforms: YouTube, Instagram Reels, TikTok, Vimeo, Facebook, Twitter/X, Twitch, SoundCloud, plus audio voice notes. You can also upload files directly from your computer or phone in MP3, MP4, WAV, M4A, OGG, FLAC, and MOV formats up to 2GB.
            </div>
          </div>

          <div class="faq-item">
            <div class="faq-question" onclick="toggleFaq(this)">
              <span>How does the privacy guarantee and automatic media deletion work?</span>
              <span class="faq-icon">+</span>
            </div>
            <div class="faq-answer">
              We take privacy extremely seriously. No audio or video file remains stored on our servers. Once your transcript is processed and downloaded, the original media file is permanently and irreversibly purged from our servers in full compliance with GDPR and LGPD regulations. Your data is never sold or used to train public AI models.
            </div>
          </div>

          <div class="faq-item">
            <div class="faq-question" onclick="toggleFaq(this)">
              <span>Do I need a credit card to try it?</span>
              <span class="faq-icon">+</span>
            </div>
            <div class="faq-answer">
              No! All new accounts automatically receive 5 free minutes of transcription immediately upon signup with zero credit card or billing details required. Simply paste your link or upload a file to experience the accuracy.
            </div>
          </div>

          <div class="faq-item">
            <div class="faq-question" onclick="toggleFaq(this)">
              <span>What is the AI transcription accuracy for various accents and audio quality?</span>
              <span class="faq-icon">+</span>
            </div>
            <div class="faq-answer">
              Our advanced neural speech engine achieves over 99% accuracy across natural speech, regional accents, overlapping voices, technical terminology, and background noise in more than 50 languages.
            </div>
          </div>

          <div class="faq-item">
            <div class="faq-question" onclick="toggleFaq(this)">
              <span>How do the AI executive summaries work?</span>
              <span class="faq-icon">+</span>
            </div>
            <div class="faq-answer">
              Available from the Pro plan upward, our AI contextual engine analyzes the entire conversation and generates a dense, actionable brief: bulleted key takeaways, agreed decisions, important quotes, and next action items, sparing you from reading dozens of pages.
            </div>
          </div>

          <div class="faq-item">
            <div class="faq-question" onclick="toggleFaq(this)">
              <span>Do purchased minutes expire?</span>
              <span class="faq-icon">+</span>
            </div>
            <div class="faq-answer">
              With one-time packs, minutes carry no recurring monthly charges and come with generous validity: 6 months for Starter, 12 months for Pro, and 24 months for Business. On annual subscriptions, your minutes replenish every month throughout the 12-month period.
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- SUPER FINAL CTA -->
    <section class="cta-banner-section">
      <div class="container">
        <div class="cta-glow-box">
          <span class="badge-pill" style="margin-bottom: 24px;">
            <span class="pill-dot"></span>
            <span>Get started now in under 30 seconds</span>
          </span>
          <h2 class="cta-title">
            Ready to stop wasting hours<br>
            <span class="gradient-text">typing what AI can automate?</span>
          </h2>
          <p class="cta-desc">
            Join thousands of creators, journalists, academics, and businesses. Start with 5 free minutes today.
          </p>
          <div class="cta-buttons-row">
            <a href="/login?signup=true" class="btn-primary" style="padding: 16px 36px; font-size: 16px;" onclick="handleStartFree(event)">
              <span>Start free</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <a href="/en/pricing" class="btn-secondary" style="padding: 16px 32px; font-size: 16px;">
              View all plans →
            </a>
          </div>
          <p style="font-size: 12px; color: var(--text-dim); margin-top: 24px;">
            🔒 No credit card required • GDPR & LGPD compliant • Instant activation
          </p>
        </div>
      </div>
    </section>

  </main>

  <!-- FOOTER -->
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        
        <div>
          <a href="/en" style="display: flex; align-items: center; margin-bottom: 16px;">
            <img src="/logo.png" alt="Peguei o Texto" class="brand-logo-img">
          </a>
          <p class="footer-desc">
            The fastest and most accurate AI tool to turn internet audio and video into text, executive summaries, and professional subtitles.
          </p>
          <div style="margin-top: 20px;">
            <p style="font-size: 12px; color: var(--text-dim); text-transform: uppercase; font-weight: 700; letter-spacing: 0.08em; margin-bottom: 6px;">Support & Contact:</p>
            <a href="mailto:contato@pegueiotexto.com.br" class="footer-email-highlight">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              <span>contato@pegueiotexto.com.br</span>
            </a>
          </div>
        </div>

        <div>
          <h4 class="footer-col-title">Tools</h4>
          <ul class="footer-links">
            <li><a href="/en/transcribe-youtube" class="footer-link">YouTube Transcription</a></li>
            <li><a href="/en/transcribe-instagram" class="footer-link">Instagram Reels Transcription</a></li>
            <li><a href="/en/transcribe-tiktok" class="footer-link">TikTok Transcription</a></li>
            <li><a href="/en/transcribe-whatsapp" class="footer-link">WhatsApp Audio Notes</a></li>
            <li><a href="/en/generate-srt-subtitles" class="footer-link">Subtitle Generator (.SRT)</a></li>
            <li><a href="/en/download-video" class="footer-link">Download Web Video</a></li>
            <li><a href="/en/youtube-to-mp3" class="footer-link">YouTube to MP3</a></li>
          </ul>
        </div>

        <div>
          <h4 class="footer-col-title">Solutions</h4>
          <ul class="footer-links">
            <li><a href="/en/legal-transcription" class="footer-link">Legal Transcription</a></li>
            <li><a href="/en/academic-transcription" class="footer-link">Academic & Research</a></li>
            <li><a href="/en/meeting-transcription" class="footer-link">Meeting Notes</a></li>
            <li><a href="/en/convert-mp3-to-text" class="footer-link">Convert MP3 to Text</a></li>
            <li><a href="/en/convert-mp4-to-text" class="footer-link">Convert MP4 to Text</a></li>
            <li><a href="/en/convert-m4a-to-text" class="footer-link">Convert M4A to Text</a></li>
            <li><a href="/en/convert-wav-to-text" class="footer-link">Convert WAV to Text</a></li>
          </ul>
        </div>

        <div>
          <h4 class="footer-col-title">Company</h4>
          <ul class="footer-links">
            <li><a href="/en/blog" class="footer-link">Blog & Guides</a></li>
            <li><a href="/en/pricing" class="footer-link">Pricing & Plans</a></li>
            <li><a href="/afiliados" class="footer-link">Affiliate Program</a></li>
            <li><a href="/sugestoes" class="footer-link">Feedback & Suggestions</a></li>
            <li><a href="/en/about-us" class="footer-link">About Us</a></li>
            <li><a href="/en/privacy" class="footer-link">Privacy Policy</a></li>
            <li><a href="/en/terms" class="footer-link">Terms of Service</a></li>
            <li><a href="mailto:contato@pegueiotexto.com.br" class="footer-link">Contact Us</a></li>
          </ul>
        </div>

      </div>

      <!-- BADGES CAROUSEL (STYLE UNISCRIBE): PRODUCT HUNT, STARTUPBASE, CONFETTI SAAS, FAZIER, BETTER LAUNCH, FOUNDRLIST, TWELVE TOOLS & SHIPYBARA -->
      <div class="footer-badge-ticker" id="footerBadgeTicker">
        <span class="footer-badge-label">FIND US ON</span>
        <div class="footer-badge-track" id="footerBadgeTrack">
          <a href="https://www.producthunt.com/posts/peguei-o-texto?utm_source=badge-featured&utm_medium=badge&utm_campaign=peguei-o-texto" target="_blank" rel="noopener noreferrer" class="footer-badge-item active" aria-label="Featured on Product Hunt">
            <img src="/product-hunt-badge.svg" alt="Featured on Product Hunt" class="footer-badge-img" width="250" height="54" loading="lazy">
          </a>
          <a href="https://startupbase.io/products/peguei-o-texto?utm_source=startupbase&utm_medium=badge&utm_campaign=launch-badge-neutral" target="_blank" rel="noopener noreferrer" class="footer-badge-item" aria-label="Launched on StartupBase" tabindex="-1">
            <img src="https://statics.startupbase.io/site/badges/launched-on-sb-neutral.svg" alt="Launched on StartupBase" class="footer-badge-img" width="300" height="80" loading="lazy">
          </a>
          <a href="https://confettisaas.com/saas/pegueiotexto-com-br?ref=badge" target="_blank" rel="noopener noreferrer" class="footer-badge-item" aria-label="View Peguei o Texto on ConfettiSaaS" tabindex="-1">
            <img src="https://confettisaas.com/badge-dark.svg" alt="Peguei o Texto on ConfettiSaaS" class="footer-badge-img" width="250" height="54" loading="lazy">
          </a>
          <a href="https://fazier.com/launches/pegueiotexto.com.br" target="_blank" rel="noopener noreferrer" class="footer-badge-item" aria-label="Featured on Fazier" tabindex="-1">
            <img src="https://fazier.com/api/v1//public/badges/launch_badges.svg?badge_type=featured&theme=neutral" alt="Fazier badge" class="footer-badge-img" width="182" height="43" loading="lazy">
          </a>
          <a href="https://www.betterlaunch.co/product/peguei-o-texto" target="_blank" rel="noopener noreferrer" class="footer-badge-item" aria-label="Better Launch" tabindex="-1">
            <img src="https://www.betterlaunch.co/badge-launching-dark.svg" alt="Better Launch" class="footer-badge-img" width="200" height="56" loading="lazy">
          </a>
          <a href="https://www.foundrlist.com/product/pegueiotexto?utm_source=badge&amp;utm_medium=embed" target="_blank" rel="noopener noreferrer" class="footer-badge-item" aria-label="Featured on FoundrList" tabindex="-1">
            <img src="https://www.foundrlist.com/api/badge/pegueiotexto" alt="Featured on FoundrList" class="footer-badge-img" width="150" height="48" loading="lazy">
          </a>
          <a href="https://twelve.tools" target="_blank" rel="noopener noreferrer" class="footer-badge-item" aria-label="Featured on Twelve Tools" tabindex="-1">
            <img src="https://twelve.tools/badge2-dark.svg" alt="Featured on Twelve Tools" class="footer-badge-img" width="148" height="40" loading="lazy">
          </a>
          <a href="https://shipybara.com/?ref=48daca65-151b-45a6-b9c1-b10341284265" target="_blank" rel="noopener noreferrer" class="footer-badge-item" aria-label="Featured on Shipybara" tabindex="-1">
            <img src="https://shipybara.com/images/badges/shipybara-badge-light.svg" alt="Featured on Shipybara" class="footer-badge-img" width="150" height="54" loading="lazy">
          </a>
          <a href="https://startupfa.me/s/peguei-o-texto?utm_source=pegueiotexto.com.br" target="_blank" rel="noopener noreferrer" class="footer-badge-item" aria-label="Peguei o Texto - Featured on Startup Fame" tabindex="-1">
            <img src="https://startupfa.me/badges/featured-badge.webp" alt="Peguei o Texto - Featured on Startup Fame" class="footer-badge-img" width="171" height="54" loading="lazy">
          </a>
          <a href="https://www.scrolllaunch.com/products/peguei-o-texto?ref=badge" target="_blank" rel="noopener noreferrer" class="footer-badge-item" aria-label="Featured on ScrollLaunch" tabindex="-1">
            <img src="https://www.scrolllaunch.com/api/badge/peguei-o-texto" alt="Featured on ScrollLaunch" class="footer-badge-img" width="220" height="48" loading="lazy">
          </a>
          <a href="https://www.tools.rodeo/?ref=pegueiotexto.com.br" target="_blank" rel="noopener noreferrer" class="footer-badge-item" aria-label="Featured on Tools Rodeo" tabindex="-1">
            <img src="https://www.tools.rodeo/badge/tools-rodeo-badge-dark-33368f08.svg" alt="Featured on Tools Rodeo" class="footer-badge-img" width="216" height="64" loading="lazy">
          </a>
        </div>
      </div>

      <div class="footer-bottom">
        <div>
          © 2026 Peguei o Texto. All rights reserved.
        </div>
        <div style="display: flex; gap: 16px;">
          <span>Zero-Retention Privacy Guaranteed</span>
          <span>•</span>
          <span>contato@pegueiotexto.com.br</span>
        </div>
      </div>
    </div>
  </footer>
`;

export default function HomeClintEn() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      // 1. Waveform Setup
      function initWaveform() {
        const visualizer = document.getElementById("waveVisualizer");
        if (!visualizer) return;
        visualizer.innerHTML = "";
        const heights = [12, 18, 24, 16, 28, 20, 14, 32, 22, 18, 26, 15, 30, 24, 16, 20, 14, 28, 18, 22, 16, 24, 14, 18];
        heights.forEach((h, i) => {
          const bar = document.createElement("div");
          bar.className = "wave-bar";
          bar.style.height = h + "px";
          bar.style.opacity = i < 8 ? "0.95" : "0.35";
          visualizer.appendChild(bar);
        });
      }
      initWaveform();

      // 2. Play / Pause Simulator
      let isPlaying = false;
      let waveInterval;
      function togglePlayAudio(btn) {
        isPlaying = !isPlaying;
        if (isPlaying) {
          btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
          waveInterval = setInterval(() => {
            const bars = document.querySelectorAll("#waveVisualizer .wave-bar");
            bars.forEach((b) => {
              const randomH = Math.floor(Math.random() * 26 + 8);
              b.style.height = randomH + "px";
            });
          }, 120);
        } else {
          btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
          clearInterval(waveInterval);
          initWaveform();
        }
      }

      // 3. Transcribe Modes
      let currentTranscribeMode = "url";

      function switchTranscribeTab(mode, btn) {
        document.querySelectorAll(".transcribe-tab").forEach((t) => t.classList.remove("active"));
        btn.classList.add("active");
        currentTranscribeMode = mode;
        const input = document.getElementById("heroUrlInput");
        if (mode === "url") {
          input.placeholder = "Paste YouTube, TikTok, Instagram Reels, Vimeo or Twitter link here...";
          input.value = "https://www.youtube.com/watch?v=leNAOtw7Fzk";
        } else if (mode === "upload") {
          input.placeholder = "Click to select an audio or video file (MP3, MP4, WAV, M4A)...";
          input.value = "";
          const fileInput = document.getElementById("heroFileInput");
          if (fileInput) fileInput.click();
        } else {
          input.placeholder = "Direct Recording: click Start free to record in your dashboard...";
          input.value = "";
        }
      }

      let selectedHeroFile = null;

      function handleHeroFileSelected(fileInput) {
        if (fileInput.files && fileInput.files[0]) {
          selectedHeroFile = fileInput.files[0];
          const file = selectedHeroFile;
          const input = document.getElementById("heroUrlInput");
          if (input) {
            const mb = (file.size / (1024 * 1024)).toFixed(1);
            input.value = `📁 ${file.name} (${mb} MB)`;
          }
        }
      }

      async function handleTranscribeAction() {
        const btn = document.querySelector(".transcribe-btn");
        const input = document.getElementById("heroUrlInput");
        const rawValue = input ? input.value.trim() : "";

        if (btn) {
          btn.innerHTML = '<span>Generating AI preview...</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
          btn.style.opacity = "0.8";
        }

        if (currentTranscribeMode === "upload" && selectedHeroFile) {
          try {
            await savePendingMedia({
              file: selectedHeroFile,
              mode: "upload",
              fileName: selectedHeroFile.name,
              fileSize: selectedHeroFile.size,
            });
          } catch (e) {}
        } else if (rawValue && !rawValue.startsWith("📁")) {
          try {
            await savePendingMedia({
              url: rawValue,
              mode: "url",
            });
          } catch (e) {}
        }

        try {
          const supabase = createClient();
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            window.location.href = "/en/dashboard?auto_transcribe=true";
          } else {
            window.location.href = "/login?signup=true&reason=transcribe&preview=true&lang=en&redirect=/en/dashboard?auto_transcribe=true";
          }
        } catch (err) {
          window.location.href = "/login?signup=true&reason=transcribe&preview=true&lang=en&redirect=/en/dashboard?auto_transcribe=true";
        }
      }

      async function handleStartFree(e) {
        if (e) e.preventDefault();
        try {
          const supabase = createClient();
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            window.location.href = "/en/dashboard";
          } else {
            window.location.href = "/login?signup=true";
          }
        } catch (err) {
          window.location.href = "/login?signup=true";
        }
      }

      // 4. Quick Sample Chips
      const samplePresets = {
        youtube: {
          url: "https://www.youtube.com/watch?v=leNAOtw7Fzk",
          badge: "▶ YouTube",
          title: "Keynote: How Artificial Intelligence Transforms Audio & Video Content",
        },
        instagram: {
          url: "https://www.instagram.com/reel/C892189x/",
          badge: "📷 Instagram Reels",
          title: "3 Quick Tips for Recording Vertical Videos with Crystal-Clear Audio",
        },
        tiktok: {
          url: "https://www.tiktok.com/@growth/video/728192837192",
          badge: "♪ TikTok",
          title: "Viral Video Cuts: Content Strategy and Viewer Retention in 2026",
        },
        whatsapp: {
          url: "whatsapp_audio_2026-11-04_1420.ogg",
          badge: "💬 WhatsApp Audio",
          title: "Voice Memo with Commercial Director Aligning Quarter Targets",
        },
        podcast: {
          url: "https://open.spotify.com/episode/9283718928",
          badge: "🎙️ Podcast",
          title: "Episode #42: Secrets of High-Performance Communication",
        },
      };

      function fillSample(type) {
        const data = samplePresets[type];
        if (!data) return;
        document.getElementById("heroUrlInput").value = data.url;
        document.getElementById("sourceBadge").textContent = data.badge;
        document.getElementById("videoTitleDemo").textContent = data.title;
        
        const container = document.getElementById("inputContainer");
        container.style.borderColor = "#A78BFA";
        setTimeout(() => {
          container.style.borderColor = "rgba(255, 255, 255, 0.08)";
        }, 500);
      }

      // 5. Result Tabs Switcher
      function switchResultTab(tabName, btn) {
        document.querySelectorAll(".view-tab-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        document.getElementById("tabContentFull").style.display = tabName === "full" ? "flex" : "none";
        document.getElementById("tabContentSummary").style.display = tabName === "summary" ? "flex" : "none";
        document.getElementById("tabContentSrt").style.display = tabName === "srt" ? "flex" : "none";
      }

      // 6. Copy Text Helper
      function copyMockText(btn) {
        const textToCopy = `[00:00] Welcome everyone! Today we're diving into how artificial intelligence is transforming the way we work with audio and video content.
[00:14] Over the past few years, video production has exploded — from podcasts to webinars and interviews.
[00:32] With Peguei o Texto, simply paste a link or upload a file to get synced subtitles and executive takeaways.`;
        
        navigator.clipboard.writeText(textToCopy).then(() => {
          const originalText = btn.innerHTML;
          btn.innerHTML = '<span style="color:#10B981;">✓ Copied!</span>';
          setTimeout(() => {
            btn.innerHTML = originalText;
          }, 1800);
        });
      }

      // 7. Use Cases Data in English
      const useCaseData = [
        {
          tag: "For Content Creators & YouTubers",
          title: "Auto subtitles and viral podcast clips without the headache",
          desc: "Turn long-form videos into dozens of captioned Reels and TikToks. Export universal .SRT files with millisecond timestamps ready to import straight into Premiere, CapCut, or DaVinci Resolve.",
          stats: "Average time saved: 12 hours per week on editing",
          bullets: [
            "Export frame-perfect synced .SRT subtitles",
            "Generate viral titles, descriptions, and scripts with AI",
            "Eliminate the tedious grind of manual typing"
          ]
        },
        {
          tag: "For Companies, Consultants & Managers",
          title: "Meeting minutes from Meet, Teams and Zoom in seconds",
          desc: "Record your sales calls, 1-on-1s, and executive syncs. Our AI extracts key decisions, pricing agreements, and assigned action items to share instantly in Slack, Notion, or email.",
          stats: "100% of participants aligned after every single call",
          bullets: [
            "Clear speaker separation (diarization)",
            "Formatted meeting notes exported to Word and PDF",
            "Full compliance with GDPR and strict privacy standards"
          ]
        },
        {
          tag: "For Students, Researchers & Academics",
          title: "Turn hours of lectures into complete study guides",
          desc: "Stop pausing videos every 30 seconds to take notes. Paste the lecture link and receive the full transcript with key concept summaries to review before exams.",
          stats: "3x higher study retention with active reading",
          bullets: [
            "Transcribe lectures, webinars, and thesis defenses",
            "Automatic highlighting of key definitions and takeaways",
            "Export styled PDF documents ready to print or highlight on tablet"
          ]
        },
        {
          tag: "For Journalists, Writers & Podcasters",
          title: "Long interviews parsed and accurately quotable",
          desc: "No more spending late nights listening to recordings on repeat. Peguei o Texto gives you text with clickable timestamps: click any sentence to listen to that exact second.",
          stats: "Articles and reports published the same day as interviews",
          bullets: [
            "Supports low-quality audio with background street noise",
            "Precise preservation of quotes and statements",
            "Instant keyword search across the entire transcript"
          ]
        },
        {
          tag: "For Attorneys, Legal Teams & Depositions",
          title: "Hearings and depositions recorded with total confidentiality",
          desc: "Transcription for judicial hearings, witness depositions, and mediation sessions. Our servers never retain audio history or store media after document delivery.",
          stats: "Absolute secrecy guaranteed by ephemeral sandbox architecture",
          bullets: [
            "Formatted .DOCX documents ready to attach to case files",
            "End-to-end encryption during upload and processing",
            "Full compliance with ethical and legal data protection standards"
          ]
        }
      ];

      function switchUseCase(index, btn) {
        document.querySelectorAll(".usecase-tab-pill").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        renderUseCase(index);
      }

      function renderUseCase(index) {
        const d = useCaseData[index];
        const box = document.getElementById("useCaseContent");
        if (!box) return;
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
                Start free for this use case →
              </a>
            </div>

            <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:18px; padding:28px;">
              <p style="font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.12em; color:var(--brand-cyan); margin-bottom:18px;">
                Immediate Benefits:
              </p>
              <ul style="list-style:none; display:flex; flex-direction:column; gap:16px;">
                ${d.bullets.map((b) => `
                  <li style="display:flex; align-items:flex-start; gap:12px; font-size:14px; color:#E2E8F0; line-height:1.5;">
                    <span style="color:#10B981; font-weight:700; margin-top:2px;">✓</span>
                    <span>${b}</span>
                  </li>
                `).join("")}
              </ul>
            </div>
          </div>
        `;
      }
      renderUseCase(0);

      // 8. Pricing Mode Toggle: Annual Subscription vs One-Time Packs
      function setPricingMode(mode) {
        const btnAnual = document.getElementById("btnToggleAnual");
        const btnAvulso = document.getElementById("btnToggleAvulso");
        
        const starterTitle = document.querySelector("#cardStarter .plan-name");
        const starterDesc = document.getElementById("starterDesc");
        const starterPrice = document.getElementById("starterPrice");
        const starterPeriod = document.getElementById("starterPeriod");
        const starterDetail = document.getElementById("starterDetail");
        const starterMinutes = document.getElementById("starterMinutes");
        const starterFeatures = document.getElementById("starterFeatures");
        const starterCta = document.querySelector("#cardStarter a");

        const proTitle = document.getElementById("proTitle");
        const proDesc = document.getElementById("proDesc");
        const proPrice = document.getElementById("proPrice");
        const proPeriod = document.getElementById("proPeriod");
        const proDetail = document.getElementById("proDetail");
        const proMinutes = document.getElementById("proMinutes");
        const proFeatures = document.getElementById("proFeatures");
        const proCta = document.getElementById("proCta");

        const businessTitle = document.getElementById("businessTitle");
        const businessDesc = document.getElementById("businessDesc");
        const businessPrice = document.getElementById("businessPrice");
        const businessPeriod = document.getElementById("businessPeriod");
        const businessDetail = document.getElementById("businessDetail");
        const businessMinutes = document.getElementById("businessMinutes");
        const businessFeatures = document.getElementById("businessFeatures");
        const businessCta = document.getElementById("businessCta");

        if (mode === "anual") {
          btnAnual?.classList.add("active");
          btnAvulso?.classList.remove("active");

          // Starter Annual
          if (starterTitle) starterTitle.textContent = "Starter Annual";
          if (starterDesc) starterDesc.textContent = "Transcribe every month with maximum annual savings";
          if (starterPrice) starterPrice.innerHTML = "R$&nbsp;3.74";
          if (starterPeriod) starterPeriod.textContent = "/ month";
          if (starterDetail) starterDetail.textContent = "R$ 44.90 billed annually (~$8.90/yr)";
          if (starterMinutes) starterMinutes.textContent = "⏱️ 720 min/yr (60 min/mo)";
          if (starterFeatures) {
            starterFeatures.innerHTML = `
              <li><span style="color:#06B6D4;">✓</span> 720 minutes per year (60 min/mo)</li>
              <li><span style="color:#06B6D4;">✓</span> Save 30% with 3 months free</li>
              <li><span style="color:#06B6D4;">✓</span> Download in clean .TXT format</li>
              <li><span style="color:#06B6D4;">✓</span> Supports 1,700+ platforms & links</li>
              <li><span style="color:#06B6D4;">✓</span> Guaranteed priority service year-round</li>
            `;
          }
          if (starterCta) starterCta.textContent = "Subscribe Starter Annual";

          // Pro Annual (Most Popular)
          if (proTitle) proTitle.textContent = "Pro Annual";
          if (proDesc) proDesc.textContent = "The favorite plan for digital creators, YouTubers & editors";
          if (proPrice) proPrice.innerHTML = "R$&nbsp;13.25";
          if (proPeriod) proPeriod.textContent = "/ month";
          if (proDetail) proDetail.textContent = "R$ 159.00 billed annually (~$31.00/yr)";
          if (proMinutes) proMinutes.textContent = "⏱️ 3,600 min/yr (300 min/mo)";
          if (proFeatures) {
            proFeatures.innerHTML = `
              <li><span style="color:#A78BFA; font-weight:700;">✓</span> <strong>3,600 minutes per year (300 min/mo)</strong></li>
              <li><span style="color:#A78BFA; font-weight:700;">✓</span> <strong>Save 30% compared to monthly packs</strong></li>
              <li><span style="color:#A78BFA; font-weight:700;">✓</span> <strong>AI Executive Bullet Summaries included</strong></li>
              <li><span style="color:#A78BFA; font-weight:700;">✓</span> <strong>Export to .SRT, .DOCX Word & .PDF</strong></li>
              <li><span style="color:#A78BFA; font-weight:700;">✓</span> Synced player with timestamps</li>
              <li><span style="color:#A78BFA; font-weight:700;">✓</span> Supports 1,700+ platforms & links</li>
            `;
          }
          if (proCta) proCta.textContent = "Subscribe Pro Annual →";

          // Business Annual
          if (businessTitle) businessTitle.textContent = "Business Annual";
          if (businessDesc) businessDesc.textContent = "For agencies, production teams and high volume";
          if (businessPrice) businessPrice.innerHTML = "R$&nbsp;59.90";
          if (businessPeriod) businessPeriod.textContent = "/ month";
          if (businessDetail) businessDetail.textContent = "R$ 718.80 billed annually (~$140.00/yr)";
          if (businessMinutes) businessMinutes.textContent = "⏱️ 12,000 min/yr (1,000 min/mo)";
          if (businessFeatures) {
            businessFeatures.innerHTML = `
              <li><span style="color:#EC4899;">✓</span> 12,000 min per year (1,000 min/mo)</li>
              <li><span style="color:#EC4899;">✓</span> Save R$ 240.00 on the annual plan</li>
              <li><span style="color:#EC4899;">✓</span> All formats (.DOCX, .PDF, .SRT, .TXT)</li>
              <li><span style="color:#EC4899;">✓</span> Unlimited AI executive summaries</li>
              <li><span style="color:#EC4899;">✓</span> Priority 24/7 WhatsApp & email support</li>
            `;
          }
          if (businessCta) businessCta.textContent = "Subscribe Business Annual";

        } else {
          btnAnual?.classList.remove("active");
          btnAvulso?.classList.add("active");

          // Starter One-time
          if (starterTitle) starterTitle.textContent = "Starter";
          if (starterDesc) starterDesc.textContent = "Great for quick one-off tasks and short clips";
          if (starterPrice) starterPrice.innerHTML = "R$&nbsp;4.90";
          if (starterPeriod) starterPeriod.textContent = "one-time";
          if (starterDetail) starterDetail.textContent = "Approx. $0.99 total • No subscription";
          if (starterMinutes) starterMinutes.textContent = "⏱️ 60 minutes of audio";
          if (starterFeatures) {
            starterFeatures.innerHTML = `
              <li><span style="color:#06B6D4;">✓</span> 60 minutes of AI transcription</li>
              <li><span style="color:#06B6D4;">✓</span> Download in clean plain text (.TXT)</li>
              <li><span style="color:#06B6D4;">✓</span> Supports 1,700+ platforms & links</li>
              <li><span style="color:#06B6D4;">✓</span> Automatic media deletion with privacy</li>
              <li><span style="color:#06B6D4;">✓</span> Valid for 6 months to use anytime</li>
            `;
          }
          if (starterCta) starterCta.textContent = "Buy Starter";

          // Pro One-time (Most Popular)
          if (proTitle) proTitle.textContent = "Pro";
          if (proDesc) proDesc.textContent = "For content creators, editors and podcasters";
          if (proPrice) proPrice.innerHTML = "R$&nbsp;17.90";
          if (proPeriod) proPeriod.textContent = "one-time";
          if (proDetail) proDetail.textContent = "Approx. $3.50 total • No subscription";
          if (proMinutes) proMinutes.textContent = "⏱️ 300 minutes of audio";
          if (proFeatures) {
            proFeatures.innerHTML = `
              <li><span style="color:#A78BFA; font-weight:700;">✓</span> <strong>300 minutes of AI transcription</strong></li>
              <li><span style="color:#A78BFA; font-weight:700;">✓</span> <strong>Download in .TXT, .SRT (Subtitles) & .DOCX</strong></li>
              <li><span style="color:#A78BFA; font-weight:700;">✓</span> <strong>Formatted PDF document export</strong></li>
              <li><span style="color:#A78BFA; font-weight:700;">✓</span> <strong>AI executive bullet summaries included</strong></li>
              <li><span style="color:#A78BFA; font-weight:700;">✓</span> Synced player with timestamps</li>
              <li><span style="color:#A78BFA; font-weight:700;">✓</span> Valid for 12 months to use anytime</li>
            `;
          }
          if (proCta) proCta.textContent = "Buy Pro →";

          // Business One-time
          if (businessTitle) businessTitle.textContent = "Business";
          if (businessDesc) businessDesc.textContent = "For agencies, production teams and high volume";
          if (businessPrice) businessPrice.innerHTML = "R$&nbsp;79.90";
          if (businessPeriod) businessPeriod.textContent = "one-time";
          if (businessDetail) businessDetail.textContent = "Approx. $15.00 total • No subscription";
          if (businessMinutes) businessMinutes.textContent = "⏱️ 1,000 minutes of audio";
          if (businessFeatures) {
            businessFeatures.innerHTML = `
              <li><span style="color:#EC4899;">✓</span> 1,000 minutes of AI transcription</li>
              <li><span style="color:#EC4899;">✓</span> Download in all formats (.DOCX, .PDF, .SRT)</li>
              <li><span style="color:#EC4899;">✓</span> Unlimited AI executive summaries</li>
              <li><span style="color:#EC4899;">✓</span> Priority support via WhatsApp and email</li>
              <li><span style="color:#EC4899;">✓</span> Valid for 24 months to use anytime</li>
            `;
          }
          if (businessCta) businessCta.textContent = "Buy Business";
        }
      }

      // 9. FAQ Toggle
      function toggleFaq(element) {
        const item = element.parentElement;
        const isOpen = item.classList.contains("open");
        document.querySelectorAll(".faq-item").forEach((i) => i.classList.remove("open"));
        if (!isOpen) {
          item.classList.add("open");
        }
      }

      // 10. Drawer Mobile Toggle
      function toggleMobileMenu() {
        const drawer = document.getElementById("mobileDrawer");
        if (drawer) {
          drawer.style.display = drawer.style.display === "flex" ? "none" : "flex";
        }
      }

      // Expose to window for inline onclick handlers
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

      function toggleLangDropdown(e?: any) {
        if (e && e.stopPropagation) e.stopPropagation();
        const menu = document.getElementById("langDropdownMenu");
        const chevron = document.getElementById("langChevron");
        if (!menu) return;
        const isOpen = menu.style.display === "flex";
        menu.style.display = isOpen ? "none" : "flex";
        if (chevron) {
          chevron.style.transform = isOpen ? "none" : "rotate(180deg)";
        }
      }
      (window as any).toggleLangDropdown = toggleLangDropdown;

      document.addEventListener("click", (e: MouseEvent) => {
        const wrapper = document.getElementById("langDropdownWrapper");
        const menu = document.getElementById("langDropdownMenu");
        const chevron = document.getElementById("langChevron");
        if (wrapper && menu && !wrapper.contains(e.target as Node)) {
          menu.style.display = "none";
          if (chevron) chevron.style.transform = "none";
        }
      });

      initWaveform();
      renderUseCase(0);
      setPricingMode("anual");

      // Detect user session and update navbar
      try {
        const supabase = createClient();
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user) {
            const navLogin = document.getElementById("navLoginLink");
            const navCta = document.getElementById("navCtaLink");
            if (navLogin) {
              navLogin.textContent = "Logout";
              navLogin.setAttribute("href", "#");
              navLogin.onclick = async (e) => {
                e.preventDefault();
                await supabase.auth.signOut();
                window.location.reload();
              };
            }
            if (navCta) {
              navCta.setAttribute("href", "/en/dashboard");
              const span = navCta.querySelector("span");
              if (span) span.textContent = "Dashboard";
            }
            const mobileLogin = document.getElementById("mobileNavLoginLink");
            const mobileCta = document.getElementById("mobileNavCtaLink");
            if (mobileLogin) {
              mobileLogin.textContent = "Logout";
              mobileLogin.setAttribute("href", "#");
              mobileLogin.onclick = async (e) => {
                e.preventDefault();
                await supabase.auth.signOut();
                window.location.reload();
              };
            }
            if (mobileCta) {
              mobileCta.setAttribute("href", "/en/dashboard");
              mobileCta.textContent = "Dashboard";
            }
          }
        });
      } catch (e) {}

      // Click on input in upload mode opens file selector
      const heroInput = document.getElementById("heroUrlInput");
      if (heroInput) {
        heroInput.addEventListener("click", () => {
          if (currentTranscribeMode === "upload") {
            const fileInput = document.getElementById("heroFileInput");
            if (fileInput) fileInput.click();
          }
        });
      }

      // 11. Footer Badges Ticker (UniScribe style rotation)
      const ticker = document.getElementById("footerBadgeTicker");
      const tickerItems = document.querySelectorAll(".footer-badge-item");
      if (ticker && tickerItems.length > 0) {
        let activeIdx = 0;
        let isTickerPaused = false;

        ticker.addEventListener("mouseenter", () => { isTickerPaused = true; });
        ticker.addEventListener("mouseleave", () => { isTickerPaused = false; });

        setInterval(() => {
          if (isTickerPaused) return;
          activeIdx = (activeIdx + 1) % tickerItems.length;
          tickerItems.forEach((item, idx) => {
            if (idx === activeIdx) {
              item.classList.add("active");
              item.removeAttribute("tabindex");
            } else {
              item.classList.remove("active");
              item.setAttribute("tabindex", "-1");
            }
          });
        }, 3000);
      }
    }
  }, []);

  return (
    <main suppressHydrationWarning style={{ minHeight: "100vh", background: "var(--bg-base, #060309)" }}>
      <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: CLINT_HTML_EN }} />
    </main>
  );
}

