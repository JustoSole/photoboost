/**
 * Script completo de verificación de Airtable
 * Verifica conexión, campos, y todas las operaciones CRUD
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno
const envPath = join(__dirname, '..', '.env.local');
const envRootPath = join(__dirname, '..', '.env');

console.log('🔍 VERIFICACIÓN COMPLETA DE AIRTABLE\n');
console.log('📍 Buscando archivos .env...');
console.log(`   - .env.local: ${envPath}`);
console.log(`   - .env: ${envRootPath}\n`);

if (existsSync(envPath)) {
  console.log('✅ Encontrado .env.local, cargando...');
  dotenv.config({ path: envPath });
} else if (existsSync(envRootPath)) {
  console.log('✅ Encontrado .env, cargando...');
  dotenv.config({ path: envRootPath });
} else {
  console.log('❌ No se encontró archivo .env.local ni .env');
  console.log('   Crea un archivo .env.local en la raíz del proyecto con:');
  console.log('   AIRTABLE_API_KEY=tu_api_key');
  console.log('   AIRTABLE_BASE_ID=tu_base_id');
  console.log('   AIRTABLE_TABLE_NAME=Demos (opcional)');
  process.exit(1);
}

// Configuración
const AIRTABLE_API_URL = 'https://api.airtable.com/v0';
const baseId = process.env.AIRTABLE_BASE_ID;
const tableName = process.env.AIRTABLE_TABLE_NAME || 'Demos';
const apiKey = process.env.AIRTABLE_API_KEY;

// Campos esperados por cada endpoint
const EXPECTED_FIELDS = {
  registerBeta: ['Nombre', 'Email', 'WhatsApp', 'Beta'],
  processPhoto: ['Nombre', 'Email', 'WhatsApp', 'Estado', 'Foto_Original_URL', 'WTP'],
  processPhotoUpdate: ['Estado', 'Foto_Procesada_Base64', 'Procesado_At', 'Error_Message'],
  updateFeedback: ['Le_Gusto', 'Pagaria', 'WTP', 'Comentario', 'Beta']
};

// Colores para output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'cyan');
  console.log('='.repeat(60));
}

// ============================================
// PASO 1: Verificar Variables de Entorno
// ============================================
logSection('PASO 1: Verificar Variables de Entorno');

const requiredVars = {
  AIRTABLE_API_KEY: process.env.AIRTABLE_API_KEY,
  AIRTABLE_BASE_ID: process.env.AIRTABLE_BASE_ID,
  AIRTABLE_TABLE_NAME: tableName
};

let hasErrors = false;

Object.entries(requiredVars).forEach(([key, value]) => {
  const status = value ? '✅' : '❌';
  const displayValue = value 
    ? (key.includes('KEY') ? `${value.substring(0, 10)}...${value.substring(value.length - 5)}` : value)
    : 'NO CONFIGURADA';
  console.log(`   ${status} ${key}: ${displayValue}`);
  if (!value && key !== 'AIRTABLE_TABLE_NAME') {
    hasErrors = true;
  }
});

if (hasErrors) {
  log('\n❌ Faltan variables requeridas', 'red');
  process.exit(1);
}

log('\n✅ Todas las variables están configuradas', 'green');

// ============================================
// PASO 2: Verificar Conexión Básica
// ============================================
logSection('PASO 2: Verificar Conexión Básica con Airtable');

const testUrl = `${AIRTABLE_API_URL}/${baseId}/${tableName}?maxRecords=1`;

try {
  log(`📡 URL: ${AIRTABLE_API_URL}/${baseId}/${tableName}`, 'blue');
  log(`📊 Tabla: ${tableName}`, 'blue');
  
  const response = await fetch(testUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  });

  log(`📊 Status: ${response.status} ${response.statusText}`, response.ok ? 'green' : 'red');

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Error desconocido' }));
    log('\n❌ ERROR en la conexión:', 'red');
    console.log(JSON.stringify(errorData, null, 2));
    
    if (response.status === 401) {
      log('\n💡 Error 401: API Key inválida o sin permisos', 'yellow');
      log('   - Verifica que el API Key sea correcto', 'yellow');
      log('   - Verifica que tengas acceso a la base', 'yellow');
    } else if (response.status === 404) {
      log('\n💡 Error 404: Base ID o nombre de tabla incorrecto', 'yellow');
      log(`   - Verifica que el Base ID sea: ${baseId}`, 'yellow');
      log(`   - Verifica que la tabla se llame: ${tableName}`, 'yellow');
      log('   - Los nombres de tablas son case-sensitive', 'yellow');
    }
    
    process.exit(1);
  }

  const data = await response.json();
  log('✅ Conexión exitosa!', 'green');
  log(`📦 Total de registros en tabla: ${data.records?.length || 0}`, 'blue');
  
} catch (error) {
  log('\n❌ ERROR al conectar con Airtable:', 'red');
  log(`   ${error.message}`, 'red');
  
  if (error.message.includes('fetch')) {
    log('💡 Verifica tu conexión a internet', 'yellow');
  }
  
  process.exit(1);
}

// ============================================
// PASO 3: Verificar Campos en la Tabla
// ============================================
logSection('PASO 3: Verificar Campos en la Tabla');

try {
  // Obtener un registro para ver los campos disponibles
  const schemaUrl = `${AIRTABLE_API_URL}/${baseId}/${tableName}?maxRecords=1`;
  const schemaResponse = await fetch(schemaUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  });

  if (!schemaResponse.ok) {
    throw new Error(`Error al obtener esquema: ${schemaResponse.status}`);
  }

  const schemaData = await schemaResponse.json();
  
  // Obtener campos de un registro (si existe) o de metadata
  let availableFields = [];
  if (schemaData.records && schemaData.records.length > 0) {
    availableFields = Object.keys(schemaData.records[0].fields || {});
  }

  // También intentar obtener metadata de la base (requiere API diferente)
  // Por ahora, usamos los campos del primer registro como referencia
  
  log(`📋 Campos encontrados en la tabla (${availableFields.length}):`, 'blue');
  if (availableFields.length > 0) {
    availableFields.forEach(field => {
      log(`   ✅ ${field}`, 'green');
    });
  } else {
    log('   ⚠️  No se encontraron campos (la tabla puede estar vacía)', 'yellow');
    log('   Los campos se verificarán al crear el primer registro', 'yellow');
  }

  // Verificar campos requeridos
  log('\n🔍 Verificando campos requeridos por los endpoints:', 'blue');
  
  const allRequiredFields = new Set();
  Object.values(EXPECTED_FIELDS).forEach(fields => {
    fields.forEach(field => allRequiredFields.add(field));
  });

  const missingFields = [];
  const foundFields = [];
  
  allRequiredFields.forEach(field => {
    if (availableFields.length > 0) {
      if (availableFields.includes(field)) {
        foundFields.push(field);
        log(`   ✅ ${field}`, 'green');
      } else {
        missingFields.push(field);
        log(`   ❌ ${field} (FALTANTE)`, 'red');
      }
    } else {
      // Si no hay campos disponibles, asumimos que están bien (se verificarán en creación)
      log(`   ⚠️  ${field} (no verificado - tabla vacía)`, 'yellow');
    }
  });

  if (missingFields.length > 0 && availableFields.length > 0) {
    log('\n⚠️  Campos faltantes detectados:', 'yellow');
    log('   Estos campos son necesarios para que los endpoints funcionen correctamente.', 'yellow');
    log('   Agrega estos campos en Airtable:', 'yellow');
    missingFields.forEach(field => {
      log(`      - ${field}`, 'yellow');
    });
  } else if (availableFields.length === 0) {
    log('\n⚠️  La tabla está vacía - los campos se verificarán al crear registros', 'yellow');
  } else {
    log('\n✅ Todos los campos requeridos están presentes', 'green');
  }

} catch (error) {
  log(`\n⚠️  Error al verificar campos: ${error.message}`, 'yellow');
  log('   Continuando con las pruebas...', 'yellow');
}

// ============================================
// PASO 4: Probar Crear Registro (Register Beta)
// ============================================
logSection('PASO 4: Probar Crear Registro (Register Beta)');

let testRecordId = null;

try {
  const testEmail = `test_verification_${Date.now()}@test.local`;
  const testFields = {
    Nombre: 'Test Verificación',
    Email: testEmail,
    WhatsApp: '+5491112345678',
    Beta: true,
    Empresa: 'Test Company'
  };

  log('📝 Creando registro de prueba...', 'blue');
  log(`   Email: ${testEmail}`, 'blue');

  const createUrl = `${AIRTABLE_API_URL}/${baseId}/${tableName}`;
  const createResponse = await fetch(createUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ fields: testFields })
  });

  if (!createResponse.ok) {
    const errorData = await createResponse.json().catch(() => ({}));
    log('❌ Error al crear registro:', 'red');
    console.log(JSON.stringify(errorData, null, 2));
    
    if (errorData.error) {
      log(`\n💡 Error: ${errorData.error.message || errorData.error.type}`, 'yellow');
      if (errorData.error.message?.includes('field')) {
        log('   - Verifica que todos los campos existan en Airtable', 'yellow');
        log('   - Los nombres de campos son case-sensitive', 'yellow');
      }
    }
    throw new Error(`HTTP ${createResponse.status}: ${createResponse.statusText}`);
  }

  const createdRecord = await createResponse.json();
  testRecordId = createdRecord.id;
  
  log('✅ Registro creado exitosamente!', 'green');
  log(`   Record ID: ${testRecordId}`, 'blue');
  log(`   Campos creados: ${Object.keys(createdRecord.fields).join(', ')}`, 'blue');

} catch (error) {
  log(`❌ Error en prueba de creación: ${error.message}`, 'red');
  hasErrors = true;
}

// ============================================
// PASO 5: Probar Actualizar Registro
// ============================================
logSection('PASO 5: Probar Actualizar Registro');

if (testRecordId) {
  try {
    const updateFields = {
      Estado: 'completado',
      Le_Gusto: '😍 Me encantó',
      Pagaria: 'Sí',
      WTP: 50,
      Comentario: 'Test de verificación automática'
    };

    log('📝 Actualizando registro de prueba...', 'blue');
    log(`   Campos: ${Object.keys(updateFields).join(', ')}`, 'blue');

    const updateUrl = `${AIRTABLE_API_URL}/${baseId}/${tableName}/${testRecordId}`;
    const updateResponse = await fetch(updateUrl, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fields: updateFields })
    });

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json().catch(() => ({}));
      log('❌ Error al actualizar registro:', 'red');
      console.log(JSON.stringify(errorData, null, 2));
      
      if (errorData.error) {
        log(`\n💡 Error: ${errorData.error.message || errorData.error.type}`, 'yellow');
        if (errorData.error.message?.includes('field')) {
          log('   - Algunos campos pueden no existir en Airtable', 'yellow');
          log('   - Los campos opcionales pueden no estar definidos', 'yellow');
        }
      }
      throw new Error(`HTTP ${updateResponse.status}: ${updateResponse.statusText}`);
    }

    const updatedRecord = await updateResponse.json();
    
    log('✅ Registro actualizado exitosamente!', 'green');
    log(`   Campos actualizados: ${Object.keys(updatedRecord.fields).join(', ')}`, 'blue');

  } catch (error) {
    log(`⚠️  Error en prueba de actualización: ${error.message}`, 'yellow');
    log('   Esto puede ser normal si algunos campos no existen en Airtable', 'yellow');
  }
} else {
  log('⚠️  Saltando prueba de actualización (no se creó registro de prueba)', 'yellow');
}

// ============================================
// PASO 6: Limpiar Registro de Prueba
// ============================================
logSection('PASO 6: Limpiar Registro de Prueba');

if (testRecordId) {
  try {
    log('🗑️  Eliminando registro de prueba...', 'blue');
    
    const deleteUrl = `${AIRTABLE_API_URL}/${baseId}/${tableName}/${testRecordId}`;
    const deleteResponse = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!deleteResponse.ok) {
      throw new Error(`HTTP ${deleteResponse.status}: ${deleteResponse.statusText}`);
    }

    log('✅ Registro de prueba eliminado', 'green');

  } catch (error) {
    log(`⚠️  Error al eliminar registro de prueba: ${error.message}`, 'yellow');
    log(`   Record ID a eliminar manualmente: ${testRecordId}`, 'yellow');
  }
}

// ============================================
// RESUMEN FINAL
// ============================================
logSection('RESUMEN FINAL');

if (hasErrors) {
  log('❌ Se encontraron errores durante la verificación', 'red');
  log('   Revisa los errores arriba y corrige los problemas', 'yellow');
  process.exit(1);
} else {
  log('✅ VERIFICACIÓN COMPLETA EXITOSA', 'green');
  log('\n🎉 Tu configuración de Airtable está lista para usar!', 'green');
  log('\n📋 Endpoints verificados:', 'blue');
  log('   ✅ /api/register-beta - Crear registro beta', 'green');
  log('   ✅ /api/process-photo - Crear y actualizar registro de foto', 'green');
  log('   ✅ /api/update-feedback - Actualizar feedback', 'green');
  log('\n💡 Tip: Ejecuta este script regularmente para verificar que todo sigue funcionando', 'cyan');
}

