# 🧪 Testing & CI/CD Guide

## 🎯 Cobertura de Tests

Actualmente tenemos **~150+ tests** cubriendo:

- ✅ **Components** (98 tests) - Todos los componentes UI
- ✅ **Hooks** (20 tests) - useApi hook
- ✅ **Context** (17 tests) - Auth context
- ✅ **Utils** (5 tests) - Validadores y utilidades
- ✅ **Services** (44 tests) - API y servicios

## 🚀 Cómo Correr Tests

### Localmente

```bash
# Correr todos los tests
npm test

# Correr tests en modo watch (desarrollo)
npm test -- --watch

# Correr tests con UI interactiva
npm run test:ui

# Generar reporte de coverage
npm run test:coverage
```

### Ver Coverage

Después de correr `npm run test:coverage`, abre `coverage/index.html` en tu navegador.

## 🔄 CI/CD con GitHub Actions

### ¿Cuándo se ejecutan los tests?

Los tests se ejecutan **automáticamente** en:

1. **Cada PR hacia `dev`** ➡️ Verifica features antes de integrar
2. **Cada push a `dev`** ➡️ Asegura que la rama de desarrollo esté estable
3. **Cada PR hacia `main`** ➡️ Valida antes de promocionar a producción
4. **Cada push a `main`** ➡️ Confirma que producción esté verde

### ¿Qué pasa si fallan los tests?

#### ❌ Tests fallan en tu PR hacia `dev`

**Qué significa:** Tu feature introdujo un bug o rompió algo existente.

**Qué hacer:**
1. Ve a la pestaña "Actions" en GitHub
2. Click en el workflow que falló
3. Lee los logs para ver qué test falló
4. Arregla el código localmente
5. Corre `npm test` para verificar
6. Haz commit y push → los tests se correrán de nuevo

**No se puede mergear hasta que todos los tests pasen** ✅

#### ❌ Tests fallan en `dev`

**Qué significa:** Alguien mergeó código roto a dev.

**Qué hacer:**
1. **Prioridad alta** - dev debe estar siempre estable
2. Haz hotfix en un branch nuevo (desde dev)
3. Crea PR hacia dev
4. Asegúrate de que los tests pasen
5. Mergea rápido

#### ❌ Tests fallan en PR hacia `main`

**Qué significa:** Algo en dev está roto antes de promocionar a producción.

**Qué hacer:**
1. **NO MERGEAR** - main es producción
2. Vuelve a dev y arregla el problema
3. Crea una nueva PR de dev → main
4. Verifica que todos los tests pasen

#### ✅ Tests pasan

**Todo bien!** Tu código está listo para:
- Si es PR a dev: listo para integrar
- Si es PR a main: listo para producción

## 🎓 Flujo de Trabajo Recomendado

### 1. Desarrollando nuevo feature

```bash
# 1. Crea un branch desde dev
git checkout dev
git pull
git checkout -b feature/nueva-funcionalidad

# 2. Desarrolla y escribe tests
# ... código ...

# 3. Corre tests localmente
npm test

# 4. Commit y push
git add .
git commit -m "feat: agregar nueva funcionalidad"
git push origin feature/nueva-funcionalidad
```

### 2. Creando Pull Request

1. Ve a GitHub
2. Crea PR desde `feature/nueva-funcionalidad` → `dev`
3. **Espera a que los tests pasen** ✅
4. Si fallan, arregla y push de nuevo
5. Cuando estén verdes, solicita review
6. Mergea cuando esté aprobado

### 3. Arreglando tests que fallan

```bash
# Ver qué está fallando
npm test

# Ver detalles del error
npm test -- nombre-del-test

# Arreglar y verificar
npm test

# Cuando todo pase, commit
git add .
git commit -m "fix: arreglar test de login"
git push
```

### 4. Promocionando a producción (dev → main)

```bash
# 1. Asegúrate de que dev esté estable
git checkout dev
git pull
npm test  # Verifica localmente

# 2. Ve a GitHub y crea PR de dev → main
# Los tests se ejecutarán automáticamente

# 3. Si los tests pasan ✅:
#    - Revisa los cambios
#    - Mergea a main
#    - main ahora está en producción

# 4. Si los tests fallan ❌:
#    - NO mergear
#    - Arregla en dev primero
#    - Vuelve a crear PR cuando dev esté verde
```

## 🛠️ Debugging Tests

### Test falla pero pasa localmente

**Posibles causas:**
- Diferencias de timezone/locale
- Variables de entorno faltantes
- Dependencia de orden de tests

**Solución:**
```typescript
// Usar beforeEach/afterEach para limpiar estado
beforeEach(() => {
  localStorage.clear()
  vi.clearAllMocks()
})
```

### Test es flaky (a veces pasa, a veces falla)

**Solución:**
```typescript
// Usar waitFor para operaciones asíncronas
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument()
})

// Wrap estado en act()
await act(async () => {
  await result.current.execute()
})
```

### Error: "Cannot find name 'vi'"

**Solución:**
Ya está configurado en `vite.config.ts` con `globals: true`

## 📈 Mejorando Coverage

### Ver qué falta cubrir

```bash
npm run test:coverage
# Abre coverage/index.html
```

### Archivos excluidos de coverage

Configurado en `vite.config.ts`:
- Tests (`**/*.test.ts`)
- Setup files
- Config files
- Entry points (`main.tsx`)

## 🔐 Branch Protection Rules (Recomendado)

Para **asegurar** que nadie mergee código roto:

1. Ve a Settings → Branches
2. Agrega rule para `dev`:
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date
   - Selecciona check: "Run Tests"
3. Agrega rule para `main`:
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date
   - Selecciona check: "Run Tests"

Ahora **imposible mergear** si tests fallan en dev o main 🛡️

## 📚 Recursos

- [Vitest Docs](https://vitest.dev/)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [GitHub Actions](https://docs.github.com/en/actions)

---

**¿Preguntas?** Lee este documento o pregunta al equipo 🚀
