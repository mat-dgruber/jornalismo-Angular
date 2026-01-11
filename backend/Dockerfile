FROM python:3.12-slim

# Isso "pega" o uv emprestado da imagem oficial e coloca no nosso container
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Copia apenas a "receita" das bibliotecas
COPY pyproject.toml /app/

RUN uv sync

ENV PATH="/app/.venv/bin:$PATH"

# Copia o restante do código fonte para dentro do container
COPY . /app/

# Gera os arquivos estáticos (necessário para o Whitenoise em produção)
RUN python manage.py collectstatic --noinput

# Comando padrão para manter o container rodando (vamos mudar isso no compose)
# Comando padrão para Cloud Run (lê a var PORT automaticamente)
CMD exec gunicorn config.wsgi:application --bind 0.0.0.0:$PORT