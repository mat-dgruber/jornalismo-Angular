FROM python:3.12-slim

# Isso "pega" o uv emprestado da imagem oficial e coloca no nosso container
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Copia apenas a "receita" das bibliotecas primeiro para cache de camada
COPY pyproject.toml /app/
RUN uv sync

# Copia todo o código-fonte agora
COPY . /app/

ENV PATH="/app/.venv/bin:$PATH"

# Comando padrão para produção (gunicorn)
CMD ["sh", "-c", "gunicorn config.wsgi:application --bind 0.0.0.0:8080 --workers 1 --threads 8 --timeout 0 --access-log - --error-log -"]