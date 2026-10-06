# Portal Engelec — Apresentação comercial web

Apresentação 16:9 (16 slides) da ROC7 Soluções Digitais para a Engelec, em formato de
demonstração guiada: acompanha o mesmo atendimento (SOL-2026-0087 → ORC-2026-0041 →
ENG-2026-0047 → QGBT-01) do formulário do site até a documentação consultada pelo QR.
Os mockups do Portal são **simulações conceituais** em HTML/CSS. Não há backend, banco
de dados, autenticação nem nenhuma funcionalidade real.

## Como apresentar

1. Abra `index.html` com duplo clique. Use Chrome ou Edge atualizados.
2. Pressione **F** para entrar em tela cheia (Esc sai).

Funciona **sem internet**: fontes, imagens e scripts estão nesta pasta.
Para levar a outro computador, copie a pasta `apresentacao/` inteira.

| Ação | Teclas |
|---|---|
| Próximo slide | → · ↓ · Espaço · Enter · PageDown |
| Slide anterior | ← · ↑ · Backspace · PageUp |
| Primeiro / último | Home / End |
| Tela cheia | F |
| Ir direto a um slide | `index.html#/9` |

Com o mouse, os controles (anterior, próximo, tela cheia) aparecem no canto inferior
direito e somem depois de 2,5 s. No celular ou tablet, deslize para os lados.

O palco é fixo em 1920×1080 e se ajusta a qualquer tela, com tarjas quando a proporção
for diferente.

## Exportar para PDF

No Chrome: **Ctrl+P** → Destino **Salvar como PDF** → Margens **Nenhuma** → marque
**Gráficos de plano de fundo**. Resultado: páginas 1920×1080, com todo o conteúdo
revelado (as animações são desligadas na impressão). São 16 páginas.

Para revisar sem animações na tela: `index.html?static`.

## Estrutura

```
index.html          16 slides + modelos compartilhados dos mockups
css/tokens.css      cores, fontes (@font-face local), sombras
css/base.css        palco 16:9, moldura dos slides, tipografia, controles, animações
css/components.css  componentes de apresentação
css/mockups.css     design system único dos mockups do Portal
css/slides.css      composição de cada slide
css/print.css       exportação para PDF
js/deck.js          navegação, escala, moldura, tela cheia, modelos dos mockups
assets/marca/       logos Engelec e ROC7 (cópias intactas dos originais)
assets/img/         fotos reais (capa; foto do painel nos slides 10, 12 e 14) e imagem
                    conceitual do QR (slide 13) — cópias recortadas/otimizadas
assets/fonts/       Space Grotesk, IBM Plex Sans e IBM Plex Mono (WOFF2) + licenças OFL
```

A barra lateral, o cabeçalho e a barra do navegador dos mockups saem de um único modelo
(`<template>` no `index.html`, montados por `js/deck.js`). Isso garante o mesmo sistema
visual em todas as telas.

## Animações

Cada slide de demonstração entra em etapas automáticas (tela → destaque → clique →
resultado), em cerca de 2 a 4 segundos. A seta → sempre avança para o próximo slide.
Quem usa "reduzir movimento" no sistema vê tudo estático.

## Fontes

As fontes estão licenciadas sob a SIL Open Font License (textos em `assets/fonts/OFL-*.txt`).
Não distribua os arquivos de fonte fora deste projeto ou da entrega.
