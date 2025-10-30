#!/usr/bin/env node

/**
 * Script de diagnóstico para verificar que todo está listo para desplegar en Vercel
 * Uso: node scripts/verify-deployment.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.join(__dirname, '..');

console.log('\n🔍 Verificando configuración de despliegue...\n');

let allGood = true;

// ✅ Verificar Git status
try {
  console.log('📦 Git Status:');
  const gitStatus = execSync('git status --porcelain', { cwd: root }).toString().trim();
  if (gitStatus.length === 0) {
    console.log('  ✅ Working tree clean');
  } else {
    console.log('  ❌ Cambios no commiteados:');
    console.log(gitStatus);
    allGood = false;
  }
} catch (e) {
  console.log('  ⚠️ No se pudo verificar git');
}

// ✅ Verificar vercel.json
console.log('\n📋 vercel.json:');
const vercelPath = path.join(root, 'vercel.json');
if (fs.existsSync(vercelPath)) {
  try {
    const vercelJson = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
    if (vercelJson.buildCommand && vercelJson.outputDirectory) {
      console.log('  ✅ Configurado correctamente');
      console.log(`     - Build: ${vercelJson.buildCommand}`);
      console.log(`     - Output: ${vercelJson.outputDirectory}`);
    } else {
      console.log('  ❌ Falta buildCommand o outputDirectory');
      allGood = false;
    }
  } catch (e) {
    console.log('  ❌ JSON inválido:', e.message);
    allGood = false;
  }
} else {
  console.log('  ❌ No existe');
  allGood = false;
}

// ✅ Verificar package.json scripts
console.log('\n📜 package.json scripts:');
try {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  if (pkg.scripts.build) {
    console.log(`  ✅ Build script: "${pkg.scripts.build}"`);
  } else {
    console.log('  ❌ No hay script de build');
    allGood = false;
  }
} catch (e) {
  console.log('  ❌ Error leyendo package.json');
  allGood = false;
}

// ✅ Verificar que dist no esté commiteado
console.log('\n📁 Archivos ignorados:');
const distCommitted = execSync('git ls-files | grep "^dist/"', { 
  cwd: root,
  stdio: ['pipe', 'pipe', 'ignore']
}).toString().trim().length > 0;

if (!distCommitted) {
  console.log('  ✅ dist/ no está commiteado (correcto)');
} else {
  console.log('  ⚠️ dist/ está en git (considera agregarlo a .gitignore)');
}

// ✅ Hacer un build de prueba
console.log('\n🔨 Test de build:');
try {
  execSync('npm run build', { cwd: root, stdio: 'pipe' });
  console.log('  ✅ Build exitoso');
} catch (e) {
  console.log('  ❌ Build falló');
  allGood = false;
}

// 📊 Resumen
console.log('\n' + '='.repeat(50));
if (allGood) {
  console.log('✅ TODO ESTÁ LISTO PARA DESPLEGAR\n');
  console.log('Próximo paso: git push origin main');
  console.log('Vercel se actualizará automáticamente\n');
  process.exit(0);
} else {
  console.log('❌ HAY PROBLEMAS QUE RESOLVER\n');
  console.log('Revisa los errores arriba\n');
  process.exit(1);
}
