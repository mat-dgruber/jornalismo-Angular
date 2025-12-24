# Jornalismo - Maria Izabela

Este projeto é um site pessoal e blog para portfólio de jornalismo, desenvolvido com **Angular** no frontend e **Django** no backend.

## Estrutura do Projeto

- **frontend/**: Aplicação Angular (v20+).
- **backend/**: API REST desenvolvida com Django e Django REST Framework.

## Pré-requisitos

- Node.js e NPM
- Python 3.10+
- Angular CLI

## Como Rodar o Projeto

### 1. Backend (Django)

Navegue até a pasta `backend` e configure o ambiente virtual:

```bash
cd backend
# Criar ambiente virtual
python -m venv .venv
# Ativar (Windows)
.venv\Scripts\activate
# Ativar (Linux/Mac)
source .venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Rodar migrações
python manage.py migrate

# Iniciar servidor
python manage.py runserver
```

O backend rodará em `http://127.0.0.1:8000`.

### 2. Frontend (Angular)

Em outro terminal, navegue até a pasta `frontend`:

```bash
cd frontend
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
ng serve
```

O frontend rodará em `http://localhost:4200`.

## Funcionalidades

- **Home**: Apresentação e destaques.
- **Blog**: Listagem de notícias e artigos.
- **Criar Post**: Área para criar novas notícias (com upload de imagens).
- **Outras Seções**: Artigos, Materiais, Projetos, Contato.

## Rodando com Docker

Se preferir, você pode rodar o **Backend (Django)** e o **Banco de Dados (PostgreSQL)** via Docker. O frontend ainda deve ser rodado localmente (por enquanto).


1. **Subir os serviços:**

    ```bash
    docker-compose up -d --build
    ```

2. **Rodar as migrações (apenas na primeira vez):**

    ```bash
    docker-compose exec web python manage.py migrate
    ```

3. **Criar superusuário (opcional):**

    ```bash
    docker-compose exec web python manage.py createsuperuser
    ```

4. **Iniciar o Frontend:**
    Siga os passos da seção [Frontend](#2-frontend-angular) acima (`ng serve`).

