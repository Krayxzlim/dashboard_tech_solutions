# TechSolutions Dashboard

Panel de administración (React + Vite + MUI) que consume el 100% de los endpoints
reales expuestos por el backend Flask (`/api/auth`, `/api/usuarios`, `/api/clientes`,
`/api/casos`, `/api/planes`, `/api/servicios`, `/api/solicitudes`, `/api/notificaciones`).

## Puesta en marcha

```bash
npm install
cp .env.example .env   # editar VITE_API_BASE_URL con la URL de tu backend Flask
npm run dev             # http://localhost:5173
```

Para build de producción:

```bash
npm run build
npm run preview
```

El backend debe tener **CORS habilitado** para el origen del frontend (`http://localhost:5173`
en desarrollo), ya que el cliente HTTP corre en el navegador.

## Arquitectura

```
src/
  api/            capa de acceso a la API (un archivo por recurso, todos sobre un axios client central)
  components/
    common/       DataTable, FormDialog, ConfirmDialog, StatusChip, EmptyState, ErrorState, PageHeader
    layout/       Sidebar, Topbar, MainLayout, configuración de navegación
  context/        AuthContext (sesión/JWT), ThemeModeContext (dark mode)
  hooks/          usePaginatedResource (listado genérico con loading/error/paginación)
  pages/          una página por módulo de negocio
  routes/         ProtectedRoute (guard de sesión)
  theme/          tokens de diseño + theme de MUI (claro/oscuro)
```

- **Autenticación JWT**: `src/api/client.js` adjunta el `access_token` en cada request
  y renueva automáticamente con `refresh_token` ante un 401, reintentando la petición
  original (con cola de requests concurrentes).
- **Persistencia de sesión**: tokens y datos de usuario en `localStorage`
  (`src/utils/tokenStorage.js`).
- **Dark mode**: toggle en el topbar, persistido en `localStorage`.
- **Formularios generados desde los modelos**: `FormDialog` recibe un arreglo de
  campos (`{name, label, type, required, options}`) derivado 1:1 de los campos que
  cada endpoint del backend acepta — no hay campos inventados.
- **Manejo de errores**: interceptor centralizado en `client.js` (mensajes de red vs.
  mensajes de backend), estados vacíos, error y skeletons en cada tabla.

## ⚠️ Diferencias intencionales respecto de lo solicitado

El backend real **no expone** algunos endpoints/CRUDs completos que se piden
típicamente en un dashboard admin. Se optó por reflejar fielmente lo que existe
en vez de inventar rutas:

| Pedido                          | Realidad del backend                      | Resolución en el frontend                                                          |
| ------------------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------- |
| Logout                          | No existe endpoint                        | Se limpia la sesión localmente (tokens + estado)                                   |
| Perfil                          | No existe `/api/auth/me`                  | Se reutiliza `GET /api/usuarios/<usuario_id>` con el id guardado en sesión         |
| CRUD completo de Usuarios       | Solo `GET` (list/detalle)                 | Módulo de solo lectura, con aviso explícito en la UI                               |
| Eliminar Casos/Planes/Servicios | No hay `DELETE`                           | Sin botón de eliminar. Planes usa `PUT estado_plan=discontinuado` como baja lógica |
| Editar Solicitudes              | El `PUT` solo cambia `estado_solicitud`   | Acción "Cambiar estado" en vez de edición completa                                 |
| Editar Notificaciones           | El `PUT` solo marca como leída            | Acción "Marcar como leída" en vez de edición completa                              |
| Eliminar Clientes               | Es una baja lógica (desactiva el usuario) | Botón "Desactivar" en vez de "Eliminar"                                            |

## Módulos y endpoints consumidos

- **Auth**: register, login, refresh (sin logout backend)
- **Usuarios**: list, detalle (solo lectura)
- **Clientes**: list paginado, detalle, alta, edición, baja lógica
- **Casos**: list paginado + filtros, detalle, alta (asignación), actualización de estado/horas/notas
- **Planes**: list, detalle, alta, edición (incluye baja lógica vía estado)
- **Servicios**: list + filtros, detalle, por plan, alta, edición
- **Solicitudes**: list paginado + filtros, detalle, alta, cambio de estado
- **Notificaciones**: list paginado + filtro de leídas, alta, marcar como leída

## Dashboard principal

Métricas agregadas (clientes, casos, solicitudes, usuarios, planes, servicios),
gráfico de barras de casos recientes por estado, gráfico de torta de solicitudes
recientes por estado, y dos listados de actividad reciente.
