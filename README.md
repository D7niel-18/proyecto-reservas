# Proyecto de reservas
---

## 1. Descripción de la Arquitectura

La solución implementa una arquitectura en tres capas segmentada en redes virtuales aisladas dentro de Docker Desktop:

*   **Capa de Entrada y Frontend (Nginx):** Actúa como proxy inverso y servidor de contenido estático (SPA). Es el único contenedor con puertos expuestos al host (80:8080), recibiendo todo el tráfico HTTP de los clientes.
*   **Capa de Lógica de Negocio (API Node.js):** Contenedor independiente ejecutando una API REST con Express y conectores de MySQL. Se comunica con el proxy a través de la red frontend y con la base de datos mediante la red aislada backend.

---

## 2. Requisitos Previos e Instalación

Para ejecutar esto hay que tener las siguientes cosas instaladas:
*   [Docker Desktop](https://www.docker.com/products/docker-desktop/) 
*   Docker Compose (incluido por defecto en Docker Desktop).

### Pasos de clonación y configuración inicial:
1. Clona el repositorio en tu máquina local:
    ```bash
        git clone <https://github.com/D7niel-18/proyecto-reservas>
        cd proyecto-reservas
    ```
2. Configura las variables de entorno a partir de la plantilla de ejemplo:
    ```bash
        cp .env.example .env
    ```
3. Modifica los valores de las credenciales y parámetros en el archivo .env según tus necesidades de seguridad:
    ```bash
        DB_NAME=reservas_sevilla
        DB_USER=app_cultural_user
        DB_PASSWORD=contraseña-cambiar
        DB_ROOT_PASSWORD=contraseña-cambiar
        DB_HOST=db
        DB_PORT=3306
    ```
## 3. Como poner en marcha
1. Para construir las imágenes desde cero y poner en marcha todos los servicios ejecuta:
    ```bash
        docker compose up --build
    ```
Este comando se encargará de:
*   Construir las imágenes de Nginx y Node.js de forma aislada.   
*   Descargar la versión fija y oficial de MySQL (8.4).   
*   Inicializar las redes virtuales (frontend y backend).   
*   Evaluar los healthchecks de cada servicio para asegurar un arranque secuencial correcto y sincronizado.  

## 4. Plan de Pruebas y Verificación
1. Para verificar que los servicios corren adecuadamente y que los healthchecks informan un estado saludable (healthy), ejecuta --> docker compose ps

2. Pruebas de funcionamiento --> Abrir navegador --> Y introducir http://localhost/api/health --> Deberia de dar status OK

3. Creacion de reservas --> Ejecutar esto en el terminal:
    ```bash
    curl -X POST http://localhost/api/reservas \ -H "Content-Type: application/json" \ -d '{"nombre": "Daniel Jimenez", "actividad": "Visita guiada a Sevilla"}'
    ```

4. Ver listado de reservar --> Abrir navegador --> curl http://localhost/api/reservas

## 5. Verificación de la Persistencia de Datos
1. Crea una reserva nueva desde la interfaz web o mediante curl.   
2. Detén y elimina los contenedores activos borrando el entorno de ejecución:
    ```bash
        docker compose down
    ```
3. Vuelve a levantar los servicios:
    ```bash
        docker compose up
    ```
4. Comprueba mediante http://localhost/api/reservas si sigue almacenada correctamente.

## 6. Diagnóstico y Logs
Si necesitas verificar el comportamiento en tiempo de ejecución de los servicios, puedes consultarlos con el siguiente comando:
    ```bash
       docker compose logs -f
    ```
Para revisar únicamente los logs de la API:
    ```bash
       docker compose logs -f ap
    ```
Para revisar únicamente los logs del proxy Nginx: 
    ```bash
       docker compose logs -f web
    ```
# 7. Defensa del diseño
*   Principio de Mínimo Privilegio: Tanto Nginx como Node.js se ejecutan bajo usuarios sin privilegios de root dentro de sus contenedores.

*   Aislamiento de Red: La base de datos opera en una subred interna, impidiendo totalmente el acceso externo o desde la red pública.

*   Control de Secretos: No se incluyen contraseñas en texto plano dentro del repositorio Git; todas se inyectan dinámicamente mediante el archivo .env ignorado por control de versiones.   

*   Reproducibilidad: Se emplean versiones de imágenes acotadas y específicas (mysql:8.4, node:20.18-alpine, nginxinc/nginx-unprivileged:1.27-alpine) para evitar fallos derivados de cambios en versiones.