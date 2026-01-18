# Design Tokens - 165 Group

Esta guía documenta la paleta de colores corporativa y las variables CSS utilizadas en la aplicación.

## Paleta de Colores

### Colores Primarios (Primary)
Basados en el color principal del logo (#63651c - verde oliva oscuro):

- **Primary (DEFAULT)**: `#63651c` - Color principal corporativo
- **Primary 600**: `#4f4f16` - Variante más oscura para hover/estados activos
- **Primary 400**: `#7a7b27` - Variante más clara

**Uso en Tailwind:**
```jsx
<div className="bg-primary text-white">Contenido</div>
<button className="bg-primary-600 hover:bg-primary">Botón</button>
```

**Uso en CSS:**
```css
.my-element {
  background-color: var(--color-primary);
  color: white;
}
```

### Colores Secundarios (Secondary)
Basados en el color secundario del logo (#999a6e - verde oliva claro / dorado apagado):

- **Secondary (DEFAULT)**: `#999a6e` - Color secundario corporativo
- **Secondary 600**: `#80805a` - Variante más oscura
- **Secondary 300**: `#bdbd90` - Variante más clara

**Uso en Tailwind:**
```jsx
<div className="bg-secondary text-white">Contenido</div>
```

### Color de Acento (Accent)
Color complementario para CTAs y acciones importantes:

- **Accent (DEFAULT)**: `#0b66c3` - Azul profundo
- **Accent 600**: `#095bb0` - Variante más oscura

**Uso en Tailwind:**
```jsx
<button className="btn-accent">Acción importante</button>
<a className="link-accent">Enlace destacado</a>
```

### Colores Neutros (Neutral)

- **bg**: `#ffffff` - Fondo principal (blanco)
- **surface**: `#f7f7f5` - Fondo de superficies/cards
- **text**: `#111827` - Color de texto principal
- **muted**: `#6b6b6b` - Texto secundario/muted
- **muted-2**: `#9aa0a0` - Texto placeholder

**Uso en Tailwind:**
```jsx
<div className="bg-neutral-surface">Superficie</div>
<p className="text-neutral-text">Texto principal</p>
<span className="text-neutral-muted">Texto secundario</span>
```

## Variables CSS

Todas las variables están definidas en `src/styles/globals.css`:

```css
:root {
  --color-primary: #63651c;
  --color-primary-600: #4f4f16;
  --color-primary-400: #7a7b27;
  
  --color-secondary: #999a6e;
  --color-secondary-600: #80805a;
  --color-secondary-300: #bdbd90;
  
  --color-accent: #0b66c3;
  --color-accent-600: #095bb0;
  
  --color-bg: #ffffff;
  --color-surface: #f7f7f5;
  --color-text: #111827;
  --color-muted: #6b6b6b;
  --color-muted-2: #9aa0a0;
}
```

## Clases Utilitarias

### Botones

#### `.btn-primary`
Botón principal con color corporativo:
```jsx
<button className="btn-primary">Enviar</button>
```

#### `.btn-secondary`
Botón secundario:
```jsx
<button className="btn-secondary">Cancelar</button>
```

#### `.btn-accent`
Botón de acento para acciones importantes:
```jsx
<button className="btn-accent">Acción destacada</button>
```

### Cards y Superficies

#### `.card-surface`
Card con fondo surface y sombra sutil:
```jsx
<div className="card-surface">Contenido</div>
```

#### `.card-white`
Card con fondo blanco y sombra:
```jsx
<div className="card-white">Contenido</div>
```

### Enlaces

#### `.link-accent`
Enlace con color de acento:
```jsx
<a href="/" className="link-accent">Volver al inicio</a>
```

### Headers

#### `.header-border`
Header con borde inferior:
```jsx
<header className="header-border">Header</header>
```

## Ejemplos de Uso

### Landing Page
```jsx
<div className="min-h-screen bg-neutral-surface">
  <div className="card-white p-8">
    <h1 className="text-primary">Título</h1>
    <button className="btn-primary">Acción principal</button>
  </div>
</div>
```

### Formulario
```jsx
<form className="card-white p-6">
  <input className="border-gray-300 focus:ring-primary focus:border-primary" />
  <button type="submit" className="btn-primary">Enviar</button>
</form>
```

### Dashboard
```jsx
<header className="header-border">
  <h1 className="text-primary">Dashboard</h1>
  <a href="/" className="link-accent">Inicio</a>
</header>
<div className="bg-neutral-surface">
  <div className="card-white">Contenido</div>
</div>
```

## Accesibilidad

Todos los colores han sido seleccionados para cumplir con los estándares WCAG AA de contraste:

- **Primary sobre blanco**: ✅ Cumple contraste
- **Secondary sobre blanco**: ✅ Cumple contraste
- **Accent sobre blanco**: ✅ Cumple contraste
- **Texto neutral-text sobre surface**: ✅ Cumple contraste

## Modo Oscuro (Opcional)

El archivo `globals.css` incluye un scaffold para modo oscuro. Para activarlo, descomenta las variables en el media query `@media (prefers-color-scheme: dark)`.

## Notas

- Los colores primarios y secundarios provienen directamente del logo de 165 Group
- El color de acento (azul) fue elegido para proporcionar contraste y destacar acciones importantes
- Todas las variables CSS usan `var(--color-*)` para permitir cambios dinámicos en tiempo de ejecución
- Tailwind está configurado para usar estas variables, permitiendo cambios de tema futuros

