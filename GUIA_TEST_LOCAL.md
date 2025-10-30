# 🧪 Guía: Probar PhotoDemo en Local

## Opción 1: Usar Vercel CLI (RECOMENDADO para funciones serverless)

Para probar las funciones `/api` en local, necesitas Vercel CLI:

### Paso 1: Instalar Vercel CLI

```bash
npm install -g vercel
```

O si prefieres usarlo sin instalar globalmente:
```bash
npx vercel dev
```

### Paso 2: Login en Vercel

```bash
vercel login
```

### Paso 3: Enlazar con tu proyecto

Si ya tienes el proyecto en Vercel:
```bash
vercel link
```

Si no, puedes probarlo sin enlazar (Scripts locales funcionan igual).

### Paso 4: Crear archivo .env.local

Crea un archivo `.env.local` en la raíz del proyecto con:

```env
AIRTABLE_API_KEY=your_airtable_api_key_here
AIRTABLE_BASE_ID=appo4trZIoubngQVF
AIRTABLE_TABLE_NAME=Demos
GOOGLE_AI_API_KEY=tu_api_key_aqui
```

**⚠️ IMPORTANTE**: Reemplaza `tu_api_key_aqui` con tu API key real de Google AI.

### Paso 5: Ejecutar en modo desarrollo

```bash
vercel dev
```

Esto iniciará:
- Tu app React en `http://localhost:3000`
- Las funciones serverless en `/api/*` funcionando correctamente

### Paso 6: Probar

1. Abre `http://localhost:3000`
2. Ve a la sección "Prueba Gratis con Tu Foto"
3. Completa el formulario y sube una foto
4. Verifica:
   - ✅ Se crea registro en Airtable
   - ✅ La foto se procesa
   - ✅ Aparece el slider Before/After
   - ✅ El feedback se guarda correctamente

---

## Opción 2: Solo Frontend (SIN funciones API)

Si solo quieres verificar que el componente se renderiza bien (sin probar las funciones):

```bash
npm run dev
```

**Limitación**: Las funciones `/api/process-photo` y `/api/update-feedback` NO funcionarán con `npm run dev`, solo con `vercel dev`.

---

## Troubleshooting

### Error: "vercel: command not found"
```bash
npm install -g vercel
```

### Error: Variables de entorno no encontradas
- Verifica que `.env.local` existe en la raíz
- Verifica que tiene las variables correctas
- Reinicia `vercel dev` después de cambiar `.env.local`

### Error en las funciones API
- Revisa los logs en la terminal donde corre `vercel dev`
- Verifica que las variables DOMAIN_NAME en `.env.local` coinciden con las de Vercel
- Verifica que `GOOGLE_AI_API_KEY` es válida

### La función no se ejecuta
- Verifica que estás usando `vercel dev` y no `npm run dev`
- Verifica que la carpeta `/api` existe en la raíz del proyecto
- Revisa `vercel.json` tiene la configuración correcta

---

## Checklist antes de Deploy

- [ ] Probado en local con `vercel dev`
- [ ] Variables de entorno configuradas en Vercel (Settings → Environment Variables)
- [ ] Upload de foto funciona
- [ ] Procesamiento con Gemini funciona
- [ ] Registro se crea en Airtable
- [ ] Feedback se guarda correctamente
- [ ] Slider Before/After funciona
- [ ] No hay errores en la consola del navegador

---

## Próximos pasos después de probar local

1. **Commit y Push:**
   ```bash
   git add .
   git commit -m "Add PhotoDemo with Airtable integration"
   git push
   ```

2. **Deploy automático:**
   - Si var configurado Vercel con GitHub/GitLab, se deploya automáticamente
   - Si no, usa: `vercel --prod`

3. **Verificar en producción:**
   - Revisa los logs en Vercel Dashboard
   - Prueba el flujo completo en producción

