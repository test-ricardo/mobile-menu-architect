# Documentación Técnica — Mobile Menu Architect

## Índice
- [Descripción General](#descripción-general)
- [Estructura de Carpetas](#estructura-de-carpetas)
- [Stack de Tecnologías](#stack-de-tecnologías)
- [Patrones y Buenas Prácticas](#patrones-y-buenas-prácticas)
- [Gestión de Autenticación](#gestión-de-autenticación)
- [Gestión de Transportes (CRUD)](#gestión-de-transportes-crud)
- [Personalización Visual](#personalización-visual)
- [Cómo agregar un nuevo módulo CRUD](#cómo-agregar-un-nuevo-módulo-crud)
- [Ejemplo de integración de Dialog](#ejemplo-de-integración-de-dialog)
- [Extensiones y utilidades](#extensiones-y-utilidades)

---

## Descripción General

Mobile Menu Architect es una aplicación web moderna construida con **React + TypeScript** y Vite. Implementa un panel administrativo para gestionar entidades como “transportes” y otras, usando un stack de componentes visuales basado en **Radix UI** y **shadcn/ui**, con estilos personalizados mediante **TailwindCSS**.

---

## Estructura de Carpetas

```
src/
│
├── components/
│   ├── transportes/
│   │   ├── TransportesList.tsx         # Tabla de transportes
│   │   └── TransportesPagination.tsx   # Paginación de transportes
│   └── ui/
│       ├── button.tsx                  # Componente botón (shadcn/ui)
│       ├── dialog.tsx                  # Componente dialog (Radix + shadcn/ui)
│       ├── sheet.tsx                   # Componente sheet lateral
│       └── ...                         # Otros componentes UI reutilizables
│
├── contexts/
│   ├── AuthContext.tsx                 # Contexto global de autenticación
│   └── DialogContext.tsx               # Contexto global para diálogos
│
├── hooks/
│   ├── useApi.ts                       # Instancia Axios centralizada (API)
│   ├── useTransportes.ts               # Hook para obtener transportes (React Query)
│   └── use-toast.ts                    # Hook y lógica para toasts
│
├── pages/
│   ├── Transportes.tsx                 # Página principal de transportes (CRUD)
│   ├── DialogTest.tsx                  # Página de pruebas para diálogos
│   └── ...                             # Otras páginas
│
├── utils/
│   └── cookie.ts                       # Utilidades para manejo de cookies
│
├── App.tsx                             # Enrutador principal y providers globales
└── main.tsx                            # Entrada de la app (ReactDOM)
```

---

## Stack de Tecnologías

- **React** + **TypeScript**: Base de la aplicación.
- **Vite**: Bundler y servidor de desarrollo.
- **Radix UI**: Primitivos accesibles para componentes UI.
- **shadcn/ui**: Arquitectura y estilos para componentes UI reutilizables.
- **TailwindCSS**: Utilidades de estilos CSS.
- **Lucide React**: Iconos SVG.
- **React Query**: Manejo de cache y fetching de datos.
- **Axios**: Cliente HTTP para consumo de API.
- **React Router DOM**: Enrutamiento SPA.
- **react-hook-form**: (opcional) Para formularios y validaciones.

---

## Patrones y Buenas Prácticas

- **Componentes UI desacoplados**: Los componentes de la carpeta `ui` son reutilizables y personalizables, basados en Radix UI y extendidos con Tailwind.
- **Hooks personalizados**: Para lógica de fetching, API y toasts, facilitando el reuso y la separación de responsabilidades.
- **Contextos globales**: Para autenticación y diálogos, permitiendo acceso global a estas funcionalidades.
- **Gestión de estado local**: Formularios y modales usan estado local controlado y feedback visual inmediato.
- **Feedback al usuario**: Uso de toasts y diálogos globales para notificaciones y confirmaciones.

---

## Gestión de Autenticación

- El token de autenticación se almacena en cookies (más seguro que localStorage).
- El contexto de autenticación (`AuthContext`) gestiona login, logout y persistencia del usuario.
- Un interceptor de Axios detecta respuestas 401 y fuerza logout automático.

---

## Gestión de Transportes (CRUD)

- **Listado**: `TransportesList.tsx` muestra los transportes en una tabla.
- **Paginación**: `TransportesPagination.tsx` permite navegar entre páginas.
- **Crear/Editar**: El formulario se muestra en un `Dialog` modal. Al hacer click en una fila, se abre el modal en modo edición.
- **Eliminar**: (Planificado) Confirmación usando el sistema global de diálogos.
- **Relacionar zonas**: El Dialog de transporte incluye botón y tabla para gestionar zonas relacionadas.

---

## Personalización Visual

- **TailwindCSS**: Se usa para todo el layout y estilos utilitarios.
- **Custom Colors**: Puedes definir colores y variantes en `tailwind.config.ts`.
- **Botones y dialogs**: Siguen la guía visual de shadcn/ui pero puedes sobrescribir estilos fácilmente.

---

## Cómo agregar un nuevo módulo CRUD

1. Crear los componentes de lista y paginación en `components/[modulo]/`.
2. Crear el formulario en un Dialog reutilizando los patrones de `Transportes`.
3. Crear un hook para el fetching de datos (usando React Query).
4. Agregar rutas y lógica en la página correspondiente.

---

## Ejemplo de integración de Dialog

```tsx
import { Dialog, DialogTrigger, DialogContent, DialogFooter } from '@/components/ui/dialog';

<Dialog>
  <DialogTrigger asChild>
    <Button>Nuevo Elemento</Button>
  </DialogTrigger>
  <DialogContent>
    {/* Formulario aquí */}
    <DialogFooter>
      <Button variant="outline">Cancelar</Button>
      <Button variant="default">Guardar</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## Extensiones y utilidades

- **Utils**: Helpers para cookies, formateo, etc.
- **Iconos**: Usa Lucide para iconografía consistente.
- **Notificaciones**: Sistema de toasts personalizable.

---

## Buenas prácticas de contribución

- Mantén componentes y hooks reutilizables y desacoplados.
- Usa tipado estricto de TypeScript.
- Prefiere hooks y contextos para lógica global.
- Usa Tailwind para estilos y sigue la guía visual del proyecto.
- Documenta nuevos módulos y componentes en la carpeta `/docs`.

---

¿Dudas, sugerencias o quieres contribuir? ¡Agrega tu documentación en `/docs` y mantén este proyecto escalable!
