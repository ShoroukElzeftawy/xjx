"use client";

import { useEffect, useRef, useState } from "react";
import { onSkinChange, readStoredSkin, SKIN_STOPS, writeStoredSkin, type SkinIndex } from "../lib/skin-tone";

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function SkinToneSlider({
  available = true,
  fixed = false,
  inputId = "skin-tone",
}: {
  available?: boolean;
  fixed?: boolean;
  inputId?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const [skin, setSkin] = useState<SkinIndex>(2);
  const [pos, setPos] = useState(2);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const stored = readStoredSkin();
    setSkin(stored);
    setPos(stored);
    return onSkinChange((next) => {
      if (draggingRef.current) return;
      setSkin(next);
      setPos(next);
    });
  }, []);

  const moveTo = (clientX: number) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const thumb = 32;
    const pad = 4;
    const usable = Math.max(1, rect.width - pad * 2 - thumb);
    const next = clamp01((clientX - rect.left - pad - thumb / 2) / usable) * 4;
    const snapped = Math.round(next) as SkinIndex;
    setPos(next);
    setSkin(snapped);
    writeStoredSkin(snapped);
  };

  const stopDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    draggingRef.current = false;
    setDragging(false);
    setPos((current) => Math.round(current));
  };

  if (!available) return null;

  const bubble = SKIN_STOPS[skin];

  return (
    <div
      className={`skin-slider${fixed ? " is-fixed" : ""}${dragging ? " is-dragging" : ""}`}
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <div
        ref={trackRef}
        className="skin-slider-track"
        role="slider"
        id={inputId}
        tabIndex={0}
        aria-valuemin={0}
        aria-valuemax={4}
        aria-valuenow={skin}
        aria-valuetext={bubble.label}
        aria-label="Skin tone"
        style={{ ["--skin-pos" as string]: String(pos / 4) }}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          draggingRef.current = true;
          setDragging(true);
          moveTo(event.clientX);
        }}
        onPointerMove={(event) => {
          if (!draggingRef.current) return;
          moveTo(event.clientX);
        }}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
            event.preventDefault();
            writeStoredSkin(Math.max(0, skin - 1) as SkinIndex);
          }
          if (event.key === "ArrowRight" || event.key === "ArrowUp") {
            event.preventDefault();
            writeStoredSkin(Math.min(4, skin + 1) as SkinIndex);
          }
        }}
      >
        <span className="skin-slider-word" aria-hidden="true">
          SKINTONE
        </span>
        <span className="skin-slider-bubble" aria-hidden="true" style={{ background: bubble.swatch }} />
      </div>
    </div>
  );
}
