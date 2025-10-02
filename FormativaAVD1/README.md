# Formulário de Endereço (Formativa AVD1)

Implementação de um formulário HTML com validações em JavaScript (ES6+), usando eventos e regex com grupos de captura.

## Campos e regras
- CEP: obrigatório, máscara automática no formato 00000-000.
- Logradouro: obrigatório, mínimo de 5 caracteres.
- Número: obrigatório, somente dígitos.
- UF: obrigatório, aceita somente 2 letras maiúsculas (ex.: SP, RJ).
- Complemento: opcional.

O envio é controlado com `addEventListener('submit', ...)` e `preventDefault()`. Em caso de erro é exibido `alert()` específico. Se tudo válido, `alert('Endereço cadastrado com sucesso')`.

## Como usar
Abra o arquivo `endereco.html` no navegador. Digite os dados e teste as validações.

Arquivos principais:
- `endereco.html` – marcação do formulário e links de CSS/JS.
- `script.js` – máscaras e validações.
- `style.css` – estilo básico.

## Observações
- As máscaras acontecem em tempo real (CEP, UF e Número).
- Foram adicionados atributos `pattern`, `maxlength` e `inputmode` para melhorar a UX.