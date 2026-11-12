# Le Face — site institucional

Site da **Le Face**, clínica de odontologia e psicologia com atendimento humanizado.
É um site estático: HTML, CSS e JavaScript puros, sem build e sem dependências para instalar.

## Estrutura

```
Site Le Face/
├── index.html              página principal
├── 404.html                página de "não encontrado" (usada pela hospedagem)
├── robots.txt              orientação para buscadores
├── assets/
│   ├── css/styles.css      todos os estilos (cores e fontes no topo, em :root)
│   ├── js/main.js          todas as interações (textos da seção Explore em EXP_DATA)
│   └── img/                imagens do site (veja o guia abaixo)
├── _referencias/           material de apoio (design system Hanzo), NÃO faz parte do site
└── README.md               este guia
```

## Ver o site no computador

- **Jeito rápido:** dê dois cliques no `index.html`.
- **Igual ao site publicado:** na pasta do projeto, rode `python -m http.server 8000` e abra <http://localhost:8000>.

## Guia de imagens

Todas as imagens ficam em `assets/img/`. Para trocar uma foto, salve o arquivo novo **com o mesmo nome e no mesmo lugar**: ela aparece sozinha.
Se o arquivo não existir, o site mostra um quadro listrado com o nome esperado.

| Arquivo | Onde aparece | Formato recomendado |
|---|---|---|
| `logo.png` | menu e rodapé | PNG com fundo transparente |
| `logo-face.png` | losango no título do topo | PNG com fundo transparente |
| `favicon.png` | ícone da aba do navegador | PNG quadrado, 128×128 |
| `apple-touch-icon.png` | ícone ao salvar o site na tela do celular | PNG 180×180, fundo branco |
| `og-image.jpg` | prévia ao compartilhar o link | JPG 1200×630 |
| `sobre/guilherme-sudati.jpg` | seção "Sobre" (foto do fundador) | vertical, cerca de 800×1340 |
| `equipe/guilherme.jpg` | Equipe: Dr. Guilherme Sudati | vertical, cerca de 800×1000 |
| `equipe/isabela.jpg` | Equipe: Dra. Isabela Cristina Signori | vertical, cerca de 800×1000 |
| `equipe/lais.jpg` | Equipe: Laís Caetano Sudati | vertical, cerca de 800×1000 |
| `equipe/nathalia.jpg` | Equipe: Dra. Nathalia Rampanelli | vertical, cerca de 800×1000 |
| `espaco/01.jpg` … `espaco/09.jpg` | galeria "Nosso espaço" (**ainda sem fotos**) | vertical 4:5, cerca de 800×1000 |

Dicas:
- Exporte as fotos em JPG com qualidade em torno de 80–85%. Fotos com qualidade máxima deixam o site lento no celular sem ganho visível.
- Para adicionar um profissional, duplique um bloco `<article class="member">` na seção `#equipe` do `index.html`.
- No `index.html`, procure por `📷 FOTO` e `🖼️ LOGO` para achar cada ponto.

## Onde editar cada coisa

| O quê | Onde |
|---|---|
| Textos das seções, equipe, depoimentos, dúvidas, rodapé | `index.html` |
| Cards de importância, mito ou verdade e quiz (seção Explore) | `assets/js/main.js`, objeto `EXP_DATA` |
| Cores, fontes, sombras e espaçamentos | `assets/css/styles.css`, bloco `:root` no topo |
| Número do WhatsApp | `index.html`: substitua **todas** as ocorrências de `5500000000000` (são 7) pelo número no formato 55 + DDD + número, sem espaços |

## Antes de publicar

Estes dados ainda são de exemplo:

- [ ] Número do WhatsApp (`5500000000000`) e o texto `(00) 00000-0000` no rodapé
- [ ] Telefone `(00) 0000-0000` e o link `tel:+550000000000`
- [ ] Endereço "Rua Exemplo, 123 — Sala 45 …" no rodapé
- [ ] "Responsável técnico: Nome — CRO-UF 00000" no rodapé
- [ ] Links do Instagram, Facebook e TikTok (hoje apontam para `#`)
- [ ] E-mail `contato@leface.com.br` (confirme se existe)
- [ ] Números da seção "Sobre" (12+ anos, 18 especialistas, 4,9, 3,2k) e "18 especialistas" na seção Equipe
- [ ] Nota "4,9 · 320 avaliações" e os depoimentos (são fictícios: troque por depoimentos reais, com autorização, ou remova)
- [ ] Faixa "Agenda aberta — novembro e dezembro" no topo
- [ ] Fotos da galeria "Nosso espaço" (`assets/img/espaco/01.jpg` … `09.jpg`)
- [ ] Revisão dos textos de saúde da seção Explore pelos profissionais da clínica

## Publicar

Publique **somente** estes itens: `index.html`, `404.html`, `robots.txt` e a pasta `assets/`.
As pastas `_referencias/` e `.claude/` são material de trabalho e não devem ir para o ar.

- **GitHub Pages:** no repositório, *Settings → Pages → Branch: `main` / pasta `/ (root)`*. O GitHub Pages já ignora pastas que começam com `_` ou `.`.
- **Vercel:** importe o repositório, sem comando de build. O arquivo `.vercelignore` já deixa `_referencias/` e `.claude/` de fora.
- **Netlify:** use o Netlify Drop (arrastar e soltar) com uma pasta que contenha só os itens acima.
- **Hospedagem comum (Hostinger, HostGator, Locaweb…):** envie os itens acima para a pasta `public_html`.

Depois de publicar, com o endereço definitivo em mãos:

1. No `<head>` do `index.html`, troque `SEU-DOMINIO` pelo endereço do site e tire as 3 linhas (`canonical`, `og:url` e `og:image`) de dentro do comentário. É isso que faz a imagem de prévia aparecer quando o link é compartilhado no WhatsApp.
2. Teste a prévia em <https://developers.facebook.com/tools/debug/>.
