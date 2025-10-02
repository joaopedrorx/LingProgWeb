// Máscaras e validações do formulário de endereço
// Requisitos: CEP máscara 00000-000; Logradouro min 5; Número apenas dígitos; UF somente 2 letras maiúsculas; Complemento opcional

(function () {
  const form = document.getElementById('form-endereco');
  const cep = document.getElementById('cep');
  const logradouro = document.getElementById('logradouro');
  const numero = document.getElementById('numero');
  const uf = document.getElementById('uf');

  // Helpers
  const onlyDigits = (s) => s.replace(/\D+/g, '');

  // CEP: aplica máscara enquanto digita usando regex com grupos de captura
  function maskCEP(value) {
    const digits = onlyDigits(value).slice(0, 8);
    // grupos de captura: 5 primeiros e 3 últimos
    return digits.replace(/(\d{5})(\d{0,3})/, (m, g1, g2) =>
      g2 ? `${g1}-${g2}` : g1
    );
  }

  // UF: manter sempre maiúsculo e limitar a duas letras
  function formatUF(value) {
    return value.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 2);
  }

  // Número: apenas dígitos
  function formatNumero(value) {
    return onlyDigits(value);
  }

  // Eventos de input (máscaras em tempo real)
  cep.addEventListener('input', (e) => {
    const caret = cep.selectionStart;
    const before = cep.value;
    cep.value = maskCEP(cep.value);
    // tentativa simples de manter o cursor próximo
    const delta = cep.value.length - before.length;
    cep.setSelectionRange(Math.max(0, (caret || 0) + delta), Math.max(0, (caret || 0) + delta));
  });

  uf.addEventListener('input', () => {
    uf.value = formatUF(uf.value);
  });

  numero.addEventListener('input', () => {
    numero.value = formatNumero(numero.value);
  });

  // Validações com regex e regras do enunciado
  function isCepValido(value) {
    return /^\d{5}-\d{3}$/.test(value);
  }

  function isLogradouroValido(value) {
    return (value || '').trim().length >= 5;
  }

  function isNumeroValido(value) {
    return /^\d+$/.test(value);
  }

  function isUfValido(value) {
    return /^[A-Z]{2}$/.test(value);
  }

  function alertErro(msg, el) {
    alert(msg);
    if (el && typeof el.focus === 'function') el.focus();
  }

  // Submit controlado
  form.addEventListener('submit', (ev) => {
    ev.preventDefault();

    // Normaliza entradas antes de validar
    cep.value = maskCEP(cep.value);
    uf.value = formatUF(uf.value);
    numero.value = formatNumero(numero.value);

    if (!isCepValido(cep.value)) {
      return alertErro('CEP inválido. Use o formato 00000-000.', cep);
    }

    if (!isLogradouroValido(logradouro.value)) {
      return alertErro('Logradouro obrigatório (mínimo 5 caracteres).', logradouro);
    }

    if (!isNumeroValido(numero.value)) {
      return alertErro('Número obrigatório e deve conter apenas dígitos.', numero);
    }

    if (!isUfValido(uf.value)) {
      return alertErro('UF inválido. Informe exatamente 2 letras maiúsculas (ex.: SP, RJ).', uf);
    }

    alert('Endereço cadastrado com sucesso');
    // Opcionalmente, poderia limpar o formulário: form.reset();
  });
})();
