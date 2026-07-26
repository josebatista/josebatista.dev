---
title: 'Systemd Deep Dive: Writing Your Own Service Units'
date: 2026-07-15
tags: [linux, systemd, devops]
description: Understanding systemd service files and how to write custom units for your applications.
---

## What is systemd?

systemd is the init system used by most modern Linux distributions. It manages services, mounts, timers, and more.

## Anatomy of a Service Unit

A service unit file typically lives in `/etc/systemd/system/` and follows this structure:

```ini
[Unit]
Description=My Custom Service
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/my-app
Restart=on-failure
User=myuser

[Install]
WantedBy=multi-user.target
```

## Creating Your Own Service

Let's create a service that runs a Python web application:

```ini
[Unit]
Description=Flask Web Application
After=network.target postgresql.service
Wants=postgresql.service

[Service]
Type=simple
WorkingDirectory=/opt/myapp
Environment=PATH=/usr/bin:/usr/local/bin
Environment=FLASK_ENV=production
ExecStart=/usr/bin/python3 app.py
Restart=always
RestartSec=5
User=www-data

[Install]
WantedBy=multi-user.target
```

## Managing Services

```bash
# Reload unit files after changes
sudo systemctl daemon-reload

# Start and enable at boot
sudo systemctl enable --now my-app.service

# View logs
sudo journalctl -u my-app.service -f
```

## Timers: Cron Replacements

systemd timers are the modern alternative to cron:

```ini
[Unit]
Description=Daily database backup

[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target
```

[EOF]
