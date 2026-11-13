// Comportamiento del lado del cliente (sin JavaScript en línea en las plantillas)
document.addEventListener('DOMContentLoaded', () => {
  // Botón con spinner mientras se envía un formulario válido
  document.querySelectorAll('form').forEach((form) => {
    form.addEventListener('submit', () => {
      const btn = form.querySelector('.btn-bio');
      if (btn && form.checkValidity()) {
        btn.classList.add('cargando');
        btn.disabled = true;
      }
    });
  });

  // Confirmación antes de enviar: <form data-confirmar="mensaje">
  document.querySelectorAll('form[data-confirmar]').forEach((form) => {
    form.addEventListener('submit', (evento) => {
      if (!window.confirm(form.dataset.confirmar)) evento.preventDefault();
    });
  });

  // Envío automático al cambiar un select: <select data-auto-submit>
  document.querySelectorAll('select[data-auto-submit]').forEach((select) => {
    select.addEventListener('change', () => select.form.submit());
  });
});

// Restaura los botones si el usuario vuelve con "Atrás" (bfcache)
window.addEventListener('pageshow', () => {
  document.querySelectorAll('.btn-bio.cargando').forEach((btn) => {
    btn.classList.remove('cargando');
    btn.disabled = false;
  });
});
