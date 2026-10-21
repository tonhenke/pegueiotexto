"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX, Upload, Music, Sparkles } from "lucide-react";

interface AudioSyncPlayerProps {
  initialAudioUrl?: string | null;
  initialAudioFile?: File | null;
  onTimeUpdate?: (currentTime: number) => void;
  title?: string;
}

export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  if (mins >= 60) {
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    return `${hrs.toString().padStart(2, "0")}:${remMins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function parseTimestampToSeconds(timeStr: string): number {
  if (!timeStr) return 0;
  // Clean brackets or punctuation: "[01:23]" -> "01:23"
  const clean = timeStr.replace(/[\[\]\(\)]/g, "").trim();
  const parts = clean.split(":").map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 1) {
    return parts[0];
  }
  return 0;
}

export function seekAudioTimestamp(seconds: number) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("seek_audio", {
        detail: { seconds },
      })
    );
  }
}

export default function AudioSyncPlayer({
  initialAudioUrl,
  initialAudioFile,
  onTimeUpdate,
  title = "Áudio sincronizado",
}: AudioSyncPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(initialAudioUrl || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [fileName, setFileName] = useState<string | null>(initialAudioFile?.name || null);

  // Initialize from initial file if provided
  useEffect(() => {
    if (initialAudioFile) {
      const url = URL.createObjectURL(initialAudioFile);
      setAudioUrl(url);
      setFileName(initialAudioFile.name);
      return () => URL.revokeObjectURL(url);
    } else if (initialAudioUrl) {
      setAudioUrl(initialAudioUrl);
    }
  }, [initialAudioFile, initialAudioUrl]);

  // Listen to global seek events dispatched from timestamp clicks
  useEffect(() => {
    const handleSeek = (e: any) => {
      const secs = Number(e.detail?.seconds);
      if (!isNaN(secs) && audioRef.current) {
        audioRef.current.currentTime = secs;
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    };

    window.addEventListener("seek_audio", handleSeek);
    return () => window.removeEventListener("seek_audio", handleSeek);
  }, []);

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const t = audioRef.current.currentTime;
      setCurrentTime(t);
      if (onTimeUpdate) onTimeUpdate(t);
      window.dispatchEvent(new CustomEvent("audio_time_update", { detail: { currentTime: t } }));
    }
  };

  const togglePlay = () => {
    if (!audioRef.current || !audioUrl) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const skipTime = (delta: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + delta));
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
    }
  };

  const cyclePlaybackRate = () => {
    const rates = [1, 1.25, 1.5, 2];
    const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
    const nextRate = rates[nextIdx];
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (audioUrl && audioUrl.startsWith("blob:")) {
        URL.revokeObjectURL(audioUrl);
      }
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      setFileName(file.name);
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  return (
    <div
      style={{
        background: "rgba(18, 18, 28, 0.85)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(124, 58, 237, 0.35)",
        borderRadius: "14px",
        padding: "16px 20px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
        marginBottom: "20px",
      }}
    >
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      {/* Header bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "8px",
              background: "rgba(124, 58, 237, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#A78BFA",
            }}
          >
            <Music size={16} />
          </div>
          <div>
            <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
              {fileName || title}
            </p>
            <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: 0 }}>
              {audioUrl
                ? "Clique em qualquer timestamp [00:00] para tocar o áudio naquele exato momento"
                : "Carregue o arquivo de áudio para sincronizar com os timestamps"}
            </p>
          </div>
        </div>

        {/* Upload file button for local session playback */}
        <label
          style={{
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px",
            padding: "5px 12px",
            borderRadius: "8px",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid var(--border-subtle)",
            color: "var(--text-secondary)",
            transition: "all 0.2s",
          }}
          title="Carregar áudio do seu computador para sincronizar reprodução"
        >
          <Upload size={13} color="#A78BFA" />
          <span>{audioUrl ? "Trocar áudio" : "Carregar áudio da sessão"}</span>
          <input
            type="file"
            accept="audio/*,video/*"
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />
        </label>
      </div>

      {/* Main player controls if audio is loaded */}
      {audioUrl ? (
        <div>
          {/* Progress Slider */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
            <span style={{ fontSize: "12px", fontFamily: "monospace", color: "#A78BFA", minWidth: 42 }}>
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSeekChange}
              style={{
                flex: 1,
                cursor: "pointer",
                accentColor: "#7C3AED",
                height: "6px",
              }}
            />
            <span style={{ fontSize: "12px", fontFamily: "monospace", color: "var(--text-muted)", minWidth: 42 }}>
              {formatTime(duration)}
            </span>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                onClick={() => skipTime(-5)}
                className="btn-ghost"
                style={{ padding: "6px 10px", fontSize: "12px", borderRadius: "8px" }}
                title="Voltar 5 segundos"
              >
                <RotateCcw size={14} /> -5s
              </button>

              <button
                onClick={togglePlay}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)",
                  border: "none",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(124, 58, 237, 0.4)",
                  transition: "transform 0.15s ease",
                }}
                title={isPlaying ? "Pausar" : "Reproduzir"}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: "2px" }} />}
              </button>

              <button
                onClick={() => skipTime(5)}
                className="btn-ghost"
                style={{ padding: "6px 10px", fontSize: "12px", borderRadius: "8px" }}
                title="Avançar 5 segundos"
              >
                <RotateCw size={14} /> +5s
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                onClick={cyclePlaybackRate}
                className="btn-ghost"
                style={{
                  padding: "5px 10px",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: playbackRate > 1 ? "#67E8F9" : "var(--text-secondary)",
                  borderRadius: "8px",
                }}
                title="Alterar velocidade de reprodução"
              >
                {playbackRate}x
              </button>

              <button
                onClick={toggleMute}
                className="btn-ghost"
                style={{ padding: "6px 10px", borderRadius: "8px" }}
                title={isMuted ? "Desativar mudo" : "Silenciar"}
              >
                {isMuted ? <VolumeX size={15} color="#EF4444" /> : <Volume2 size={15} />}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Prompt to select file if no audio loaded yet */
        <div
          style={{
            padding: "12px 14px",
            background: "rgba(124, 58, 237, 0.08)",
            borderRadius: "10px",
            border: "1px dashed rgba(124, 58, 237, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Sparkles size={15} color="#A78BFA" />
            <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
              Deseja ouvir o áudio enquanto confere o texto? Carregue o arquivo de mídia para sincronizar.
            </span>
          </div>
          <label
            style={{
              cursor: "pointer",
              fontSize: "12px",
              padding: "5px 14px",
              borderRadius: "8px",
              background: "rgba(124, 58, 237, 0.2)",
              border: "1px solid rgba(124, 58, 237, 0.4)",
              color: "#E0E7FF",
              fontWeight: 600,
            }}
          >
            Selecionar arquivo
            <input
              type="file"
              accept="audio/*,video/*"
              onChange={handleFileSelect}
              style={{ display: "none" }}
            />
          </label>
        </div>
      )}
    </div>
  );
}
