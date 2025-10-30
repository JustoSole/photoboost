/**
 * Script rápido de testeo para Airtable
 * Verifica que las variables de entorno estén configuradas y la conexión funcione
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar .env.local desde la raíz del proyecto
const envPath = join(__dirname, '..', '.env.local');
const envLocalPath = envPath;
const envRootPath = join(__dirname, '..', '.env');

console.log('🧪 Test de Conexión Airtable\n');
console.log('📍 Buscando archivos .env...');
console.log(`   - .env.local: ${envLocalPath}`);
console.log(`   - .env: ${envRootPath}\n`);

// Intentar cargar .env.local primero
if (existsSync(envLocalPath)) {
  console.log('✅ Encontrado .env.local, cargando...');
  dotenv.config({ path: envLocalPath });
} else if (existsSync(envRootPath)) {
  console.log('✅ Encontrado .env, cargando...');
  dotenv.config({ path: envRootPath });
} else {
  console.log('❌ No se encontró .env.local ni .env');
  console.log('   Crea un archivo .env.local en la raíz del proyecto con:');
  console.log('   AIRTABLE_API_KEY=tu_api_key');
  console.log('   AIRTABLE_BASE_ID=tu_base_id');
  console.log('   AIRTABLE_TABLE_NAME=Demos');
  process.exit(1);
}

// Verificar variables requeridas
const requiredVars = {
  AIRTABLE_API_KEY: process.env.AIRTABLE_API_KEY,
  AIRTABLE_BASE_ID: process.env.AIRTABLE_BASE_ID,
  AIRTABLE_TABLE_NAME: process.env.AIRTABLE_TABLE_NAME || 'Demos'
};

console.log('\n📋 Variables de entorno encontradas:');
console.log('=====================================');
Object.entries(requiredVars).forEach(([key, value]) => {
  const status = value ? '✅' : '❌';
  const displayValue = value 
    ? (key.includes('KEY') ? `${value.substring(0, 10)}...${value.substring(value.length - 5)}` : value)
    : 'NO CONFIGURADA';
  console.log(`   ${status} ${key}: ${displayValue}`);
});

// Validar que todas estén presentes
const missing = Object.entries(requiredVars)
  .filter(([key, value]) => !value && key !== 'AIRTABLE_TABLE_NAME')
  .map(([key]) => key);

if (missing.length > 0) {
  console.log('\n❌ Variables faltantes:', missing.join(', '));
  console.log('\n💡 Agrega estas variables a tu archivo .env.local:');
  missing.forEach(key => {
    console.log(`   ${key}=tu_valor_aqui`);
  });
  process.exit(1);
}

console.log('\n✅ Todas las variables están configuradas\n');

// Test de conexión con Airtable
console.log('🔌 Probando conexión con Airtable...');
console.log('=====================================\n');

const AIRTABLE_API_URL = 'https://api.airtable.com/v0';
const baseId = requiredVars.AIRTABLE_BASE_ID;
const tableName = requiredVars.AIRTABLE_TABLE_NAME;
const apiKey = requiredVars.AIRTABLE_API_KEY;

const testUrl = `${AIRTABLE_API_URL}/${baseId}/${tableName}?maxRecords=1`;

console.log(`📡 URL: ${AIRTABLE_API_URL}/${baseId}/${tableName}`);
console.log(`🔑 API Key: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 5)}`);
console.log(`📊 Tabla: ${tableName}`);
console.log('\n⏳ Enviando request de prueba...\n');

try {
  const response = await fetch(testUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  });

  console.log(`📊 Status: ${response.status} ${response.statusText}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Error desconocido' }));
    console.log('\n❌ ERROR en la conexión:\n');
    console.log(JSON.stringify(errorData, null, 2));
    
    if (response.status === 401) {
      console.log('\n💡 Error 401: API Key inválida o sin permisos');
      console.log('   - Verifica que el API Key sea correcto');
      console.log('   - Verifica que tengas acceso a la base');
    } else if (response.status === 404) {
      console.log('\n💡 Error 404: Base ID o nombre de tabla incorrecto');
      console.log(`   - Verifica que el Base ID sea: ${baseId}`);
      console.log(`   - Verifica que la tabla se llame: ${tableName}`);
      console.log('   - Los nombres de tablas son case-sensitive');
    }
    
    process.exit(1);
  }

  const data = await response.json();
  console.log('✅ Conexión exitosa!\n');
  console.log('📦 Datos recibidos:');
  console.log(`   - Total de registros: ${data.records?.length || 0}`);
  
  if (data.records && data.records.length > 0) {
    const firstRecord = data.records[0];
    console.log(`   - Primer registro ID: ${firstRecord.id}`);
    console.log(`   - Campos: ${Object.keys(firstRecord.fields || {}).join(', ')}`);
  } else {
    console.log('   - La tabla está vacía (esto está bien para empezar)');
  }

  console.log('\n✅ TODO FUNCIONA CORRECTAMENTE!');
  console.log('\n🎉 Tu configuración de Airtable está lista para usar.');
  
} catch (error) {
  console.log('\n❌ ERROR al conectar con Airtable:');
  console.log(`   ${error.message}\n`);
  
  if (error.message.includes('fetch')) {
    console.log('💡 Verifica tu conexión a internet');
  }
  
  process.exit(1);
}

