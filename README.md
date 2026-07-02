# TechSolutions Dashboard

Dashboard administrativo desarrollado con **React + Vite + Material UI**, diseñado como cliente de demostración para la API REST de **TechSolutions**.

Su objetivo principal es **consumir, validar y visualizar el funcionamiento del 100% de los endpoints expuestos por el backend Flask**, permitiendo comprobar de forma interactiva todas las funcionalidades disponibles sin necesidad de utilizar herramientas como Postman o Insomnia.

El proyecto implementa una arquitectura desacoplada donde toda la lógica de negocio reside en la API, mientras que el frontend actúa exclusivamente como consumidor de los recursos.

---

## Características principales

- Consumo del **100% de los endpoints reales** del backend.
- Autenticación completa mediante **JWT + Refresh Token**.
- Renovación automática de tokens sin intervención del usuario.
- Gestión centralizada de errores HTTP.
- Interfaz completamente responsive.
- Tema claro y oscuro.
- Componentes reutilizables para tablas, formularios y diálogos.
- Arquitectura modular y escalable.
- Formularios generados a partir de los modelos de la API.
- Soporte para filtros, paginación y búsqueda.
- Manejo consistente de estados de carga, errores y listas vacías.

---

## API demostrada

El dashboard consume íntegramente los siguientes módulos del backend:

| Recurso        | Funcionalidades                                    |
| -------------- | --------------------------------------------------- |
| Auth           | Registro, Login, Refresh Token                     |
| Usuarios       | Consulta de usuarios                               |
| Clientes       | Alta, listado, detalle, modificación y baja lógica |
| Casos          | Alta, listado, detalle, filtros y actualización    |
| Planes         | CRUD (según capacidades del backend)               |
| Servicios      | CRUD y consulta por plan                           |
| Solicitudes    | Alta, listado, filtros y cambio de estado          |
| Notificaciones | Alta, listado y marcado como leído                 |

Todos los datos mostrados en pantalla provienen exclusivamente de la API. No existen datos simulados ni mocks.

---

## Puesta en marcha

```bash
npm install

cp .env.example .env
```

Configurar:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Ejecutar el proyecto:

```bash
npm run dev
```

Frontend:

```
http://localhost:5173
```

Build de producción:

```bash
npm run build
npm run preview
```

---

## Requisitos

El backend Flask debe encontrarse en ejecución y tener habilitado CORS para el origen del frontend.

```
http://localhost:5173
```

---

## Arquitectura

```
src/
│
├── api/
│   ├── client.js
│   └── servicios por recurso
│
├── components/
│   ├── common/
│   └── layout/
│
├── context/
│
├── hooks/
│
├── pages/
│
├── routes/
│
├── theme/
│
└── utils/
```

La aplicación implementa una separación clara entre:

- Acceso a datos (API)
- Presentación (React)
- Gestión de estado
- Autenticación
- Componentes reutilizables

Esto facilita el mantenimiento y permite incorporar nuevos módulos del backend con mínimo impacto.

---

## Integración con la API

El cliente HTTP implementa una capa de comunicación robusta:

### Autenticación

- Login mediante JWT.
- Refresh Token automático.
- Reintento transparente de peticiones.
- Cola de solicitudes concurrentes durante la renovación del token.

### Persistencia

La sesión se almacena en:

```
localStorage
```

guardando:

- `access_token`
- `refresh_token`
- Información del usuario

---

## Experiencia de usuario

El dashboard incorpora múltiples mecanismos para representar correctamente el estado de la API:

- Skeletons durante las cargas.
- Mensajes de error centralizados.
- Estados vacíos.
- Confirmaciones de acciones.
- Chips de estado.
- Paginación.
- Filtros.
- Búsquedas.

De esta manera es posible verificar visualmente el comportamiento de cada endpoint frente a distintos escenarios.

---

## Dashboard

La pantalla principal consolida información proveniente de múltiples endpoints mediante consultas independientes.

Incluye:

- Métricas generales
- Cantidad de clientes
- Cantidad de usuarios
- Cantidad de casos
- Cantidad de planes
- Cantidad de servicios
- Cantidad de solicitudes
- Gráficos de distribución por estado
- Actividad reciente

Esto demuestra la capacidad de la API para alimentar paneles administrativos mediante consultas agregadas.

---

## Decisiones de implementación

El objetivo del proyecto fue representar **exactamente las capacidades reales de la API**, evitando agregar funcionalidades inexistentes.

Por ese motivo algunas acciones habituales en dashboards administrativos fueron adaptadas a las posibilidades del backend.

| Funcionalidad           | Implementación                                  |
| ------------------------ | ------------------------------------------------ |
| Logout                  | Eliminación local de la sesión                  |
| Perfil                  | Consulta del usuario autenticado mediante su ID |
| Usuarios                | Módulo de solo lectura                          |
| Eliminación de clientes | Baja lógica                                     |
| Eliminación de planes   | Cambio de estado                                |
| Solicitudes             | Cambio de estado únicamente                     |
| Notificaciones          | Marcado como leído                              |

Este enfoque garantiza que el frontend sea una representación fiel del contrato definido por la API.

---

## Objetivo del proyecto

Más que un panel administrativo tradicional, este proyecto funciona como un **cliente de referencia** para la API de TechSolutions.

Permite:

- Validar el correcto funcionamiento de todos los endpoints.
- Demostrar el flujo completo de autenticación mediante JWT.
- Verificar operaciones CRUD reales.
- Visualizar relaciones entre entidades.
- Probar filtros, paginación y búsquedas.
- Comprobar el manejo de errores y respuestas del servidor.

En otras palabras, el dashboard constituye una demostración práctica del alcance y las capacidades de la API REST desarrollada para TechSolutions.
