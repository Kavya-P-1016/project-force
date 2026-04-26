(function () {
  'use strict';

  const form = document.getElementById('contactForm');
  if (!form) return;

  const fields = [
    { id: 'name', label: 'Full name', required: true, min: 2 },
    { id: 'phone', label: 'Phone number', required: true, pattern: /^[0-9+()\-\s]{7,20}$/ },
    { id: 'email', label: 'Email address', required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/ },
    { id: 'message', label: 'Message', required: true, min: 10 }
  ];

  function showError(id, msg) {
    const err = document.getElementById(id + 'Error');
    const input = document.getElementById(id);
    if (err) err.textContent = msg;
    if (input) {
      input.classList.toggle('is-invalid', !!msg);
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    }
  }

  function validateField(f) {
    const el = document.getElementById(f.id);
    if (!el) return true;
    const v = (el.value || '').trim();

    if (f.required && !v) {
      showError(f.id, f.label + ' is required.');
      return false;
    }
    if (f.min && v.length < f.min) {
      showError(f.id, f.label + ' must be at least ' + f.min + ' characters.');
      return false;
    }
    if (f.pattern && v && !f.pattern.test(v)) {
      showError(f.id, 'Please enter a valid ' + f.label.toLowerCase() + '.');
      return false;
    }
    showError(f.id, '');
    return true;
  }

  fields.forEach((f) => {
    const el = document.getElementById(f.id);
    if (!el) return;
    el.addEventListener('blur', () => validateField(f));
    el.addEventListener('input', () => {
      if (el.classList.contains('is-invalid')) validateField(f);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Honeypot: if filled, silently drop the submission (likely a bot).
    const honeypot = form.querySelector('input[name="website"]');
    if (honeypot && honeypot.value) {
      return;
    }

    const results = fields.map(validateField);
    if (!results.every(Boolean)) {
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const data = {
      name: form.name.value.trim(),
      company: (form.company.value || '').trim(),
      phone: form.phone.value.trim(),
      email: form.email.value.trim(),
      service: form.service.value,
      message: form.message.value.trim()
    };

    const subject = 'Website enquiry from ' + data.name;
    const body = [
      'Name: ' + data.name,
      'Company: ' + (data.company || '-'),
      'Phone: ' + data.phone,
      'Email: ' + data.email,
      'Service: ' + (data.service || '-'),
      '',
      'Message:',
      data.message
    ].join('\n');

    const mailto =
      'mailto:info@projectforce.in' +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);

    window.location.href = mailto;

    const successEl = document.getElementById('formSuccess');
    if (successEl) {
      successEl.classList.add('is-visible');
      successEl.setAttribute('tabindex', '-1');
      successEl.focus({ preventScroll: false });
      successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    form.reset();
  });
})();
