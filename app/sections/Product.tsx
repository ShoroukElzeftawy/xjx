"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { axesLabel, galleryForVariant, isStudioPhoto, parseAxes } from "../lib/product-options";
import { modelPhotos, onSkinChange, photoForSkin, readStoredSkin, type SkinIndex } from "../lib/skin-tone";
import type { Go, ProductItem } from "../lib/types";
import { HeartIcon, itemKey } from "../components/Heart";
import { ProductOptions } from "../components/ProductOptions";
import { SkinToneSlider } from "../components/SkinToneSlider";

export function Product({
  item,
  add,
  go,
  likedIds,
  onToggleLike,
}: {
  item: ProductItem;
  add: (item: ProductItem, variantId?: string) => void;
  go: Go;
  likedIds?: string[];
  onToggleLike?: (item: ProductItem) => void;
}) {
  const variants = (item.variants ?? []).filter((variant) => variant.title && !/default title/i.test(variant.title));
  const [imageIndex, setImageIndex] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [variantId, setVariantId] = useState(item.variantId ?? variants[0]?.id ?? "");
  const [skin, setSkin] = useState<SkinIndex>(2);
  const active = variants.find((variant) => variant.id === variantId) ?? variants[0];
  const gallery = useMemo(() => galleryForVariant(item, active), [item, active]);
  const models = useMemo(
    () => modelPhotos([item.image, ...(item.images ?? []), ...(item.variants ?? []).map((variant) => variant.image)].filter((url): url is string => Boolean(url))),
    [item],
  );
  const sku = active?.sku || item.sku || item.code;
  const photo = gallery[imageIndex] || item.image;
  const studio = isStudioPhoto(photo);
  const axes = parseAxes(item, active);
  const liked = likedIds?.includes(itemKey(item));

  useEffect(() => {
    setSkin(readStoredSkin());
    return onSkinChange(setSkin);
  }, []);

  useEffect(() => {
    setVariantId(item.variantId ?? item.variants?.[0]?.id ?? "");
    setImageIndex(0);
  }, [item.code, item.variantId, item.variants]);

  useEffect(() => {
    setImageIndex(0);
  }, [variantId]);

  useEffect(() => {
    const match = photoForSkin(models.length ? models : gallery, skin);
    if (!match) return;
    const index = gallery.indexOf(match);
    if (index >= 0) setImageIndex(index);
  }, [gallery, skin]);

  useEffect(() => {
    if (!viewerOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setViewerOpen(false);
      if (event.key === "ArrowLeft") moveImage(-1);
      if (event.key === "ArrowRight") moveImage(1);
    };
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [viewerOpen]);

  const moveImage = (direction: number) => {
    if (!gallery.length) return;
    setImageIndex((current) => (current + direction + gallery.length) % gallery.length);
  };

  const pickVariant = (id: string) => {
    setVariantId(id);
    setImageIndex(0);
  };

  return (
    <>
      <section className="product-page">
        <div
          className="product-gallery carousel"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") moveImage(-1);
            if (event.key === "ArrowRight") moveImage(1);
          }}
          aria-label={`${item.name} image gallery`}
        >
          <div className={`gallery-main imported${studio ? " is-studio" : ""}`}>
            {photo ? (
              <button type="button" className="gallery-open" onClick={() => setViewerOpen(true)} aria-label={`Open ${item.name} image`}>
                <img src={photo} alt="" />
              </button>
            ) : null}
            <small>
              {sku} / {axesLabel(item, active)} / IMAGE {String(imageIndex + 1).padStart(2, "0")} OF {String(Math.max(gallery.length, 1)).padStart(2, "0")}
            </small>
            {gallery.length > 1 && (
              <div className="gallery-controls">
                <button type="button" onClick={() => moveImage(-1)} aria-label="Previous product image">←</button>
                <button type="button" onClick={() => moveImage(1)} aria-label="Next product image">→</button>
              </div>
            )}
            <SkinToneSlider available={models.length > 1} inputId="pdp-skin-tone" />
            {onToggleLike ? (
              <button
                type="button"
                className={`like-toggle gallery-like${liked ? " is-on" : ""}`}
                aria-label={liked ? `Remove ${item.name} from saved` : `Save ${item.name}`}
                aria-pressed={liked}
                onClick={() => onToggleLike(item)}
              >
                <HeartIcon filled={liked} />
              </button>
            ) : null}
          </div>
        </div>
        <div className="buy-panel">
          <p className="eyebrow">
            {sku} / {item.type.replace(/S$/, "")}
          </p>
          <h1>{item.name}</h1>
          <div className="price-row">
            <p className="price">{active?.price ?? item.price} <span>LIVE PRICE</span></p>
            {onToggleLike ? (
              <button
                type="button"
                className={`like-toggle${liked ? " is-on" : ""}`}
                aria-label={liked ? `Remove ${item.name} from saved` : `Save ${item.name}`}
                aria-pressed={liked}
                onClick={() => onToggleLike(item)}
              >
                <HeartIcon filled={liked} />
              </button>
            ) : null}
          </div>
          <ProductOptions item={item} variantId={active?.id} onPick={pickVariant} labeled />
          <p className="description">
            {item.description || "An original XJEWELRYX object. Weight, karat, and options are listed. Size is given by comparison, not only millimeters."}
          </p>
          <div className="size-compare">
            <p>SIZE, COMPARED</p>
            <p>{item.sizeCompare || "We size against something you already wear — a coin, a hoop, a chain on the neck — not a tape measure alone."}</p>
          </div>
          <button className="add" type="button" onClick={() => add({ ...item, variantId: active?.id ?? variantId }, active?.id ?? variantId)}>
            ADD TO BAG — {active?.price ?? item.price} <b>↗</b>
          </button>
        </div>
      </section>
      <section className="detail-story">
        <p>01 / CONSTRUCTION</p>
        <h2>STRUCTURAL GOLD.<br /><i>NO ROMANCE.</i></h2>
        <p>Folder codes mark the family: XJ4 earrings, XJ3 bracelets, XJ2 rings, XJ5 necklaces, XJ1 chains. The number is the object. Karat is in the name, not hidden in a spec sheet.</p>
      </section>
      <section className="next-object">
        <p>RETURN TO COLLECTION</p>
        <button type="button" onClick={() => go("shop")}>VIEW ALL OBJECTS <span>↗</span></button>
      </section>
      {viewerOpen && photo
        ? createPortal(
            <div className="image-viewer" role="dialog" aria-modal="true" aria-label={`${item.name} image`} onClick={() => setViewerOpen(false)}>
              <button type="button" className="image-viewer-close" onClick={() => setViewerOpen(false)} aria-label="Close image">
                CLOSE
              </button>
              {gallery.length > 1 ? (
                <button
                  type="button"
                  className="image-viewer-nav prev"
                  onClick={(event) => {
                    event.stopPropagation();
                    moveImage(-1);
                  }}
                  aria-label="Previous product image"
                >
                  ←
                </button>
              ) : null}
              <img
                src={photo}
                alt={item.name}
                onClick={(event) => event.stopPropagation()}
              />
              {gallery.length > 1 ? (
                <button
                  type="button"
                  className="image-viewer-nav next"
                  onClick={(event) => {
                    event.stopPropagation();
                    moveImage(1);
                  }}
                  aria-label="Next product image"
                >
                  →
                </button>
              ) : null}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
