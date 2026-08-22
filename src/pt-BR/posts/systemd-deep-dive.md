---
title: 'Mergulho no systemd: escrevendo suas próprias unidades de serviço'
date: 2026-07-15
tags: [linux, systemd, devops]
description: Entendendo os arquivos de serviço do systemd e como escrever unidades personalizadas para suas aplicações.
---

## O que é o systemd?

O systemd é o sistema de init usado pela maioria das distribuições Linux modernas. Ele gerencia serviços, pontos de montagem, timers e muito mais.

## Anatomia de uma unidade de serviço

Um arquivo de unidade de serviço geralmente fica em `/etc/systemd/system/` e segue esta estrutura:

```ini
[Unit]
Description=Meu Serviço Personalizado
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/minha-app
Restart=on-failure
User=meuusuario

[Install]
WantedBy=multi-user.target
```

## Criando seu próprio serviço

Vamos criar um serviço que executa uma aplicação web em Python:

```ini
[Unit]
Description=Aplicação Web Flask
After=network.target postgresql.service
Wants=postgresql.service

[Service]
Type=simple
WorkingDirectory=/opt/minhaapp
Environment=PATH=/usr/bin:/usr/local/bin
Environment=FLASK_ENV=production
ExecStart=/usr/bin/python3 app.py
Restart=always
RestartSec=5
User=www-data

[Install]
WantedBy=multi-user.target
```

## Gerenciando serviços

```bash
# Recarregar os arquivos de unidade após mudanças
sudo systemctl daemon-reload

# Iniciar e habilitar na boot
sudo systemctl enable --now minha-app.service

# Visualizar logs
sudo journalctl -u minha-app.service -f
```

## Timers: substitutos do cron

Os timers do systemd são a alternativa moderna ao cron:

```ini
[Unit]
Description=Backup diário do banco de dados

[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target
```
