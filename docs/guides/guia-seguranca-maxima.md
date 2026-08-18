---
title: Guia de Segurança Máxima, Conformidade e Governança Zero-Trust (jornalismo-Angular)
description: Manual técnico de segurança para a plataforma Maria Izabela (jornalismo-Angular), consolidando proteção de rotas administrativas, sanitização XSS no Quill Editor, autenticação Firebase, cabeçalhos de proteção e integridade de uploads.
version: 2.0.0
date: 2026-08-18
---

# 🛡️ Guia de Segurança Máxima, Conformidade e Governança Zero-Trust

Este documento atua como o manual técnico definitivo de segurança, privacidade e governança do projeto **jornalismo-Angular** (Portal Editorial e Portfólio de Maria Izabela).

---

## 🏛️ 1. Princípios de Segurança e Isolamento

### A. Autenticação Administrativa e Controle de Acesso (RBAC)
- **Leitura Pública vs. Escrita Restrita**: Todas as rotas de consulta (`GET /api/blog/`, `GET /api/artigos/`, `GET /api/projetos/`, `GET /api/materiais/`) são de leitura pública com cache HTTP.
- **Operações Críticas**: Todas as operações de criação, edição e exclusão (`POST`, `PUT`, `PATCH`, `DELETE`) em `/admin/` ou via API exigem autenticação administrativa validada no backend Django.

```python
# backend/config/permissions.py
from rest_framework import permissions

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Permite leitura pública (GET, HEAD, OPTIONS) para qualquer cliente,
    mas exige autenticação de administrador para escrita (POST, PUT, DELETE).
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff
```

---

## 🛡️ 2. Proteção Frontend & Sanitização de Conteúdo (Anti-XSS)

### A. Sanitização no Rich Text Editor (Quill / ngx-quill)
- O portal permite a redação de matérias jornalísticas e posts com formatação rica.
- Todo conteúdo HTML antes de ser renderizado deve passar pelo `DomSanitizer` do Angular ou renderização segura para evitar injeção de scripts arbitrários (`<script>`, `onerror`, `javascript:`).

### B. Cabeçalhos HTTP de Proteção no Firebase Hosting
Configurados compulsoriamente no `firebase.json`:
- **`Strict-Transport-Security`**: Força HTTPS contínuo (`max-age=31536000; includeSubDomains; preload`).
- **`X-Content-Type-Options: nosniff`**: Impede que navegadores adivinhem tipos MIME.
- **`X-Frame-Options: DENY`**: Bloqueia ataques de Clickjacking em iframes externos.
- **`Referrer-Policy: strict-origin-when-cross-origin`**: Protege a integridade de dados de origem.

---

## 🔐 3. Gestão de Segredos e Variáveis de Ambiente

- **Proibição de Segredos no Git**: Nenhuma chave de API de produção, credencial do Firebase Admin SDK ou `SECRET_KEY` do Django deve ser versionada no repositório.
- **Hook `protect-secrets.sh`**: Bloqueia tentativas de leitura ou modificação de arquivos `.env` e arquivos de credenciais.

---

## 📁 4. Validação e Segurança de Uploads de Mídia

- **Formatos Permitidos**: Uploads de capas de artigos e fotos de perfil são restritos a formatos de imagem web seguros (`.webp`, `.png`, `.jpg`, `.jpeg`, `.svg`).
- **Validação de Tamanho e MIME Type**: O backend valida o cabeçalho real do arquivo e limita o payload de upload a 5MB, prevenindo DoS e execução de arquivos arbitrários.
