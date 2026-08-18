#!/usr/bin/env python3
import os
import re
import sys

def check_file_for_secrets(filepath):
    """Verifica se há segredos expostos diretamente em strings."""
    findings = []
    secret_patterns = {
        'API Key': r'(?i)(api_key|apikey|api-key)\s*=\s*[\'"][A-Za-z0-9_\-]{15,}[\'"]',
        'Firebase DB URL': r'https:\/\/[a-z0-9\-]+\.firebaseio\.com',
        'Django Secret Key': r"SECRET_KEY\s*=\s*['\"][^'\"]{30,}['\"]"
    }

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            for line_no, line in enumerate(f, 1):
                for key_type, pattern in secret_patterns.items():
                    if re.search(pattern, line):
                        # Ignorar fallbacks seguros ou strings conhecidas de dev
                        if 'django-insecure-dev-key' in line or 'os.environ' in line:
                            continue
                        findings.append({
                            'id': 'A02',
                            'severity': 'HIGH' if key_type != 'Firebase DB URL' else 'MEDIUM',
                            'category': 'Cryptographic Failures',
                            'file': filepath,
                            'line': line_no,
                            'desc': f'Vulnerabilidade potencial: {key_type} exposta diretamente no código.'
                        })
    except Exception as e:
        pass
    return findings

def check_django_settings(filepath):
    """Audita o arquivo de configurações do Django."""
    findings = []
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

            # 1. Debug ligado de forma inadequada
            if 'DEBUG = True' in content and 'os.environ' not in content:
                findings.append({
                    'id': 'A05',
                    'severity': 'HIGH',
                    'category': 'Security Misconfiguration',
                    'file': filepath,
                    'line': 'N/A',
                    'desc': 'DEBUG definido estaticamente como True sem verificar o ambiente.'
                })

            # 2. CORS extremamente permissivo
            if 'CORS_ALLOW_ALL_ORIGINS = True' in content:
                findings.append({
                    'id': 'A05',
                    'severity': 'HIGH',
                    'category': 'Security Misconfiguration',
                    'file': filepath,
                    'line': 'N/A',
                    'desc': 'CORS_ALLOW_ALL_ORIGINS configurado como True. Permite que qualquer origem acesse a API.'
                })

            # 3. Falta de cookies seguros para produção
            if 'SESSION_COOKIE_SECURE' not in content:
                findings.append({
                    'id': 'A05',
                    'severity': 'MEDIUM',
                    'category': 'Security Misconfiguration',
                    'file': filepath,
                    'line': 'N/A',
                    'desc': 'SESSION_COOKIE_SECURE não definido. Pode expor cookies de sessão em tráfego HTTP comum.'
                })

            if 'CSRF_COOKIE_SECURE' not in content:
                findings.append({
                    'id': 'A05',
                    'severity': 'MEDIUM',
                    'category': 'Security Misconfiguration',
                    'file': filepath,
                    'line': 'N/A',
                    'desc': 'CSRF_COOKIE_SECURE não definido. Pode expor cookies de proteção CSRF.'
                })
    except Exception as e:
        pass
    return findings

def check_python_code_rules(filepath):
    """Verifica código Python genérico em busca de SQL Injection, IDOR ou má práticas."""
    findings = []
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            for line_no, line in enumerate(f, 1):
                # 1. SQL Injection potencial por f-string em raw query
                if re.search(r'\.(execute|raw)\(\s*f[\'"]', line):
                    findings.append({
                        'id': 'A03',
                        'severity': 'CRITICAL',
                        'category': 'Injection',
                        'file': filepath,
                        'line': line_no,
                        'desc': 'Uso de f-string em consulta raw SQL (execute ou raw). Risco gravíssimo de SQL Injection. Use bind parameters.'
                    })

                # 2. SQL Injection por concatenação simples
                elif re.search(r'\.(execute|raw)\(\s*[\'"].*%\s*\w+', line) or re.search(r'\.(execute|raw)\(\s*[\'"].*\+\s*\w+', line):
                    findings.append({
                        'id': 'A03',
                        'severity': 'CRITICAL',
                        'category': 'Injection',
                        'file': filepath,
                        'line': line_no,
                        'desc': 'Uso de concatenação ou interpolação com % em consulta raw SQL. Use bind parameters.'
                    })

                # 3. Exposição de dados de usuários sem autenticação
                if 'User.objects.all()' in line and 'views.py' in filepath:
                    with open(filepath, 'r', encoding='utf-8') as f_all:
                        file_content = f_all.read()
                    if 'IsAuthenticated' not in file_content and 'IsAdminUser' not in file_content:
                        findings.append({
                            'id': 'A01',
                            'severity': 'CRITICAL',
                            'category': 'Broken Access Control',
                            'file': filepath,
                            'line': line_no,
                            'desc': 'Exposição direta da tabela de usuários (User.objects) sem verificação de permissão (IsAuthenticated).'
                        })
    except Exception as e:
        pass
    return findings

def run_backend_audit():
    print("🔍 Executando AST-SAST do Backend (Python/Django)...")
    all_findings = []

    # Percorrer os arquivos python do projeto, ignorando pastas de ambiente virtual e testes
    for root, dirs, files in os.walk('.'):
        # Ignorar ambientes virtuais, cache e bibliotecas instaladas
        if any(ignored in root for ignored in ['.venv', 'venv', 'env', '__pycache__', '.git', 'site-packages']):
            continue

        for file in files:
            if file.endswith('.py'):
                filepath = os.path.join(root, file)

                # Regra de configurações do Django
                if 'settings.py' in file:
                    all_findings.extend(check_django_settings(filepath))

                # Regras gerais de vazamento de segredos
                all_findings.extend(check_file_for_secrets(filepath))

                # Regras de injeção de código e boas práticas
                all_findings.extend(check_python_code_rules(filepath))

    print(f"✅ Análise concluída. Encontrados {len(all_findings)} vulnerabilidades em potencial.\n")

    if all_findings:
        # Formatar a saída
        for f in all_findings:
            print(f"| {f['id']} | {f['severity']:<8} | {f['category']:<25} | {f['file']}:{f['line']:<4} | {f['desc']}")
        sys.exit(1)
    else:
        print("🎉 Nenhum problema grave detectado no AST-SAST do Backend!")
        sys.exit(0)

if __name__ == '__main__':
    run_backend_audit()
