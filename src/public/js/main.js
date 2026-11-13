
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('form').forEach((form) => {
    form.addEventListener('submit', () => {
      const btn = form.querySelector('.btn-bio');
      if (btn && form.checkValidity()) {
        btn.classList.add('cargando');
        btn.disabled = true;
      }
    });
  });

  document.querySelectorAll('form[data-confirmar]').forEach((form) => {
    form.addEventListener('submit', (evento) => {
      if (!window.confirm(form.dataset.confirmar)) evento.preventDefault();
    });
  });

  document.querySelectorAll('select[data-auto-submit]').forEach((select) => {
    select.addEventListener('change', () => select.form.submit());
  });
});

window.addEventListener('pageshow', () => {
  document.querySelectorAll('.btn-bio.cargando').forEach((btn) => {
    btn.classList.remove('cargando');
    btn.disabled = false;
  });
});
