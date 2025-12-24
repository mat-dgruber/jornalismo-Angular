# Backend - API Jornalismo

Este é o backend do projeto, construído com **Django** e **Django REST Framework**.

## Configuração

1.  **Crie um ambiente virtual:**
    ```bash
    python -m venv .venv
    ```

2.  **Ative o ambiente:**
    *   Windows: `.venv\Scripts\activate`
    *   Linux/Mac: `source .venv/bin/activate`

3.  **Instale as dependências:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Execute as migrações do banco de dados:**
    ```bash
    python manage.py migrate
    ```

5.  **Crie um superusuário (opcional, para acessar /admin):**
    ```bash
    python manage.py createsuperuser
    ```

6.  **Inicie o servidor:**
    ```bash
    python manage.py runserver
    ```

## Endpoints Principais

- `/admin/`: Painel administrativo do Django.
- `/api/posts/`: Listagem e criação de posts.
- `/media/`: Arquivos de mídia (imagens de upload).

## Tecnologias

- Django
- Django REST Framework
- Pillow (para processamento de imagens)
- django-cors-headers (para permitir requisições do Angular)

## Rodando via Docker

Na raiz do projeto (um nível acima deste), execute:

```bash
docker-compose up -d
```
```bash
docker-compose up -d --build
```
Isso iniciará o Django e o PostgreSQL.

**Para rodar as migrações (necessário na primeira vez):**

```bash
docker-compose exec web python manage.py migrate
```

**Para criar um superusuário:**

```bash
docker-compose exec web python manage.py createsuperuser
```

