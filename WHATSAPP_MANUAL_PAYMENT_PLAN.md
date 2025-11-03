# 📱 Plan de Implementación: Flujo Semi-Automático con WhatsApp

## 🎯 Objetivo
Implementar un sistema simple donde usuarios solicitan planes vía formulario y tú manejas pagos manualmente por WhatsApp, activando acceso en Airtable.

---

## 🔄 Flujo del Usuario

```
Usuario → Selecciona Plan → Completa Formulario → Se registra en Airtable
    ↓
WhatsApp automático se abre con mensaje pre-llenado
    ↓
Tú revisas Airtable → Contactas por WhatsApp → Coordinas pago
    ↓
Usuario paga (transferencia/MercadoPago manual) → Tú activas acceso en Airtable
    ↓
Usuario puede usar el servicio
```

---

## 📋 Checklist de Implementación

### FASE 1: Preparar Airtable (5 min)

**Tabla: `Demos` (ya existe, solo agregar campos)**

Agregar estos campos nuevos:
- `Plan` (Single select): `Starter`, `Pro`, `Agencia`
- `Estado` (Single select): `pendiente_contacto`, `en_contacto`, `pagado`, `activo`, `vencido`
- `Fecha_Solicitud` (Date): Auto-llenado
- `Fotos_Procesadas` (Number): Contador de fotos usadas
- `Limite_Fotos` (Number): Límite según plan (5, 25, 100)

**Vista sugerida:**
- "Pendientes de Contactar" → Filtro: `Estado = pendiente_contacto`
- "Usuarios Activos" → Filtro: `Estado = activo`

---

### FASE 2: Modificar Formulario de Registro (15 min)

**Archivo:** `src/components/BetaOffer.jsx` o crear nuevo `src/components/PlanRequest.jsx`

**Cambios necesarios:**

1. **Agregar selector de plan:**
   ```jsx
   <select name="plan" required>
     <option value="">Seleccionar plan</option>
     <option value="Starter">Starter - $5 (una vez)</option>
     <option value="Pro">Pro - $20/mes</option>
     <option value="Agencia">Agencia - $60/mes</option>
   </select>
   ```

2. **Función para abrir WhatsApp:**
   ```jsx
   const openWhatsApp = (plan, name, phone) => {
     const message = encodeURIComponent(
       `Hola! Me interesa el plan ${plan} de PhotoBoost. Mi nombre es ${name}.`
     )
     const whatsappNumber = '5491112345678' // Tu número sin + y espacios
     window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank')
   }
   ```

3. **Después de guardar en Airtable:**
   ```jsx
   // Después de await sendToAirtable()
   openWhatsApp(formData.plan, formData.name, formData.phone)
   ```

---

### FASE 3: Modificar Endpoint de Registro (10 min)

**Archivo:** `api/register-beta.js`

**Cambios:**

1. **Agregar campo `plan` en el body:**
   ```javascript
   const { name, email, whatsapp, plan } = req.body
   ```

2. **Agregar campos nuevos en Airtable:**
   ```javascript
   const fields = {
     Nombre: name.trim(),
     Email: emailToUse,
     WhatsApp: whatsapp.trim(),
     Plan: plan, // Nuevo
     Estado: 'pendiente_contacto', // Nuevo
     Fecha_Solicitud: new Date().toISOString().split('T')[0], // Nuevo
     Limite_Fotos: plan === 'Starter' ? 5 : plan === 'Pro' ? 25 : 100 // Nuevo
   }
   ```

---

### FASE 4: Actualizar Componente Pricing (10 min)

**Archivo:** `src/components/Pricing.jsx`

**Cambios:**

1. **Cambiar botones para que redirijan al formulario:**
   ```jsx
   <a 
     href="#beta" // O donde esté tu formulario
     className="btn btn-primary"
     onClick={() => handlePlanClick(plan.name, plan.price)}
   >
     Solicitar Plan
   </a>
   ```

2. **Opción: Scroll suave al formulario con plan pre-seleccionado:**
   ```jsx
   // Usar URL hash o state para pre-seleccionar plan
   href={`#beta?plan=${plan.name}`}
   ```

---

### FASE 5: Validar Acceso al Procesar Fotos (20 min)

**Archivo:** `api/process-photo.js`

**Agregar validación antes de procesar:**

```javascript
// Después de obtener datos del usuario
const { name, whatsapp, email, empresa, image } = req.body

// Buscar usuario en Airtable
const userRecord = await findUserInAirtable(email || whatsapp)

if (!userRecord || !userRecord.fields || userRecord.fields.Estado !== 'activo') {
  return res.status(403).json({
    success: false,
    error: 'Acceso no autorizado. Por favor contacta soporte para activar tu plan.',
    contacto: 'https://wa.me/5491112345678'
  })
}

// Verificar límite de fotos (acceder desde fields)
const fotosProcesadas = userRecord.fields?.Fotos_Procesadas || 0
const limiteFotos = userRecord.fields?.Limite_Fotos || 0

if (fotosProcesadas >= limiteFotos) {
  return res.status(403).json({
    success: false,
    error: 'Has alcanzado tu límite de fotos. Considera actualizar tu plan.',
    planActual: userRecord.fields?.Plan,
    limite: limiteFotos,
    procesadas: fotosProcesadas
  })
}

// ... continuar con procesamiento normal (Gemini, etc.)

// DESPUÉS de procesar exitosamente, incrementar contador:
const newCount = fotosProcesadas + 1
await updateAirtableRecord(userRecord.id, {
  Fotos_Procesadas: newCount
})

// En la respuesta final, incluir créditos:
return res.status(200).json({
  success: true,
  recordId: recordId,
  processedImage: processedImageBase64,
  message: 'Foto procesada exitosamente',
  credits: {
    plan: userRecord.fields.Plan || 'N/A',
    limite: limiteFotos,
    procesadas: newCount,
    restantes: limiteFotos - newCount
  }
})
```

**Función helper (agregar en `process-photo.js`):**
```javascript
async function findUserInAirtable(emailOrPhone) {
  const baseId = process.env.AIRTABLE_BASE_ID
  const tableName = process.env.AIRTABLE_TABLE_NAME
  const apiKey = process.env.AIRTABLE_API_KEY
  
  // Buscar por email o WhatsApp
  const formula = `OR(Email="${emailOrPhone}", WhatsApp="${emailOrPhone}")`
  const url = `${AIRTABLE_API_URL}/${baseId}/${tableName}?filterByFormula=${encodeURIComponent(formula)}`
  
  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${apiKey}` }
  })
  
  if (!response.ok) return null
  const data = await response.json()
  return data.records[0] || null
}
```

---

### FASE 6: Mostrar Créditos en Tiempo Real (15 min)

**Objetivo:** El usuario ve cuántas fotos le quedan (ej: "Tienes 9 fotos restantes")

**Paso 6.1: Crear Endpoint para Consultar Créditos**

**Archivo:** `api/check-credits.js` (nuevo)

```javascript
const AIRTABLE_API_URL = 'https://api.airtable.com/v0';

async function findUserInAirtable(emailOrPhone) {
  const baseId = process.env.AIRTABLE_BASE_ID
  const tableName = process.env.AIRTABLE_TABLE_NAME
  const apiKey = process.env.AIRTABLE_API_KEY
  
  const formula = `OR(Email="${emailOrPhone}", WhatsApp="${emailOrPhone}")`
  const url = `${AIRTABLE_API_URL}/${baseId}/${tableName}?filterByFormula=${encodeURIComponent(formula)}`
  
  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${apiKey}` }
  })
  
  if (!response.ok) return null
  const data = await response.json()
  return data.records[0] || null
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  
  const { email, whatsapp } = req.body
  
  if (!email && !whatsapp) {
    return res.status(400).json({ error: 'Email o WhatsApp requerido' })
  }
  
  try {
    const userRecord = await findUserInAirtable(email || whatsapp)
    
    if (!userRecord || !userRecord.fields) {
      return res.status(404).json({ 
        found: false,
        message: 'Usuario no encontrado o sin plan activo' 
      })
    }
    
    const fields = userRecord.fields
    const limite = fields.Limite_Fotos || 0
    const procesadas = fields.Fotos_Procesadas || 0
    const restantes = limite - procesadas
    
    return res.status(200).json({
      found: true,
      plan: fields.Plan || 'N/A',
      estado: fields.Estado || 'N/A',
      limiteFotos: limite,
      fotosProcesadas: procesadas,
      fotosRestantes: restantes,
      activo: fields.Estado === 'activo'
    })
  } catch (error) {
    console.error('Error consultando créditos:', error)
    return res.status(500).json({ error: error.message })
  }
}
```

**Paso 6.2: Modificar PhotoDemo para Mostrar Créditos**

**Archivo:** `src/components/PhotoDemo.jsx`

**Agregar estados:**
```jsx
const [userCredits, setUserCredits] = useState(null) // { plan, limite, procesadas, restantes }
const [checkingCredits, setCheckingCredits] = useState(false)
```

**Función para consultar créditos:**
```jsx
const checkUserCredits = async () => {
  if (!email && !whatsapp) {
    setUserCredits(null)
    return
  }
  
  setCheckingCredits(true)
  try {
    const response = await fetch('/api/check-credits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, whatsapp })
    })
    
    const data = await response.json()
    
    if (data.found && data.activo) {
      setUserCredits({
        plan: data.plan,
        limite: data.limiteFotos,
        procesadas: data.fotosProcesadas,
        restantes: data.fotosRestantes
      })
    } else {
      setUserCredits(null)
    }
  } catch (error) {
    console.error('Error consultando créditos:', error)
    setUserCredits(null)
  } finally {
    setCheckingCredits(false)
  }
}
```

**Consultar créditos cuando cambia email/whatsapp:**
```jsx
useEffect(() => {
  if (email || whatsapp) {
    checkUserCredits()
  }
}, [email, whatsapp])
```

**Actualizar créditos después de procesar:**
```jsx
// En handleProcessPhoto, después de procesar exitosamente:
if (userCredits) {
  setUserCredits(prev => ({
    ...prev,
    procesadas: prev.procesadas + 1,
    restantes: prev.restantes - 1
  }))
}
```

**Mostrar créditos en la UI:**
```jsx
{userCredits && userCredits.activo && (
  <div className="credits-display" style={{
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '1rem',
    borderRadius: '12px',
    marginBottom: '1.5rem',
    textAlign: 'center'
  }}>
    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
      📸 Plan {userCredits.plan}
    </h4>
    <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
      {userCredits.restantes} {userCredits.restantes === 1 ? 'foto restante' : 'fotos restantes'}
    </p>
    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', opacity: 0.9 }}>
      {userCredits.procesadas} de {userCredits.limite} usadas
    </p>
    {userCredits.restantes === 0 && (
      <p style={{ 
        margin: '1rem 0 0 0', 
        padding: '0.75rem', 
        background: 'rgba(255,255,255,0.2)',
        borderRadius: '8px',
        fontWeight: '600'
      }}>
        ⚠️ Has alcanzado tu límite. Considera actualizar tu plan.
      </p>
    )}
  </div>
)}
```

**Paso 6.3: Actualizar Respuesta de process-photo.js**

**Ya está incluido en FASE 5** - El endpoint debe devolver créditos en la respuesta JSON.

**Nota:** La validación y actualización de créditos ya están documentadas en FASE 5. Solo asegúrate de que la respuesta incluya el objeto `credits` como se muestra en el código ejemplo de esa fase.

**Actualizar PhotoDemo para usar créditos de la respuesta:**
```jsx
// En handleProcessPhoto, después de recibir respuesta:
const data = await response.json()

if (data.credits) {
  setUserCredits({
    plan: data.credits.plan,
    limite: data.credits.limite,
    procesadas: data.credits.procesadas,
    restantes: data.credits.restantes
  })
}
```

---

### FASE 7: Dashboard Simple en Airtable (opcional, 5 min)

**Crear automatización simple:**

1. **Email automático cuando hay nuevo registro:**
   - Airtable → Zapier/Integromat → Email a ti
   - O usar notificaciones nativas de Airtable

2. **Campos calculados:**
   - `Fotos_Restantes` = `Limite_Fotos - Fotos_Procesadas` (fórmula en Airtable)

---

## 📝 Proceso Manual de Activación

**Cuando un usuario solicita un plan:**

1. **Recibes notificación** (email o revisas Airtable)
2. **Revisas registro** en vista "Pendientes de Contactar"
3. **Abres WhatsApp** desde el campo WhatsApp en Airtable
4. **Conversas y coordinas pago** (transferencia, MercadoPago link manual, etc.)
5. **Cuando confirmas pago:**
   - Cambias `Estado` a `activo` en Airtable
   - Si es mensual, anotas fecha de vencimiento
6. **Notificas al usuario** que su acceso está activo

**Para renovaciones mensuales:**
- Revisar semanalmente usuarios con `Plan: Pro` o `Agencia`
- Contactar antes de vencimiento
- Renovar acceso manualmente

---

## 🎯 Archivos a Modificar

- ✅ `src/components/Pricing.jsx` - Cambiar botones
- ✅ `src/components/BetaOffer.jsx` - Agregar selector de plan y WhatsApp
- ✅ `src/components/PhotoDemo.jsx` - Agregar display de créditos
- ✅ `api/register-beta.js` - Agregar campos nuevos
- ✅ `api/process-photo.js` - Agregar validación de acceso y devolver créditos
- ✅ `api/check-credits.js` - Nuevo endpoint para consultar créditos
- ✅ `Airtable` - Agregar campos nuevos

---

## ⚠️ Consideraciones

**Ventajas:**
- ✅ Implementación rápida (< 1 hora)
- ✅ Control total de pagos
- ✅ Personalización en cada contacto
- ✅ Sin complejidad técnica

**Desventajas:**
- ⚠️ No escala a muchos usuarios (manual)
- ⚠️ Requiere tiempo tuyo para activar
- ⚠️ No hay tracking automático de renovaciones

**Cuándo evolucionar:**
- Cuando tengas > 20 usuarios activos
- Cuando te tome mucho tiempo activar manualmente
- Cuando quieras automatizar renovaciones

---

## 🚀 Próximos Pasos (Post-MVP)

1. **Link de MercadoPago simple:** Crear endpoint que genere link, usuario paga, tú activas manualmente
2. **Webhooks de MercadoPago:** Automatizar activación cuando se confirma pago
3. **Dashboard propio:** Ver usuarios, activar, renovar desde tu app
4. **Emails automáticos:** Notificar activación, recordatorios de renovación

---

## 💳 Resumen: Sistema de Créditos en Tiempo Real

**Cómo funciona:**

1. **Usuario ingresa email/WhatsApp** → Se consultan sus créditos automáticamente
2. **Se muestra badge visual** con "X fotos restantes" 
3. **Usuario procesa foto** → Contador se actualiza inmediatamente (10 → 9)
4. **Si llega a 0** → Se muestra advertencia y se bloquea procesamiento
5. **Tú actualizas créditos manualmente** en Airtable cuando renuevan/upgradean plan

**Ventajas:**
- ✅ Usuario siempre sabe cuántas fotos le quedan
- ✅ Transparencia total
- ✅ No hay sorpresas (se avisa antes de llegar a 0)
- ✅ Reduce soporte ("¿cuántas fotos me quedan?")

---

**¿Listo para implementar?** Empieza por FASE 1 y 2, son las más importantes para empezar a recibir solicitudes.
