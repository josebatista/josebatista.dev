---
title: 'Meu fluxo de trabalho com Neovim em 2026'
date: 2026-07-18
tags: [neovim, workflow, dev]
description: Como configurei o Neovim para substituir toda a minha IDE por um fluxo de trabalho baseado no terminal.
---

## Por que Neovim?

Depois de anos usando VS Code e as IDEs da JetBrains, fiz a mudança completa para o Neovim em 2024. Veja minha configuração atual.

## Gerenciamento de plugins

Eu uso o `lazy.nvim` para gerenciar plugins:

```lua
local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
vim.opt.rtp:prepend(lazypath)

require("lazy").setup({
  { "nvim-treesitter/nvim-treesitter", build = ":TSUpdate" },
  { "neovim/nvim-lspconfig" },
  { "hrsh7th/nvim-cmp" },
})
```

## Mapeamentos de teclas

Minha tecla leader é `<Space>`. Veja meus mapeamentos mais usados:

| Mapeamento | Ação |
|---------|--------|
| `<Space>ff` | Buscar arquivos |
| `<Space>fg` | Grep ao vivo |
| `<Space>fb` | Lista de buffers |
| `<Space>gd` | Ir para definição |

## Configuração do LSP

LSP nativo com `mason.nvim` para instalar servidores de linguagem:

```lua
require("mason").setup()
require("mason-lspconfig").setup({
  ensure_installed = { "ts_ls", "rust_analyzer", "pyright" }
})
```

## Integração com terminal

Mantenho um buffer de terminal em um split alternável usando o `toggleterm.nvim`. Isso me permite rodar testes e compilações sem sair do Neovim.
