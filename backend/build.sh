#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies (managed by Docker/uv usually, but for Render native runtime or just in case)
# uv sync # if using uv in the build environment

# Convert static asset files
python manage.py collectstatic --no-input

# Apply any outstanding database migrations
python manage.py migrate
