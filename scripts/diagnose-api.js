#!/usr/bin/env node

/**
 * Script de diagnóstico para verificar configuración de API routes
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('🔍 Diagnóstico de API Routes\n');

// 1. Verificar estructura de carpetas
console.log('1️⃣ Verificando estructura de carpetas...');
const apiDir = join(rootDir, 'api');
if (existsSync(apiDir)) {
  console.log('   ✅ Carpeta /api existe');
  
  const testFile = join(apiDir, 'test.js');
  const processFile = join(apiDir, 'process-photo.js');
  const feedbackFile = join(apiDir, 'update-feedback.js');
  
  if (existsSync(testFile)) {
    console.log('   ✅ api/test.js existe');
  } else {
    console.log('   ❌ api/test.js NO existe');
  }
  
  if (existsSync(processFile)) {
    console.log('   ✅ api/process-photo.js existe');
  } else {
    console.log('   ❌ api/process-photo.js NO existe');
  }
  
  if (existsSync(feedbackFile)) {
    console.log('   ✅ api/update-feedback.js existe');
  } else {
    console.log('   ❌ api/update-feedback.js NO existe');
  }
} else {
  console.log('   ❌ Carpeta /api NO existe');
  process.exit(1);
}

// 2. Verificar vercel.json
console.log('\n2️⃣ Verificando vercel.json...');
const vercelJsonPath = join(rootDir, 'vercel.json');
if (existsSync(vercelJsonPath)) {
  console.log('   ✅ vercel.json existe');
  try {
    const vercelJson = JSON.parse(readFileSync(vercelJsonPath, 'utf-8'));
    console.log('   📄 Contenido:', JSON.stringify(vercelJson, null, 2));
    
    // Verificar rewrites
    if (vercelJson.rewrites) {
      console.log('   ✅ Rewrites configurados');
      vercelJson.rewrites.forEach((rewrite, i) => {
        console.log(`   📝 Rewrite ${i + 1}: ${rewrite.source} -> ${rewrite.destination}`);
        if (rewrite.source.includes('api')) {
          console.log('   ⚠️  ADVERTENCIA: Rewrite puede estar interfiriendo con /api/*');
        }
      });
    } else {
      console.log('   ℹ️  No hay rewrites configurados (esto está bien)');
    }
  } catch (e) {
    console.log('   ❌ Error leyendo vercel.json:', e.message);
  }
} else {
  console.log('   ⚠️  vercel.json NO existe (puede estar bien si usas detección automática)');
}

// 3. Verificar .env.local
console.log('\n3️⃣ Verificando variables de entorno...');
const envLocalPath = join(rootDir, '.env.local');
if (existsSync(envLocalPath)) {
  console.log('   ✅ .env.local existe');
  const envContent = readFileSync(envLocalPath, 'utf-8');
  const requiredVars = ['AIRTABLE_API_KEY', 'AIRTABLE_BASE_ID', 'GOOGLE_AI_API_KEY'];
  requiredVars.forEach(varName => {
    if (envContent.includes(varName)) {
      console.log(`   ✅ ${varName} configurada`);
    } else {
      console.log(`   ❌ ${varName} NO encontrada`);
    }
  });
} else {
  console.log('   ⚠️  .env.local NO existe');
  console.log('   💡 Crea .env.local con Liquor tus variables de entorno');
}

// 4. Verificar formato de funciones
console.log('\n4️⃣ Verificando formato de funciones...');
try {
  const testContent = readFileSync(join(apiDir, 'test.js'), 'utf-8');
  if (testContent.includes('export default')) {
    console.log('   ✅ test.js usa export default (formato correcto)');
  } else if (testContent.includes('module.exports')) {
    console.log('   ⚠️  test.js usa module.exports (debería usar export default)');
  } else {
    console.log('   ❌ test.js no tiene export default ni module.exports');
  }
  
  if (testContent.includes('function handler') || testContent.includes('handler(req, res)')) {
    console.log('   ✅ test.js tiene función handler');
  } else {
    console.log('   ❌ test.js NO tiene función handler');
  }
} catch (e) {
  console.log('   ❌ Error leyendo test.js:', e.message);
}

// 5. Verificar package.json
console.log('\n5️⃣ Verificando package.json...');
const packageJsonPath = join(rootDir, 'package.json');
if (existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  if (packageJson.scripts && packageJson.scripts['dev:vercel']) {
    console.log('   ✅ Script dev:vercel encontrado');
    console.log(`   📝 Comando: ${packageJson.scripts['dev:vercel']}`);
  } else {
    console.log('   ⚠️  Script dev:vercel NO encontrado');
  }
  
  if (packageJson.type === 'module') {
    console.log('   ✅ package.json tiene "type": "module" (correcto para ES modules)');
  } else {
    console.log('   ⚠️  package.json NO tiene "type": "module"');
  }
}

console.log('\n📋 Recomendaciones:');
console.log('   1. Reinicia vercel dev después de cambios en vercel.json');
console.log('   2. Verifica que estás usando "npm run dev:vercel" (no "npm run dev")');
console.log('   3. Si /api/test no funciona, verifica los logs en la terminal de vercel dev');
console.log('   4. Prueba acceder directamente a: http://localhost:3000/api/test');
console.log('\n✅ Diagnóstico completado\n');

