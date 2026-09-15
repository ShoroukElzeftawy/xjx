import type { ProductColor } from "../lib/taxonomy";

export function ColorDots({
  colors,
  active,
  onPick,
}: {
  colors: readonly string[];
  active?: string;
  onPick?: (color: ProductColor) => void;
}) {
  if (!colors.length) return null;

  return (
    <span className="product-colors">
      {colors.map((color) => {
        const className = `shop-swatch shop-swatch-${color.toLowerCase()}${active === color ? " is-on" : ""}`;
        if (onPick) {
          return (
            <button
              key={color}
              type="button"
              className={className}
              aria-label={`${color.toLowerCase()} gold`}
              onClick={() => onPick(color as ProductColor)}
            />
          );
        }
        return <i key={color} className={className} aria-label={`${color.toLowerCase()} gold`} />;
      })}
    </span>
  );
}
