"use client";

import { useState } from "react";
import { accountLoginUrl, accountRecoverUrl, accountRegisterUrl } from "../lib/catalog";

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path fill="#4285F4" d="M22.6 12.23c0-.74-.07-1.45-.19-2.13H12v4.03h5.94a5.08 5.08 0 0 1-2.2 3.33v2.77h3.56c2.08-1.92 3.3-4.74 3.3-8z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.99.66-2.26 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.85A10.99 10.99 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.43.34-2.1V7.05H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.95l3.66-2.85z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.07.56 4.21 1.64l3.16-3.16C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.85C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}

function AppleMark() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M16.37 12.63c.03 3.24 2.84 4.32 2.87 4.33-.02.08-.45 1.54-1.48 3.05-.89 1.31-1.82 2.61-3.28 2.64-1.43.03-1.89-.85-3.53-.85-1.64 0-2.15.82-3.5.87-1.4.05-2.47-1.42-3.37-2.72-1.84-2.66-3.25-7.52-1.36-10.8 1-.1.94 1.72 2.36 1.79 1.4.07 2.05-1.2 3.84-1.29 1.22-.06 2.37.84 3.14.84.77 0 2.21-1.03 3.73-.88.63.03 2.41.26 3.55 1.92-.09.06-2.12 1.24-2.97 3.1zM13.9 6.4c.77-.93 1.29-2.23 1.15-3.52-1.11.05-2.46.74-3.26 1.67-.72.82-1.35 2.15-1.18 3.41 1.25.1 2.52-.64 3.29-1.56z"
      />
    </svg>
  );
}

function ShopMark() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path fill="currentColor" d="M16.6 6.2c-.4-2.2-2.3-3.7-4.6-3.7S7.8 4 7.4 6.2H4.8v12.6h14.4V6.2h-2.6zm-4.6-2c1.4 0 2.6.9 2.9 2.2H9.1c.3-1.3 1.5-2.2 2.9-2.2zM7.2 8h9.6v9H7.2V8z" />
    </svg>
  );
}

export function Account() {
  const [mode, setMode] = useState<"signin" | "create">("signin");
  const login = accountLoginUrl();
  const register = accountRegisterUrl();
  const creating = mode === "create";

  return (
    <section className="account-page">
      <p className="eyebrow">{creating ? "[ ACCOUNT / CREATE ]" : "[ ACCOUNT / SIGN IN ]"}</p>
      <h1>
        {creating ? (
          <>
            CREATE<br />
            <i>ACCOUNT.</i>
          </>
        ) : (
          <>
            SIGN<br />
            <i>IN.</i>
          </>
        )}
      </h1>
      <p>
        {creating
          ? "Make an account to track orders, save a default address, and check out faster."
          : "Sign in to see orders, addresses, and checkout details."}
      </p>

      <div className="account-modes" role="tablist" aria-label="Account">
        <button type="button" role="tab" aria-selected={!creating} className={creating ? "" : "is-on"} onClick={() => setMode("signin")}>
          SIGN IN
        </button>
        <button type="button" role="tab" aria-selected={creating} className={creating ? "is-on" : ""} onClick={() => setMode("create")}>
          CREATE ACCOUNT
        </button>
      </div>

      <div className="account-social">
        <a className="account-social-btn" href={login}>
          <GoogleMark />
          Continue with Google
        </a>
        <a className="account-social-btn" href={login}>
          <AppleMark />
          Continue with Apple
        </a>
        <a className="account-social-btn" href={login}>
          <ShopMark />
          Continue with Shop
        </a>
      </div>

      <p className="account-or">or with email</p>

      {creating ? (
        <form className="account-form" method="post" action={register} acceptCharset="UTF-8">
          <input type="hidden" name="form_type" value="create_customer" />
          <input type="hidden" name="utf8" value="✓" />
          <label>
            First name
            <input type="text" name="customer[first_name]" autoComplete="given-name" />
          </label>
          <label>
            Last name
            <input type="text" name="customer[last_name]" autoComplete="family-name" />
          </label>
          <label>
            Email
            <input type="email" name="customer[email]" autoComplete="email" required />
          </label>
          <label>
            Password
            <input type="password" name="customer[password]" autoComplete="new-password" required minLength={5} />
          </label>
          <button className="account-submit" type="submit">
            CREATE ACCOUNT
          </button>
        </form>
      ) : (
        <form className="account-form" method="post" action={login} acceptCharset="UTF-8">
          <input type="hidden" name="form_type" value="customer_login" />
          <input type="hidden" name="utf8" value="✓" />
          <label>
            Email
            <input type="email" name="customer[email]" autoComplete="email" required />
          </label>
          <label>
            Password
            <input type="password" name="customer[password]" autoComplete="current-password" required />
          </label>
          <a className="account-forgot" href={accountRecoverUrl()}>
            Forgot password?
          </a>
          <button className="account-submit" type="submit">
            SIGN IN
          </button>
        </form>
      )}
    </section>
  );
}
