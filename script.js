// script.js (ES6+)
const form = document.getElementById('cadastroForm');
const campos = {
  nome: document.getElementById('nome'),
  email: document.getElementById('email'),
  telefone: document.getElementById('telefone'),
  cpf: document.getElementById('cpf'),
  nascimento: document.getElementById('nascimento'),
};
const erros = {
  nome: document.getElementById('erro-nome'),
  email: document.getElementById('erro-email'),
  telefone: document.getElementById('erro-telefone'),
  cpf: document.getElementById('erro-cpf'),
  nascimento: document.getElementById('erro-nascimento'),
};
const sucesso = document.getElementById('sucesso');

// Utilidades de máscara
const apenasNumeros = (valor) => valor.replace(/\D/g, '');

const aplicarMascaraTelefone = (valor) => {
  const v = apenasNumeros(valor).slice(0, 11);
  if (v.length <= 10) {
    // formato (99) 9999-9999
    return v
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }
  // formato (99) 99999-9999
  return v
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
};

const aplicarMascaraCPF = (valor) => {
  const v = apenasNumeros(valor).slice(0, 11);
  return v
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

const aplicarMascaraData = (valor) => {
  const v = apenasNumeros(valor).slice(0, 8);
  return v
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d)/, '$1/$2');
};

// Validações
const validarNome = (valor) => valor.trim().length >= 3;
const validarEmail = (valor) => /.+@.+/.test(valor.trim());

// Algoritmo CPF
// Referência: cálculo de dígitos verificadores padrão
const ehCPFValido = (cpfStr) => {
  const cpf = apenasNumeros(cpfStr);
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false; // repetições

  const calcDV = (base) => {
    const soma = base
      .split('')
      .map(Number)
      .reduce((acc, num, idx) => acc + num * (base.length + 1 - idx), 0);
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const dv1 = calcDV(cpf.slice(0, 9));
  const dv2 = calcDV(cpf.slice(0, 9) + dv1);
  return cpf.endsWith(`${dv1}${dv2}`);
};

const calcularIdade = (dataStr) => {
  const [dia, mes, ano] = dataStr.split('/').map(Number);
  if (!dia || !mes || !ano) return null;
  const nascimento = new Date(ano, mes - 1, dia);
  if (
    Number.isNaN(nascimento.getTime()) ||
    nascimento.getDate() !== dia ||
    nascimento.getMonth() !== mes - 1 ||
    nascimento.getFullYear() !== ano
  ) {
    return null; // data inválida (ex: 31/02)
  }
  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade;
};

// Exibição de erro/sucesso por campo
const setErro = (campo, mensagem) => {
  campo.classList.remove('valid');
  campo.classList.add('invalid');
  erros[campo.id].textContent = mensagem;
};

const setOk = (campo) => {
  campo.classList.remove('invalid');
  campo.classList.add('valid');
  erros[campo.id].textContent = '';
};

// Listeners de máscara
campos.telefone.addEventListener('input', (e) => {
  const pos = e.target.selectionStart;
  const antes = e.target.value;
  e.target.value = aplicarMascaraTelefone(e.target.value);
  // melhor esforço de caret simples
  if (document.activeElement === e.target && pos) {
    const diff = e.target.value.length - antes.length;
    e.target.setSelectionRange(pos + Math.max(diff, 0), pos + Math.max(diff, 0));
  }
});

campos.cpf.addEventListener('input', (e) => {
  const pos = e.target.selectionStart;
  const antes = e.target.value;
  e.target.value = aplicarMascaraCPF(e.target.value);
  if (document.activeElement === e.target && pos) {
    const diff = e.target.value.length - antes.length;
    e.target.setSelectionRange(pos + Math.max(diff, 0), pos + Math.max(diff, 0));
  }
});

campos.nascimento.addEventListener('input', (e) => {
  const pos = e.target.selectionStart;
  const antes = e.target.value;
  e.target.value = aplicarMascaraData(e.target.value);
  if (document.activeElement === e.target && pos) {
    const diff = e.target.value.length - antes.length;
    e.target.setSelectionRange(pos + Math.max(diff, 0), pos + Math.max(diff, 0));
  }
});

// Validação em tempo real
campos.nome.addEventListener('blur', () => {
  validarNome(campos.nome.value) ? setOk(campos.nome) : setErro(campos.nome, 'Informe pelo menos 3 caracteres.');
});
campos.email.addEventListener('blur', () => {
  validarEmail(campos.email.value) ? setOk(campos.email) : setErro(campos.email, 'Email deve conter @ e domínio.');
});
campos.telefone.addEventListener('blur', () => {
  const limpo = apenasNumeros(campos.telefone.value);
  limpo.length >= 10 ? setOk(campos.telefone) : setErro(campos.telefone, 'Telefone incompleto.');
});
campos.cpf.addEventListener('blur', () => {
  ehCPFValido(campos.cpf.value) ? setOk(campos.cpf) : setErro(campos.cpf, 'CPF inválido.');
});
campos.nascimento.addEventListener('blur', () => {
  const idade = calcularIdade(campos.nascimento.value);
  if (idade === null) return setErro(campos.nascimento, 'Data inválida.');
  idade >= 18 ? setOk(campos.nascimento) : setErro(campos.nascimento, 'É necessário ser maior de 18 anos.');
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  sucesso.textContent = '';

  // Dispara validação de todos
  campos.nome.dispatchEvent(new Event('blur'));
  campos.email.dispatchEvent(new Event('blur'));
  campos.telefone.dispatchEvent(new Event('blur'));
  campos.cpf.dispatchEvent(new Event('blur'));
  campos.nascimento.dispatchEvent(new Event('blur'));

  const algumInvalido = Object.values(campos).some((c) => c.classList.contains('invalid') || !c.value.trim());
  if (algumInvalido) {
    sucesso.textContent = '';
    return;
  }

  sucesso.textContent = 'Formulário válido!';
  // Aqui você poderia enviar via fetch/AJAX.
});
