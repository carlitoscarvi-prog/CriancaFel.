# CriançaFel — protótipo corrigido

Protótipo web demonstrativo em português (Portugal) para divulgar eventos infantis e familiares e experimentar reservas gratuitas.

## O que já funciona neste protótipo

- Lista de eventos de demonstração.
- Pesquisa por texto e filtros por localidade e idade.
- Formulário de reserva com escolha do número de lugares.
- Controlo de lotação dentro da sessão atual do navegador.
- Área de gestão demonstrativa para adicionar eventos pendentes, aprovar ou rejeitar eventos; o formulário valida os campos e apresenta confirmação.
- Lista local das reservas de teste.
- Layout adaptável a telemóvel e computador.
- Ficheiro de manifesto e service worker para experimentar instalação/PWA em alojamento HTTPS.

## Limitações importantes

**Esta versão não está pronta para uso público nem para reservas reais.**

- Os eventos e as reservas vivem apenas na memória da página. Ao recarregar, os dados de teste voltam ao estado inicial.
- Não existe autenticação de utilizadores, perfis reais, base de dados, emails ou notificações.
- O botão “Área de gestão” não é protegido por palavra-passe. É apenas uma demonstração.
- Não introduza dados pessoais reais.
- O service worker/PWA só funciona de forma adequada quando servido por `localhost` ou HTTPS; abrir `index.html` diretamente não ativa a instalação.
- Os eventos e datas são exemplos fictícios. Confirme sempre datas, locais, idades e condições antes de publicar qualquer informação real.

## Como abrir localmente

### Opção simples
1. Extraia o ZIP para uma pasta.
2. Abra `index.html` num navegador moderno.
3. Experimente pesquisar, filtrar, reservar e abrir “Área de gestão”.

A opção simples serve para testar a interface. A instalação PWA não fica ativa ao abrir o ficheiro diretamente.

### Opção para testar PWA no computador
É necessário ter Python instalado. Abra o terminal na pasta do projeto e execute:

```bash
python -m http.server 8000
```

Depois abra `http://localhost:8000` no navegador. Para testar num telemóvel na mesma rede, use o endereço IP local do computador, mas a instalação PWA em dispositivos móveis exige normalmente HTTPS; para um teste mais próximo da realidade, publique temporariamente num serviço de alojamento HTTPS.

## Próximas etapas para uma versão real

1. Criar projeto Supabase e configurar tabelas para `profiles`, `organizers`, `events` e `bookings`.
2. Implementar autenticação segura para administrador e organizadores.
3. Configurar Row Level Security (RLS) e políticas de acesso. Nunca colocar uma chave `service_role` no código do navegador.
4. Criar reserva atómica no servidor/base de dados para evitar excesso de lotação quando duas pessoas reservam ao mesmo tempo.
5. Enviar confirmação por email e implementar cancelamentos.
6. Definir política de privacidade, termos, regras de cancelamento e tratamento de dados de menores (as reservas devem ser feitas por um adulto responsável).
7. Testar segurança, acessibilidade, dispositivos e recuperação de erros.
8. Só depois considerar publicação nas lojas Android e iOS.

## Ficheiros

- `index.html`: estrutura dos ecrãs.
- `styles.css`: identidade visual responsiva.
- `app.js`: dados de demonstração e interações.
- `manifest.webmanifest`: metadados da PWA.
- `sw.js`: cache básica para funcionamento offline do conteúdo estático.
- `icon.svg`: ícone provisório.


## Nota sobre a correção do formulário

Esta versão reforça a validação do formulário de eventos, mostra uma mensagem de confirmação e desloca a página para o evento adicionado à lista de aprovação. A atualização da versão de cache ajuda a evitar que o navegador reutilize o JavaScript antigo. Se já tiver a versão anterior aberta, feche-a e volte a abrir a nova pasta extraída.
