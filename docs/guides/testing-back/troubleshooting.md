# 🔧 Troubleshooting e Resolução de Problemas em Testes — Backend (Django REST)

## 🚨 Problemas Comuns e Soluções

---

### **1. Erro de Migrações ou Tabela Inexistente no Banco de Teste**

#### **Sintoma**:
`django.db.utils.OperationalError: no such table: blog_post` durante a execução de `python manage.py test`.

#### **Causa**:
Existem migrações pendentes em algum dos apps que não foram geradas antes da execução dos testes.

#### **Solução**:
Execute `makemigrations` e depois rode os testes novamente:
```bash
cd backend
python manage.py makemigrations
python manage.py test
```

---

### **2. Erro de Autenticação em Endpoints Protegidos**

#### **Sintoma**:
O teste retorna `401 Unauthorized` ou `403 Forbidden` quando deveria permitir a criação de um recurso.

#### **Causa**:
O cliente de teste não foi autenticado antes de disparar a requisição de escrita.

#### **Solução**:
Crie um usuário administrador no `setUp` e use `self.client.force_authenticate(user=self.admin_user)`:
```python
from django.contrib.auth.models import User

def setUp(self):
    self.admin = User.objects.create_superuser('admin', 'admin@mariaizabela.com.br', 'senha123')
    self.client.force_authenticate(user=self.admin)
```

---

### **3. Conflito de `DJANGO_SETTINGS_MODULE`**

#### **Sintoma**:
`django.core.exceptions.ImproperlyConfigured: Requested setting INSTALLED_APPS, but settings are not configured.`

#### **Solução**:
Garanta que a variável `DJANGO_SETTINGS_MODULE` aponte para `config.settings`:
```bash
export DJANGO_SETTINGS_MODULE=config.settings
```
