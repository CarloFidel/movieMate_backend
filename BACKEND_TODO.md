# Backend TODO

## Contexto actual

El backend ya tiene una base funcional bastante clara:

- registro de usuarios
- login con JWT
- rutas protegidas con estrategia JWT
- roles de usuario
- entidad `User`
- entidad `Favorite_Movies` mapeada a la tabla `favorite_movies`
- relacion entre usuario y peliculas favoritas
- seed inicial con 1 administrador y 10 peliculas
- PostgreSQL con TypeORM

La logica de negocio actual no es un catalogo interno de peliculas.

El backend guarda favoritos de usuario. Cada fila en `favorite_movies` representa que un usuario guardo una pelicula externa identificada por `moviedbID`.

Eso significa que el backend no necesita almacenar toda la informacion de TMDB, solo lo necesario para relacionar el favorito con el usuario y para que el frontend luego consulte la API externa.

## Aclaracion importante

Con el enfoque que has elegido, no hace falta una tabla global de catalogo para peliculas.

Tu modelo actual tiene sentido si decides que:

- cuando un usuario marca una pelicula como favorita, se crea una fila nueva
- esa fila pertenece a ese usuario
- otro usuario puede guardar la misma pelicula externa en otra fila distinta

En ese modelo, el UUID identifica cada favorito guardado, no la pelicula externa global.

## Lo que realmente queda por hacer

## Prioridad alta

### 1. Cerrar bien la logica de favoritos por usuario autenticado

Ahora mismo la idea funcional esta clara, pero falta cerrarla del todo en backend.

Debe quedar garantizado que:

- solo un usuario autenticado puede crear favoritos
- el usuario se toma del JWT, no del body
- cada favorito queda asociado automaticamente al usuario autenticado

Objetivo:

- que el frontend no tenga que enviar `userId` al crear favoritos
- que el backend sepa siempre quien esta guardando la pelicula

### 2. Evitar duplicados de la misma pelicula para un mismo usuario

Esta es probablemente la regla de negocio mas importante que todavia debes decidir e implementar.

Lo normal seria:

- un usuario no puede guardar dos veces el mismo `moviedbID`
- dos usuarios distintos si pueden guardar ese mismo `moviedbID`

La forma correcta de resolverlo en backend es con una restriccion por negocio del tipo:

- unicidad compuesta `userId + moviedbID`

Sin eso, el usuario podria duplicar favoritos iguales dentro de su propia cuenta.

### 3. Proteger lectura y borrado por ownership

No basta con que exista JWT. El backend debe comprobar que el favorito que se lee o se borra pertenece al usuario autenticado.

Eso implica:

- si un usuario pide un favorito por `id`, debe ser suyo
- si un usuario elimina un favorito, debe ser suyo
- si un usuario lista favoritos, idealmente deberia listar los suyos sin depender de un `userId` arbitrario enviado por URL

### 4. Redefinir los endpoints de favoritos para que queden mas coherentes

Aunque el modulo se siga llamando `movies`, por negocio ahora representa favoritos.

Te convendria cerrar algo de este estilo:

- `POST /movies` o `POST /favorites` para guardar un favorito del usuario autenticado
- `GET /movies/me` o `GET /favorites/me` para listar los favoritos propios
- `GET /movies/:id` para ver un favorito concreto del usuario
- `DELETE /movies/:id` para eliminar un favorito propio

Hoy parte del flujo sigue apoyandose en `userId` por URL. Para una API autenticada, suele ser mas limpio trabajar con `me`.

### 5. Corregir detalles de auth que todavia no estan cerrados como producto

La base esta hecha, pero aun faltan cierres importantes:

- unificar respuestas de `register` y `login`
- no exponer propiedades innecesarias del usuario
- revisar si `login` debe seguir siendo `GET` o pasar a `POST`
- añadir un endpoint de usuario autenticado tipo `GET /auth/me`

## Prioridad media

### 6. Perfil de usuario

Te falta una capa de perfil para una app realista:

- consultar el perfil del usuario autenticado
- actualizar `fullName`
- actualizar avatar
- opcionalmente cambiar password en otro endpoint separado

Esto encaja mejor con el flujo real de una plataforma tipo streaming.

### 7. Decidir el alcance real del avatar

Ahora mismo ya tienes `avatarUrl` en `User`. Para este proyecto, eso probablemente es suficiente.

No necesitas una tabla separada de avatar si:

- cada usuario solo tiene un avatar
- solo guardas la URL o ruta de la imagen
- la imagen real vive fuera de PostgreSQL

Una tabla independiente solo tendria sentido si quieres:

- multiples imagenes por usuario
- historial de avatar
- metadata de archivos
- reutilizar archivos para otras entidades

Conclusion realista:

- el avatar no es lo principal que te falta
- `avatarUrl` como columna simple es suficiente para esta version

### 8. Mejorar paginacion y respuesta de listado

Ya tienes una base para paginacion, pero faltaria hacerla mas consistente:

- devolver `limit`
- devolver `offset`
- devolver `total`
- ordenar los resultados con criterio estable

Eso dejaria el endpoint mucho mas util para frontend.

### 9. Añadir validaciones de negocio a favoritos

Ademas de las validaciones tecnicas del DTO, faltan validaciones de negocio como:

- impedir duplicados por usuario
- responder con error claro si el favorito ya existe
- decidir si `title` es obligatorio o solo cache opcional
- decidir si se guardan mas campos derivados de TMDB, como poster o release date

## Prioridad media-baja

### 10. Refinar seed

El seed ya existe, pero todavia puedes mejorarlo:

- devolver un resumen de lo insertado
- dejar mas clara la separacion entre admin y favoritos demo
- hacerlo idempotente si quieres reutilizarlo varias veces sin borrar todo

### 11. Documentar la API

Te conviene dejar documentado:

- endpoints disponibles
- rutas protegidas
- body de register y login
- body para crear favoritos
- formato del token
- respuestas de error

Lo natural mas adelante seria montar Swagger.

### 12. Tests

Sigue faltando una capa minima de pruebas para asegurar el backend:

- registro
- login
- JWT en rutas protegidas
- creacion de favorito
- bloqueo de duplicados
- listado paginado
- borrado con ownership

### 13. Produccion y mantenimiento

Aunque sea una app academica, conviene dejar apuntado:

- apagar `synchronize: true` en produccion
- usar migraciones
- validar variables de entorno criticas
- mejorar logs y manejo de errores

## Resumen ejecutivo

Si tomamos tu modelo actual como valido, entonces no te falta rehacer por completo la parte de peliculas.

Lo que te queda de verdad es:

- cerrar favoritos con el usuario autenticado
- evitar duplicados por `userId + moviedbID`
- aplicar ownership en lectura y borrado
- completar perfil de usuario
- decidir si el avatar se queda como `avatarUrl`
- documentar y probar

## Respuesta corta a tu duda anterior

No, no te falta solo una tabla para avatar.

Lo principal pendiente en backend ahora es cerrar bien la capa de favoritos autenticados y las reglas de negocio que la rodean.

La tabla separada de avatar es opcional y, para esta version, probablemente innecesaria.