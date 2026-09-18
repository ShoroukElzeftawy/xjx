"use client";

import { useEffect, useState } from "react";
import { onSkinChange, readStoredSkin, SKIN_STOPS, writeStoredSkin, type SkinIndex } from "../lib/skin-tone";

export function SkinToneSlider({
  available = true,
  fixed = false,
  inputId = "skin-tone",
}: {
  available?: boolean;
  fixed?: boolean;
  inputId?: string;
}) {
  const [skin, setSkin] = useState<SkinIndex>(2);

  useEffect(() => {
    setSkin(readStoredSkin());
    return onSkinChange(setSkin);
  }, []);

  if (!available) return null;

  return (
    <div
      className={`skin-slider${fixed ? " is-fixed" : ""}`}
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <label className="skin-slider-label" htmlFor={inputId}>
        SKIN
      </label>
      <input
        id={inputId}
        className="skin-slider-range"
        type="range"
        min={0}
        max={4}
        step={1}
        value={skin}
        aria-valuetext={SKIN_STOPS[skin].label}
        onChange={(event) => writeStoredSkin(Number(event.target.value) as SkinIndex)}
      />
      <div className="skin-slider-swatches" aria-hidden="true">
        {SKIN_STOPS.map((stop, index) => (
          <button
            key={stop.id}
            type="button"
            className={`skin-swatch${index === skin ? " is-on" : ""}`}
            style={{ background: stop.swatch }}
            aria-label={stop.label}
            onClick={() => writeStoredSkin(index as SkinIndex)}
          />
        ))}
      </div>
    </div>
  );
}
