---
title: 'My Neovim Workflow for 2026'
date: 2026-07-18
tags: [neovim, workflow, dev]
description: How I configured Neovim to replace my entire IDE setup with a terminal-based workflow.
---

## Why Neovim?

After years of using VS Code and JetBrains IDEs, I made the full switch to Neovim in 2024. Here's my current setup.

## Plugin Management

I use `lazy.nvim` for plugin management:

```lua
local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
vim.opt.rtp:prepend(lazypath)

require("lazy").setup({
  { "nvim-treesitter/nvim-treesitter", build = ":TSUpdate" },
  { "neovim/nvim-lspconfig" },
  { "hrsh7th/nvim-cmp" },
})
```

## Key Mappings

My leader key is `<Space>`. Here are my most-used mappings:

| Mapping | Action |
|---------|--------|
| `<Space>ff` | Find files |
| `<Space>fg` | Live grep |
| `<Space>fb` | Buffer list |
| `<Space>gd` | Go to definition |

## LSP Configuration

Native LSP with `mason.nvim` for installing language servers:

```lua
require("mason").setup()
require("mason-lspconfig").setup({
  ensure_installed = { "ts_ls", "rust_analyzer", "pyright" }
})
```

## Terminal Integration

I keep a terminal buffer in a toggleable split using `toggleterm.nvim`. This lets me run tests and builds without leaving Neovim.

[EOF]
