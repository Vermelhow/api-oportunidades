#!/bin/bash

# Script para limpar arquivos temporários do macOS
# Uso: npm run clean

echo "🧹 Limpando arquivos temporários do macOS..."

# Remove arquivos ._* (metadados do macOS)
find . -type f -name "._*" -delete

# Remove arquivos .DS_Store
find . -type f -name ".DS_Store" -delete

echo "✅ Limpeza concluída!"
echo "📝 Arquivos removidos:"
echo "   - ._* (metadados do macOS)"
echo "   - .DS_Store (configurações de pasta)"
