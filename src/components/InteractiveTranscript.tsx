"use client";

import { useMemo } from "react";
import { parseTimestampToSeconds, seekAudioTimestamp } from "./AudioSyncPlayer";
import { Play } from "lucide-react";

interface InteractiveTranscriptProps {
  text: string;
  searchQuery?: string;
  activeTime?: number;
}

export default function InteractiveTranscript({
  text,
  searchQuery = "",
  activeTime,
}: InteractiveTranscriptProps) {
  // Regex to detect [00:00], [01:23:45], (00:00) or plain lines
  const lines = useMemo(() => {
    return (text || "").split("\n");
  }, [text]);

  const timestampRegex = /(\[?\b\d{1,2}:\d{2}(?::\d{2})?\b\]?)/g;

  return (
    <div
      style={{
        lineHeight: 1.75,
        fontSize: "14px",
        color: "var(--text-secondary)",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      {lines.map((line, idx) => {
        if (!line.trim()) return <div key={idx} style={{ height: "6px" }} />;

        // Check if line contains a timestamp
        const parts = line.split(timestampRegex);

        return (
          <p key={idx} style={{ margin: 0 }}>
            {parts.map((part, partIdx) => {
              const isMatch = part.match(/^\[?\b\d{1,2}:\d{2}(?::\d{2})?\b\]?$/);
              if (isMatch) {
                const clean = part.replace(/[\[\]]/g, "");
                const seconds = parseTimestampToSeconds(clean);

                return (
                  <button
                    key={partIdx}
                    onClick={() => seekAudioTimestamp(seconds)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "3px",
                      marginRight: "6px",
                      padding: "2px 8px",
                      borderRadius: "6px",
                      background: "rgba(124, 58, 237, 0.15)",
                      border: "1px solid rgba(124, 58, 237, 0.35)",
                      color: "#A78BFA",
                      fontSize: "12px",
                      fontFamily: "monospace",
                      fontWeight: 700,
                      cursor: "pointer",
                      verticalAlign: "middle",
                      transition: "all 0.15s ease",
                    }}
                    title={`Clique para tocar o áudio em ${clean}`}
                  >
                    <Play size={10} style={{ fill: "#A78BFA" }} />
                    {clean}
                  </button>
                );
              }

              // Highlight search query if applicable
              if (searchQuery.trim() && part.toLowerCase().includes(searchQuery.toLowerCase())) {
                const q = searchQuery.toLowerCase();
                const subParts = part.split(new RegExp(`(${searchQuery})`, "gi"));
                return (
                  <span key={partIdx}>
                    {subParts.map((sub, sIdx) =>
                      sub.toLowerCase() === q ? (
                        <mark
                          key={sIdx}
                          style={{
                            background: "rgba(245, 158, 11, 0.3)",
                            color: "#FDE68A",
                            borderRadius: "3px",
                            padding: "0 2px",
                          }}
                        >
                          {sub}
                        </mark>
                      ) : (
                        sub
                      )
                    )}
                  </span>
                );
              }

              return <span key={partIdx}>{part}</span>;
            })}
          </p>
        );
      })}
    </div>
  );
}
