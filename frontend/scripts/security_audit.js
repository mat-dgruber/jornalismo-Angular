#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Conjunto de achados de segurança
const findings = [];

/**
 * Função para buscar arquivos de forma recursiva
 */
function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (!['node_modules', '.git', 'dist', '.angular'].includes(f)) {
        walkDir(dirPath, callback);
      }
    } else {
      callback(dirPath);
    }
  });
}

/**
 * Verifica se arquivos de ambiente ou código expõem chaves de API secretas
 */
function checkSecrets(filePath, content) {
  // Regex para chaves privadas do Firebase ou chaves privadas gerais (não as chaves públicas de cliente do Firebase)
  const privateKeyPattern = /"private_key"\s*:\s*"-----BEGIN PRIVATE KEY-----/i;
  const genericSecretPattern = /client_secret|clientSecret|secretKey|secret_key/i;

  if (privateKeyPattern.test(content)) {
    findings.push({
      id: 'A02',
      severity: 'CRITICAL',
      category: 'Cryptographic Failures',
      file: filePath,
      line: 'N/A',
      desc: 'Chave privada encontrada exposta no frontend! Isso é de extremo risco.'
    });
  }

  // Notificação básica se houver chaves secretas codificadas de forma genérica
  const lines = content.split('\n');
  lines.forEach((line, index) => {
    if (genericSecretPattern.test(line) && !line.includes('environment') && !line.includes('import')) {
      findings.push({
        id: 'A02',
        severity: 'MEDIUM',
        category: 'Cryptographic Failures',
        file: filePath,
        line: index + 1,
        desc: `Possível segredo ou chave privada exposta diretamente no código: ${line.trim().substring(0, 50)}...`
      });
    }
  });
}

/**
 * TODO: IMPLEMENTE ESTA REGRA! (Contribuição do Usuário para o Feature)
 *
 * Objetivo: Varrer o arquivo e verificar se o desenvolvedor está usando métodos do Angular
 * que pulam a segurança nativa contra XSS (como 'bypassSecurityTrustHtml' ou 'bypassSecurityTrustStyle').
 * Se detectar o uso, deve adicionar um achado (finding) ao array `findings`.
 *
 * @param {string} filePath - O caminho do arquivo analisado
 * @param {string} content - O conteúdo de texto do arquivo
 */
function checkAngularXss(filePath, content) {
  const lines = content.split('\n');
  const xssPattern = /bypassSecurityTrust(Html|Style|Script|ResourceUrl|Url)/;

  lines.forEach((line, index) => {
    if (xssPattern.test(line)) {
      findings.push({
        id: 'A03',
        severity: 'HIGH',
        category: 'Injection / XSS',
        file: filePath,
        line: index + 1,
        desc: `Uso de bypassSecurityTrust detectado. Certifique-se de que a entrada é sanitizada rigorosamente.`
      });
    }
  });
}

function runFrontendAudit() {
  console.log("🔍 Executando SAST do Frontend (Angular/TypeScript)...");

  const srcDir = path.resolve(__dirname, '..', 'src');
  if (!fs.existsSync(srcDir)) {
    console.error("❌ Diretório 'src' não encontrado em: " + srcDir);
    process.exit(1);
  }

  walkDir(srcDir, (filePath) => {
    // Analisar apenas arquivos TypeScript ou HTML
    if (filePath.endsWith('.ts') || filePath.endsWith('.html')) {
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        checkSecrets(filePath, content);
        checkAngularXss(filePath, content);
      } catch (err) {
        // Ignorar erros de leitura pontuais
      }
    }
  });

  console.log(`✅ Análise concluída. Encontrados ${findings.length} problemas de segurança.\n`);

  if (findings.length > 0) {
    findings.forEach(f => {
      console.log(`| ${f.id} | ${f.severity.padEnd(8)} | ${f.category.padEnd(25)} | ${path.relative(path.resolve(__dirname, '..'), f.file)}:${f.line} | ${f.desc}`);
    });
    process.exit(1);
  } else {
    console.log("🎉 Nenhum problema grave detectado no SAST do Frontend!");
    process.exit(0);
  }
}

runFrontendAudit();
