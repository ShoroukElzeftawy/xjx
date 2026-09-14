"use client";

import { referralCandyJoinUrl } from "../lib/referral";

export function ReferralJoin() {
  return (
    <div className="referral-join">
      <a
        className="outline"
        href={referralCandyJoinUrl}
        rel="noreferrer"
        onClick={(event) => {
          event.preventDefault();
          window.location.href = referralCandyJoinUrl;
        }}
      >
        GET YOUR REFERRAL LINK →
      </a>
    </div>
  );
}
