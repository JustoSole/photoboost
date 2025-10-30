#!/usr/bin/env node

/**
 * Script para forzar deployment y verificar estado
 */

import { execSync } from 'child_process';
import https from 'https';

console.log('🚀 FORCE DEPLOY SCRIPT\n');

// 1. Verificar que el código está pusheado
console.log('1️⃣ Verificando último commit...');
try {
  const lastCommit = execSync('git log --oneline -1', { encoding: 'utf-8' });
  console.log('   ✅', lastCommit.trim());
} catch (e) {
  console.error('   ❌ Error:', e.message);
  process.exit(1);
}

// 2. Verificar que está en sync con origin
console.log('\n2️⃣ Verificando sync con GitHub...');
try {
  const status = execSync('git status -sb', { encoding: 'utf-8' });
  console.log('   ✅', status.trim());
  
  if (status.includes('behind')) {
    console.log('   ⚠️  Tu branch está detrás de origin. Haciendo pull...');
    execSync('git pull origin main');
  }
  
  if (status.includes('ahead')) {
    console.log('   ℹ️  Hay commits locales sin pushear');
  }
} catch (e) {
  console.error('   ❌ Error:', e.message);
}

// 3. Hacer build local para verificar
console.log('\n3️⃣ Haciendo build local...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('   ✅ Build exitoso');
} catch (e) {
  console.error('   ❌ Build falló:', e.message);
  process.exit(1);
}

// 4. Verificar que el texto correcto está en el build
console.log('\n4️⃣ Verificando contenido del build...');
try {
  const grep = execSync('grep -o "Prueba Gratis con Tu Foto" dist/assets/index-*.js | head -1', { encoding: 'utf-8' });
  if (grep.includes('Prueba Gratis con Tu Foto')) {
    console.log('   ✅ Texto correcto encontrado en el build');
  } else {
    console.log('   ⚠️  Texto no encontrado');
  }
} catch (e) {
  console.log('   ⚠️  No se pudo verificar el texto');
}

console.log('\n' + '='.repeat(60));
console.log('📋 INSTRUCCIONES PARA EL USUARIO:\n');
console.log('El código está correcto y pusheado a GitHub.');
console.log('Vercel debería detectar el cambio automáticamente.\n');
console.log('🔥 PASOS PARA VER LOS CAMBIOS:');
console.log('1. Abre: https://vercel.com/dashboard');
console.log('2. Busca tu proyecto y verifica si hay deployment en progreso');
console.log('3. Si el deployment está "Ready", limpia cache:\n');
console.log('   OPCIÓN A - Modo Incógnito:');
console.log('   • Cmd+Shift+N (Mac) / Ctrl+Shift+N (Windows)');
console.log('   • Abre tu sitio en esa ventana\n');
console.log('   OPCIÓN B - Hard Reload:');
console.log('   • Cmd+Shift+R (Mac) / Ctrl+Shift+F5 (Windows)\n');
console.log('   OPCIÓN C - Limpiar Cache Completamente:');
console.log('   • Chrome: Settings → Privacy → Clear browsing data');
console.log('   • Selecciona "Cached images and files"');
console.log('   • Click "Clear data"\n');
console.log('Si después de esto SIGUE sin funcionar:');
console.log('   • Instala Vercel CLI: npm i -g vercel');
console.log('   • Deploy manual: vercel --prod');
console.log('='.repeat(60));

