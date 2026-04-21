FROM python:3.12-slim

# Isso "pega" o uv emprestado da imagem oficial e coloca no nosso container
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Instala as dependências primeiro para aproveitar o cache do Docker
COPY pyproject.toml uv.lock* /app/
RUN uv sync --no-install-project

# Copia todo o código-fonte agora e finaliza a instalação
COPY . /app/
RUN uv sync

ENV PATH="/app/.venv/bin:$PATH"

# Coleta arquivos estáticos e inicia o servidor
CMD ["sh", "-c", "python manage.py collectstatic --noinput && gunicorn config.wsgi:application --bind 0.0.0.0:${PORT:-8080} --workers 1 --threads 8 --timeout 0 --access-logfile - --error-logfile -"]