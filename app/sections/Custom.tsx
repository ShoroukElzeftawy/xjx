"use client";

import { useState } from "react";

export function Custom() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <section className="custom-hero">
        <div>
          <p className="eyebrow">[ COMMISSION / ONE OF ONE ]</p>
          <h1>YOUR IDEA.<br /><i>ENGINEERED.</i></h1>
          <p>A direct collaboration. Form, weight, and material decided in the open — then made on the bench.</p>
        </div>
        <div className="blueprint">
          <span className="draft-ring" />
          <small>PROPOSAL STUDY<br />SECTION A–A</small>
        </div>
      </section>
      <section className="process">
        <div className="section-title">
          <p>01 / PROCESS</p>
          <h2>FOUR POINTS<br />FROM IDEA TO OBJECT.</h2>
        </div>
        <div className="process-grid">
          {[
            ["01", "BRIEF", "Story, function, weight, budget."],
            ["02", "DESIGN", "Form and material, drawn as structure."],
            ["03", "REFINE", "You review scale, finish, and data."],
            ["04", "MAKE", "Cast, set, and finished by hand in Canada."],
          ].map((item) => (
            <article key={item[0]}>
              <span>{item[0]}</span>
              <h3>{item[1]}</h3>
              <p>{item[2]}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="commission">
        <div>
          <p>02 / START A COMMISSION</p>
          <h2>BEGIN WITH<br />WHAT YOU KNOW.</h2>
          <p>A memory, a sketch, a carat target, or one sentence is enough.</p>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setSent(true);
          }}
        >
          <label>YOUR NAME<input required placeholder="FULL NAME" name="name" /></label>
          <label>EMAIL<input required type="email" placeholder="YOU@EMAIL.COM" name="email" /></label>
          <label>
            OBJECT TYPE
            <select name="type">
              <option>RING</option>
              <option>NECKLACE</option>
              <option>BRACELET</option>
              <option>OTHER</option>
            </select>
          </label>
          <label>THE IDEA<textarea placeholder="TELL US WHAT YOU ARE IMAGINING…" name="idea" /></label>
          <button className="add" type="submit">{sent ? "BRIEF RECEIVED" : "SEND THE BRIEF ↗"}</button>
        </form>
      </section>
    </>
  );
}
