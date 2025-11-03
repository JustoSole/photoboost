# 💳 Guía de Integración: MercadoPago Checkout Pro (Links)

## 📋 Resumen Ejecutivo

Esta guía te ayudará a entender **cómo integrar MercadoPago Checkout Pro (links)** en PhotoBoost para permitir que los usuarios paguen por tus planes de forma segura.

---

## 🎯 ¿Qué es MercadoPago Checkout Pro (Links)?

**Checkout Pro (Links)** es la solución de pago de MercadoPago que permite:

- ✅ Crear **enlaces de pago** (payment links) que puedes enviar a tus clientes
- ✅ El cliente paga en la plataforma de MercadoPago (seguro y confiable)
- ✅ No necesitas manejar datos de tarjetas en tu app
- ✅ Acepta tarjetas de crédito/débito, efectivo, transferencias, y más
- ✅ Ideal para modelos de pago único o suscripciones

**Ventajas para PhotoBoost:**
- Implementación más simple que Checkout Pro embebido
- Menor riesgo de seguridad (todo pasa por MercadoPago)
- Menos código en el frontend
- Perfecto para tu modelo de negocio (planes mensuales y pagos únicos)

---

## 🔄 Flujo de Usuario (Cómo Funcionaría)

### Escenario 1: Plan Starter ($5 - una vez)
1. Usuario hace clic en "Comenzar" en el plan Starter
2. Tu app crea un **preference/link de pago** en MercadoPago
3. Usuario es redirigido a MercadoPago (o se abre en nueva pestaña)
4. Usuario completa el pago en MercadoPago
5. MercadoPago redirige al usuario de vuelta a tu app
6. Tu backend recibe una **notificación webhook** confirmando el pago
7. Usuario obtiene acceso al servicio

### Escenario 2: Plan Pro ($20/mes) o Agencia ($60/mes)
1. Mismo flujo inicial que el plan Starter
2. Al crear el link de pago, configuras como **suscripción recurrente**
3. MercadoPago cobra automáticamente cada mes
4. Recibes webhooks cuando se renueva o falla el pago

---

## 🏗️ Arquitectura de la Solución

### Componentes Necesarios:

1. **Backend API (Nueva función)**
   - Endpoint para crear preferences/payment links
   - Endpoint para recibir webhooks de MercadoPago
   - Lógica para activar acceso al servicio después del pago

2. **Frontend (Modificar componentes existentes)**
   - Botones de Pricing.jsx que llamen a tu API
   - Página de confirmación post-pago
   - Manejo de estados (loading, success, error)

3. **Base de Datos/Storage (Airtable u otro)**
   - Registrar transacciones
   - Asociar pagos con usuarios
   - Trackear estado de suscripciones

---

## 📝 Pasos de Implementación (Alto Nivel)

### FASE 1: Preparación y Configuración

#### Paso 1.1: Crear Cuenta MercadoPago
- [ ] Registrarte en [MercadoPago Developers](https://www.mercadopago.com.ar/developers)
- [ ] Crear una aplicación
- [ ] Obtener tus credenciales:
  - **Access Token** (producción y test)
  - **Public Key** (para el frontend si usas SDK)
  - **Webhook secret** (para validar notificaciones)

#### Paso 1.2: Configurar Variables de Entorno
- [ ] Agregar en Vercel/en tu backend:
  - `MERCADOPAGO_ACCESS_TOKEN`
  - `MERCADOPAGO_WEBHOOK_SECRET`
  - `MERCADOPAGO_PUBLIC_KEY` (si usas SDK frontend)

#### Paso 1.3: Decidir URL de Retorno
- [ ] URL de éxito: `https://tu-dominio.com/payment/success`
- [ ] URL de fallo: `https://tu-dominio.com/payment/failure`
- [ ] URL de pendiente: `https://tu-dominio.com/payment/pending`

---

### FASE 2: Backend - Crear Payment Links

#### Paso 2.1: Nuevo Endpoint `/api/create-payment`
**Qué hace:**
- Recibe información del plan seleccionado (Starter/Pro/Agencia)
- Crea una "preference" en MercadoPago con:
  - Monto y moneda
  - Descripción del servicio
  - URLs de retorno
  - Información del cliente (si ya la tienes)
- Devuelve el link de pago al frontend

**Datos a enviar a MercadoPago:**
- Precio según el plan
- Descripción: "PhotoBoost - Plan [Nombre]"
- Items: [{title: "Plan Pro", quantity: 1, unit_price: 20}]
- Back URLs (success, failure, pending)
- Auto return: "approved" (redirigir automáticamente si pago exitoso)
- Payment methods: Todos o específicos

**Para suscripciones:**
- Configurar como "recurring_payment"
- Definir frecuencia: mensual
- Duración: indefinida (hasta cancelación)

---

### FASE 2.2: Endpoint `/api/webhook` o `/api/ipn`
**Qué hace:**
- MercadoPago enviará notificaciones aquí cuando:
  - Un pago se aprueba
  - Un pago falla
  - Una suscripción se renueva
  - Una suscripción se cancela

**Validaciones críticas:**
- [ ] Verificar que la notificación viene de MercadoPago (usar webhook secret)
- [ ] Verificar el estado del pago: "approved", "rejected", "pending"
- [ ] Obtener detalles completos del pago usando la API de MercadoPago
- [ ] Evitar procesar el mismo pago dos veces (idempotencia)

**Acciones a realizar:**
- [ ] Si pago aprobado: Activar acceso al servicio en tu sistema
- [ ] Si suscripción: Activar/renovar acceso mensual
- [ ] Guardar registro en Airtable/base de datos
- [ ] Enviar email de confirmación al usuario (opcional)

---

### FASE 3: Frontend - Integrar Botones de Pago

#### Paso 3.1: Modificar `Pricing.jsx`
**Cambios necesarios:**
- [ ] Cambiar los botones de "Probar gratis" a "Contratar plan" o "Pagar ahora"
- [ ] Agregar función que llame a `/api/create-payment` con el plan seleccionado
- [ ] Mostrar loading state mientras se crea el link
- [ ] Redirigir al usuario al link de MercadoPago cuando esté listo

**UX mejorada:**
- [ ] Agregar tooltip o texto que explique: "Serás redirigido a MercadoPago para completar el pago"
- [ ] Mostrar precio final (con impuestos si aplica)
- [ ] Opción de guardar datos del usuario antes de redirigir

---

### FASE 3.2: Páginas de Confirmación

#### Crear `/payment/success`
**Qué mostrar:**
- Mensaje de confirmación
- Detalles del plan contratado
- Próximos pasos: "Tu acceso está activo, sube tu primera foto"
- Botón para ir al dashboard/upload

#### Crear `/payment/failure`
**Qué mostrar:**
- Mensaje amigable explicando que el pago no se completó
- Opciones: "Intentar de nuevo" o "Contactar soporte"
- Posibles razones: tarjeta rechazada, fondos insuficientes, etc.

#### Crear `/payment/pending`
**Qué mostrar:**
- Información sobre pagos pendientes (ej: efectivo, transferencia)
- Instrucciones de cómo completar el pago
- Estado de seguimiento

---

### FASE 4: Sistema de Acceso y Gestión

#### Paso 4.1: Asociar Pagos con Usuarios
**Opciones:**
- Si el usuario ya está registrado: asociar pago con su cuenta
- Si es nuevo: crear cuenta automáticamente con email del pago
- Usar `external_reference` en MercadoPago para identificar usuarios

#### Paso 4.2: Control de Acceso
**Lógica necesaria:**
- [ ] Verificar estado de pago antes de procesar fotos
- [ ] Para plan Starter: permitir 5 fotos y luego bloquear
- [ ] Para planes mensuales: verificar que la suscripción esté activa
- [ ] Mostrar límites restantes al usuario

#### Paso 4.3: Manejo de Suscripciones
- [ ] Permitir cancelación de suscripción
- [ ] Manejar renovaciones automáticas
- [ ] Notificar cuando falta poco para renovar
- [ ] Actualizar límites mensuales al renovar

---

### FASE 5: Testing y Validación

#### Paso 5.1: Modo Sandbox/Test
- [ ] Usar credenciales de test de MercadoPago
- [ ] Probar todos los flujos:
  - Pago aprobado
  - Pago rechazado
  - Pago pendiente
  - Suscripción primera vez
  - Renovación de suscripción
  - Cancelación

#### Paso 5.2: Tarjetas de Prueba
- [ ] Usar tarjetas de test de MercadoPago
- [ ] Probar diferentes escenarios (aprobada, rechazada, pendiente)

#### Paso 5.3: Validar Webhooks
- [ ] Verificar que las notificaciones lleguen correctamente
- [ ] Probar idempotencia (enviar la misma notificación dos veces)
- [ ] Validar seguridad (rechazar requests no autorizados)

---

## 🔐 Consideraciones de Seguridad

### Webhooks
- ✅ **SIEMPRE validar** que las notificaciones vengan de MercadoPago
- ✅ Usar HTTPS para todos los endpoints
- ✅ Verificar signature/secret en cada webhook
- ✅ No confiar solo en los datos del webhook, consultar la API de MercadoPago

### Datos Sensibles
- ✅ **NUNCA** exponer tu Access Token en el frontend
- ✅ Guardar tokens solo en variables de entorno (backend)
- ✅ No loggear información sensible (números de tarjeta, tokens completos)

### Idempotencia
- ✅ Procesar cada pago solo una vez
- ✅ Guardar `payment_id` de MercadoPago para evitar duplicados
- ✅ Verificar estado antes de activar acceso

---

## 📊 Tracking y Analytics

### Métricas a Implementar
- [ ] Conversión: cuántos usuarios completan el pago
- [ ] Abandono: en qué paso del checkout abandonan
- [ ] Plan más popular
- [ ] Tasa de cancelación de suscripciones
- [ ] Tiempo promedio para completar pago

### Eventos de Analytics
- [ ] "payment_link_created" - cuando se genera un link
- [ ] "payment_redirected" - cuando usuario va a MercadoPago
- [ ] "payment_approved" - cuando se confirma el pago
- [ ] "payment_failed" - cuando falla el pago
- [ ] "subscription_cancelled" - cuando cancelan

---

## 🎯 Casos Especiales a Considerar

### Plan Starter ($5 - una vez)
- ✅ Un solo pago
- ✅ 5 fotos incluidas
- ✅ Acceso permanente a esas 5 fotos
- ❌ No renovación automática

### Plan Pro ($20/mes)
- ✅ Suscripción recurrente mensual
- ✅ 25 fotos por mes
- ✅ Reset del contador cada mes
- ✅ Acceso a historial ilimitado

### Plan Agencia ($60/mes)
- ✅ Suscripción recurrente mensual
- ✅ 100 fotos por mes
- ✅ Reset del contador cada mes
- ✅ Acceso a API
- ✅ Soporte prioritario

### Usuarios Existentes
- ✅ Si ya tienen plan activo, mostrar opción de "Mejorar plan"
- ✅ Si tienen Starter y quieren Pro, hacer upgrade
- ✅ Si tienen Pro y quieren Agencia, hacer upgrade

---

## 🔄 Flujo Completo Diagramado

```
Usuario → Clic en "Comenzar" (Plan Pro)
    ↓
Frontend: Llama a /api/create-payment
    ↓
Backend: Crea preference en MercadoPago
    ↓
Backend: Devuelve payment_link a Frontend
    ↓
Frontend: Redirige usuario a MercadoPago
    ↓
Usuario: Completa pago en MercadoPago
    ↓
MercadoPago: Redirige a /payment/success
    ↓
MercadoPago: Envía webhook a /api/webhook
    ↓
Backend: Valida webhook y activa acceso
    ↓
Usuario: Ve confirmación y puede usar el servicio
```

---

## 📚 Recursos Necesarios

### Documentación
- [MercadoPago Developers](https://www.mercadopago.com.ar/developers)
- [API de Preferences](https://www.mercadopago.com.ar/developers/es/reference/preferences/_checkout_preferences/post)
- [Webhooks/IPN](https://www.mercadopago.com.ar/developers/es/docs/your-integrations/notifications/ipn)
- [Suscripciones](https://www.mercadopago.com.ar/developers/es/docs/subscriptions)

### Herramientas
- Postman/Insomnia para probar APIs
- Ngrok (para testear webhooks localmente)
- Dashboard de MercadoPago (para monitorear pagos)

### Librerías/SDKs (Opcionales)
- `mercadopago` SDK para Node.js (simplifica crear preferences)
- O hacer requests HTTP directos a la API REST

---

## ✅ Checklist Final de Implementación

### Backend
- [ ] Endpoint `/api/create-payment` funcionando
- [ ] Endpoint `/api/webhook` recibiendo notificaciones
- [ ] Validación de seguridad implementada
- [ ] Lógica de activación de acceso
- [ ] Integración con Airtable/base de datos
- [ ] Manejo de errores robusto

### Frontend
- [ ] Botones de pricing actualizados
- [ ] Página de success creada
- [ ] Página de failure creada
- [ ] Página de pending creada (si aplica)
- [ ] Estados de loading/error manejados
- [ ] Redirección funcionando

### Testing
- [ ] Probar todos los planes en modo test
- [ ] Validar webhooks en local con ngrok
- [ ] Probar flujos de error
- [ ] Verificar idempotencia
- [ ] Testing con tarjetas de prueba

### Producción
- [ ] Credenciales de producción configuradas
- [ ] URLs de retorno actualizadas
- [ ] Webhook configurado en dashboard de MercadoPago
- [ ] Monitoreo de pagos activo
- [ ] Alertas configuradas (pagos fallidos, webhooks fallidos)

---

## 🚀 Próximos Pasos

1. **Revisar esta guía** y aclarar dudas sobre el flujo
2. **Crear cuenta de MercadoPago** y obtener credenciales de test
3. **Decidir estructura de datos**: cómo asociar pagos con usuarios
4. **Planificar implementación**: empezar por backend, luego frontend
5. **Testing exhaustivo** antes de producción

---

## 💡 Recomendaciones Adicionales

### Para Mejorar Conversión
- Mostrar badges de "Pago seguro" y logos de métodos de pago
- Agregar garantía de reembolso si aplica
- Mostrar testimonios/testimonios cerca del checkout
- Hacer el proceso de pago lo más rápido posible

### Para Reducir Abandono
- Guardar progreso del usuario (localStorage) antes de redirigir
- Enviar email recordatorio si abandona el checkout
- Mostrar precios claros (con/sin impuestos según región)
- Opción de pagar en cuotas (si MercadoPago lo permite)

### Para Retención
- Email de bienvenida cuando activan el plan
- Recordatorios antes de que expire la suscripción
- Ofrecer descuentos para renovar
- Dashboard donde vean su uso/quedan fotos

---

**¿Listo para implementar?** 🚀

Esta guía te da el roadmap completo. El siguiente paso sería empezar a escribir el código, pero primero asegurate de entender bien el flujo y tener las credenciales de MercadoPago listas.

