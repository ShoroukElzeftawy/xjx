import type { BagLine } from "../lib/types";

export function Cart({
  open,
  lines,
  checkingOut,
  onClose,
  onCheckout,
  onChangeQty,
  onRemove,
}: {
  open: boolean;
  lines: BagLine[];
  checkingOut: boolean;
  onClose: () => void;
  onCheckout: () => void;
  onChangeQty: (variantId: string, quantity: number) => void;
  onRemove: (variantId: string) => void;
}) {
  if (!open) return null;

  const count = lines.reduce((sum, line) => sum + line.quantity, 0);

  return (
    <div className="cart-layer">
      <button className="cart-scrim" type="button" aria-label="Close bag" onClick={onClose} />
      <aside className="cart-panel" role="dialog" aria-label="Shopping bag">
        <div className="cart-head">
          <p>BAG [{String(count).padStart(2, "0")}]</p>
          <button type="button" onClick={onClose}>CLOSE</button>
        </div>
        {lines.length ? (
          <ul className="cart-lines">
            {lines.map((line) => (
              <li key={line.variantId || line.name}>
                <div className="cart-thumb" style={line.image ? { backgroundImage: `url(${line.image})` } : undefined} />
                <div>
                  <b>{line.name}</b>
                  <span>{line.sku || line.variantTitle || "STANDARD"}</span>
                  <span>{line.price}</span>
                  <div className="cart-qty">
                    <button type="button" onClick={() => onChangeQty(line.variantId || line.name, line.quantity - 1)} aria-label="Decrease quantity">−</button>
                    <em>{line.quantity}</em>
                    <button type="button" onClick={() => onChangeQty(line.variantId || line.name, line.quantity + 1)} aria-label="Increase quantity">+</button>
                    <button type="button" className="cart-remove" onClick={() => onRemove(line.variantId || line.name)}>REMOVE</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="cart-empty">Your bag is empty. Add an object, then check out through Shopify.</p>
        )}
        <button className="add cart-checkout" type="button" disabled={!lines.length || checkingOut} onClick={onCheckout}>
          {checkingOut ? "OPENING SHOPIFY…" : "CHECK OUT ON SHOPIFY ↗"}
        </button>
      </aside>
    </div>
  );
}
