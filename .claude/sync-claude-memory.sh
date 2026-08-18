#!/usr/bin/env bash
set -euo pipefail

# Script de Sincronização de Memória (Claude Code & OpenClaude)
# Projeto: jornalismo-Angular

LOCAL_TEAM_MEM_DIR=".claude/memory/team"
GLOBAL_PROJ_MEM_DIR="$HOME/.openclaude/projects/-Users-matheus-diniz-1-Documents-GitHub-jornalismo-Angular/memory"

ACTION="${1:-pull}"

mkdir -p "$LOCAL_TEAM_MEM_DIR"

if [ -d "$GLOBAL_PROJ_MEM_DIR" ]; then
  mkdir -p "$GLOBAL_PROJ_MEM_DIR/team"
fi

case "$ACTION" in
  pull)
    echo "🔄 Sincronizando memórias da equipe (Repositório -> Ambiente Global)..."
    if [ -d "$LOCAL_TEAM_MEM_DIR" ] && [ -d "$GLOBAL_PROJ_MEM_DIR" ]; then
      cp -R "$LOCAL_TEAM_MEM_DIR"/* "$GLOBAL_PROJ_MEM_DIR/team/" 2>/dev/null || true
      echo "✅ Memórias importadas para o ambiente do agente."
    fi
    ;;
  push)
    echo "🔄 Exportando memórias de equipe (Ambiente Global -> Repositório)..."
    if [ -d "$GLOBAL_PROJ_MEM_DIR/team" ]; then
      cp -R "$GLOBAL_PROJ_MEM_DIR/team"/* "$LOCAL_TEAM_MEM_DIR/" 2>/dev/null || true
      echo "✅ Memórias exportadas para .claude/memory/team/"
    fi
    ;;
  *)
    echo "Uso: $0 [pull|push]"
    exit 1
    ;;
esac
