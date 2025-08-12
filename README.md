# 🌱 EcoRecolección

Una plataforma innovadora para la gestión y recolección de materiales reciclables que conecta recolectores y ciudadanos comprometidos con el medio ambiente.

## ✨ Características Principales

- **Gestión de Recolección**: Sistema completo para registrar y gestionar actividades de recolección de materiales reciclables
- **Dashboard Interactivo**: Panel de control con estadísticas en tiempo real e información del impacto ambiental
- **Sistema de Usuarios**: Registro diferenciado para recolectores y ciudadanos
- **Reportes Detallados**: Análisis completo del impacto ambiental y estadísticas de reciclaje
- **Interfaz Moderna**: Diseño responsivo con Tailwind CSS y componentes reutilizables

## 🎨 Tema y Diseño

### Colores del Sistema
- **Verde Primario**: `#22c55e` - Representa la naturaleza y sostenibilidad
- **Azul Secundario**: `#3b82f6` - Confianza y profesionalismo
- **Amarillo Acento**: `#f59e0b` - Energía y optimismo
- **Escala de Grises**: Desde `#f9fafb` hasta `#111827` para elementos neutros

### Tipografía
- **Fuente Principal**: Inter - Una tipografía moderna y legible
- **Pesos**: De 300 (Light) a 800 (ExtraBold)

## 🚀 Tecnologías Utilizadas

- **Next.js 15.4.6** - Framework de React para aplicaciones web
- **React 19.1.0** - Biblioteca para interfaces de usuario
- **Tailwind CSS 4** - Framework de CSS para estilos utilitarios
- **TypeScript** - Tipado estático para JavaScript
- **PostCSS** - Procesador de CSS

## 📦 Componentes Principales

### Componentes UI Base
- **Button**: Botón versátil con múltiples variantes (primary, secondary, outline, ghost)
- **Input**: Campo de entrada con soporte para iconos, etiquetas y validación
- **Card**: Contenedor flexible para organizar contenido

### Componentes de Layout
- **Sidebar**: Navegación lateral con menú dinámico y información de usuario
- **Header**: Encabezado con título, subtítulo y acciones personalizables
- **DashboardLayout**: Layout principal que combina sidebar y header

### Componentes Especializados
- **StatCard**: Tarjetas de estadísticas con iconos, tendencias y colores temáticos
- **RegistroForm**: Formulario de registro de usuarios con validación
- **RegistroRecoleccionForm**: Formulario específico para registrar recolecciones

## 📋 Páginas Implementadas

### Landing Page (`/`)
- Hero section con llamada a la acción
- Estadísticas principales del sistema
- Características destacadas
- Footer informativo

### Autenticación
- **Login** (`/login`): Página de inicio de sesión
- **Registro** (`/registro`): Registro de nuevos usuarios

### Dashboard
- **Dashboard Principal** (`/dashboard`): Panel de control con estadísticas y actividad reciente
- **Registro de Recolección** (`/recoleccion`): Formulario para registrar nuevas recolecciones

## 🎯 Mockups Implementados

Basándose en los mockups proporcionados, se han creado:

1. **Dashboard**: Con estadísticas, gráficos y actividad reciente
2. **Registro de Usuario**: Formulario completo con validación
3. **Registro de Recolección**: Formulario especializado para materiales reciclables

## 🛠️ Instalación y Uso

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone https://github.com/Anderrc/ecorecoleccion.git

# Navegar al directorio
cd ecorecoleccion

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar en producción
npm start
```

### Scripts Disponibles
- `npm run dev` - Servidor de desarrollo con Turbopack
- `npm run build` - Construir la aplicación para producción
- `npm run start` - Ejecutar la aplicación en modo producción
- `npm run lint` - Ejecutar ESLint para verificar el código

## 🎨 Estructura de Colores CSS

```css
:root {
  --primary: #22c55e;
  --primary-dark: #16a34a;
  --secondary: #3b82f6;
  --accent: #f59e0b;
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
}
```

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── dashboard/
│   │   └── page.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── registro/
│   │   └── page.tsx
│   ├── recoleccion/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
└── components/
    ├── ui/
    │   ├── Button.tsx
    │   ├── Input.tsx
    │   └── Card.tsx
    ├── DashboardLayout.tsx
    ├── Header.tsx
    ├── Sidebar.tsx
    ├── StatCard.tsx
    ├── RegistroForm.tsx
    ├── RegistroRecoleccionForm.tsx
    └── index.ts
```

## 🌟 Próximas Funcionalidades

- Integración con APIs backend
- Sistema de autenticación real
- Mapas interactivos para ubicaciones
- Gráficos avanzados con Chart.js
- Sistema de notificaciones en tiempo real
- Aplicación móvil con React Native

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Contacto

- **Proyecto**: [EcoRecolección](https://github.com/Anderrc/ecorecoleccion)
- **Autor**: Anderson Castaño
- **Email**: anderson.castano@email.com

---

Hecho con 💚 para un mundo más sostenible
