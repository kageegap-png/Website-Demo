(function () {
  "use strict";

  var nav = document.getElementById("site-nav");
  var toggle = document.getElementById("nav-toggle");

  function setNav(open) {
    if (!nav || !toggle) return;
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setNav(!nav.classList.contains("is-open"));
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setNav(false);
      });
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setNav(false);
    });
    document.addEventListener("click", function (event) {
      if (!nav.classList.contains("is-open")) return;
      if (nav.contains(event.target) || toggle.contains(event.target)) return;
      setNav(false);
    });
  }

  var form = document.getElementById("quote-form");
  var success = document.getElementById("quote-success");
  var mailtoFallback = document.getElementById("mailto-fallback");

  function fieldValue(id) {
    var el = document.getElementById(id);
    return el ? String(el.value || "").trim() : "";
  }

  function setInvalid(field, invalid, message) {
    if (!field) return;
    field.classList.toggle("is-invalid", invalid);
    var err = field.querySelector(".error");
    if (err && message) err.textContent = message;
  }

  function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function isPhone(value) {
    if (!value) return true;
    var digits = value.replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 15;
  }

  function validate() {
    var ok = true;
    var nameField = document.getElementById("field-name");
    var emailField = document.getElementById("field-email");
    var phoneField = document.getElementById("field-phone");
    var messageField = document.getElementById("field-message");

    var name = fieldValue("name");
    var email = fieldValue("email");
    var phone = fieldValue("phone");
    var message = fieldValue("message");

    if (!name) {
      setInvalid(nameField, true, "Please enter your name.");
      ok = false;
    } else {
      setInvalid(nameField, false);
    }

    if (!email) {
      setInvalid(emailField, true, "Please enter your email address.");
      ok = false;
    } else if (!isEmail(email)) {
      setInvalid(emailField, true, "Please enter a valid email address.");
      ok = false;
    } else {
      setInvalid(emailField, false);
    }

    if (!isPhone(phone)) {
      setInvalid(phoneField, true, "Please enter a phone number with at least 10 digits, or leave this blank.");
      ok = false;
    } else {
      setInvalid(phoneField, false);
    }

    if (!message) {
      setInvalid(messageField, true, "Please tell us a little about your project.");
      ok = false;
    } else {
      setInvalid(messageField, false);
    }

    return ok;
  }

  function buildMailto() {
    var lines = [
      "Name: " + fieldValue("name"),
      "Email: " + fieldValue("email"),
      "Phone: " + fieldValue("phone"),
      "Service: " + fieldValue("service"),
      "Event date: " + fieldValue("event-date"),
      "Studio or company: " + fieldValue("organization"),
      "Venue or city: " + fieldValue("venue"),
      "",
      fieldValue("message")
    ];
    var subject = "Quote request from " + (fieldValue("name") || "the Gotham Arts HD website");
    return "mailto:contact@gothamartshd.com?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(lines.join("\n"));
  }

  function updateMailto() {
    if (mailtoFallback) mailtoFallback.setAttribute("href", buildMailto());
  }

  document.querySelectorAll(".video-frame[data-video-id]").forEach(function (frame) {
    var button = frame.querySelector(".video-facade");
    if (!button) return;
    button.addEventListener("click", function () {
      var id = frame.getAttribute("data-video-id");
      var title = frame.getAttribute("data-video-title") || "YouTube video";
      var iframe = document.createElement("iframe");
      iframe.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id) + "?rel=0&autoplay=1";
      iframe.title = title;
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.setAttribute("allowfullscreen", "");
      iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
      frame.innerHTML = "";
      frame.appendChild(iframe);
      iframe.focus();
    });
  });

  if (form) {
    form.addEventListener("input", updateMailto);
    form.addEventListener("change", updateMailto);
    updateMailto();

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!validate()) {
        var firstInvalid = form.querySelector(".is-invalid input, .is-invalid select, .is-invalid textarea");
        if (firstInvalid) firstInvalid.focus();
        return;
      }
      form.classList.add("is-sent");
      if (success) {
        success.classList.add("is-visible");
        var mail = success.querySelector("[data-success-mailto]");
        if (mail) mail.setAttribute("href", buildMailto());
        success.setAttribute("tabindex", "-1");
        success.focus();
      }
    });
  }
})();
