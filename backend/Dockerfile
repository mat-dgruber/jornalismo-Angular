FROM python:3.14-slim

# Isso "pega" o uv emprestado da imagem oficial e coloca no nosso container
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Copia apenas a "receita" das bibliotecas
COPY pyproject.toml uv.lock /app/

RUN uv sync

ENV PATH="/app/.venv/bin:$PATH"

# Comando padrão para manter o container rodando (vamos mudar isso no compose)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]