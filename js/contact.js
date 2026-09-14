/* =========================================================
   Moonpure — contact form validation + FAQ accordion
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* ---- Form validation ---- */
  const form = document.getElementById("contactForm");
  if (form) {
    const successBox = document.getElementById("formSuccess");

    const rules = {
      name: v => v.trim().length >= 3 || "Please enter your full name (at least 3 characters).",
      email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || "Enter a valid email address.",
      phone: v => /^[0-9+\-\s]{7,15}$/.test(v.trim()) || "Enter a valid phone number.",
      subject: v => v !== "" || "Please choose an order type.",
      message: v => v.trim().length >= 10 || "Message should be at least 10 characters.",
    };

    function validateField(field) {
      const rule = rules[field.name];
      if (!rule) return true;
      const result = rule(field.value);
      const row = field.closest(".form-row");
      const errorEl = row.querySelector(".field-error");
      if (result === true) {
        row.classList.remove("has-error");
        errorEl.textContent = "";
        return true;
      } else {
        row.classList.add("has-error");
        errorEl.textContent = result;
        return false;
      }
    }

    form.querySelectorAll("input, select, textarea").forEach(field => {
      field.addEventListener("blur", () => validateField(field));
    });

    form.addEventListener("submit", e => {
      e.preventDefault();
      const fields = Array.from(form.querySelectorAll("input, select, textarea"));
      const allValid = fields.map(validateField).every(Boolean);

      if (allValid) {
        successBox.classList.add("is-visible");
        successBox.textContent = "Thanks! Your message has been noted — we'll reach out on WhatsApp or email shortly.";
        form.reset();
        window.setTimeout(() => successBox.classList.remove("is-visible"), 5000);
      } else {
        successBox.classList.remove("is-visible");
      }
    });
  }

  /* ---- FAQ accordion ---- */
  document.querySelectorAll(".accordion-item").forEach(item => {
    const trigger = item.querySelector(".accordion-trigger");
    const panel = item.querySelector(".accordion-panel");

    trigger.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");

      document.querySelectorAll(".accordion-item").forEach(other => {
        other.classList.remove("is-open");
        other.querySelector(".accordion-panel").style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add("is-open");
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });
});
