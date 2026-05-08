# Biblioteca Load Testing API

Backend Node.js sin base de datos para practicar pruebas de carga con JMeter.

## Requisitos

- Node.js 18 o superior
- npm

## Instalacion

```bash
npm install
npm start
```

La API queda disponible en:

```text
http://localhost:3000
```

Desde otra maquina en la misma red usa la IP de este equipo:

```text
http://IP_DE_ESTA_MAQUINA:3000
```

Puedes cambiar el puerto con:

```bash
PORT=4000 npm start
```

Por defecto el servidor escucha en `0.0.0.0`, asi que acepta conexiones desde la red interna. Si necesitas limitarlo:

```bash
HOST=127.0.0.1 npm start
```

## Endpoints

### Salud

```http
GET /health
```

### Libros

```http
GET /books
GET /books?searchText=borges
GET /books/:id
POST /books
PUT /books/:id
DELETE /books/:id
```

Body para crear o modificar:

```json
{
  "title": "La ciudad y los perros",
  "author": "Mario Vargas Llosa",
  "year": 1963,
  "genre": "Novela",
  "available": true
}
```

### Endpoints de carga

CPU:

```http
POST /load/cpu
```

```json
{
  "iterations": 250000,
  "rounds": 8
}
```

Memoria:

```http
POST /load/memory
```

```json
{
  "size": 50000
}
```

Para JMeter, empieza con valores bajos y sube usuarios/hilos gradualmente. `POST /load/cpu` bloquea el event loop con hashes SHA-256. `POST /load/memory` crea muchos objetos temporales y aumenta uso de memoria durante la request.

## Postman

Importa:

```text
postman/Biblioteca Load Testing API.postman_collection.json
```
