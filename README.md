# 🏫 Sistema de Gestión Escolar "Colegio Bernardo O'Higgins"

Este es un ecosistema de microservicios diseñado para la gestión integral de un establecimiento educacional. La arquitectura permite separar las responsabilidades de usuarios, gestión académica y asistencia, utilizando un **BFF (Backend For Frontend)** para centralizar las peticiones del cliente.

## 🚀 Arquitectura del Proyecto

El sistema está compuesto por:
* **Frontend**: Interfaz web construida con HTML5, CSS3 (Bootstrap 5) y JavaScript Vainilla.
* **BFF (Backend For Frontend)**: Orquestador de microservicios construido en Spring Boot.
* **Servicio Usuarios**: Microservicio encargado de la persistencia de alumnos y personal en MongoDB.
* **Base de Datos**: MongoDB (NoSQL) para un almacenamiento flexible de documentos.

---

## 🛠️ Requisitos Previos

Para ejecutar este proyecto en **Windows**, solo necesitas:

1.  **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** (Configurado con WSL 2).
2.  **[Visual Studio Code](https://code.visualstudio.com/)**.
3.  **[Git for Windows](https://gitforwindows.org/)**.

*Nota: Gracias al uso de contenedores, no necesitas instalar Java, Maven o MongoDB directamente en tu sistema operativo.*

---

## ⚡ Instalación y Ejecución

Sigue estos pasos para levantar el entorno completo:

1.  **Clonar el repositorio:**
    ```bash
    git clone [https://github.com/IsraelBordones/Colegio-Bernardo-O-Higgins.git](https://github.com/IsraelBordones/Colegio-Bernardo-O-Higgins.git)
    cd Colegio-Bernardo-O-Higgins
    ```

2.  **Cambiar a la rama de desarrollo:**
    ```bash
    git checkout develop
    ```

3.  **Levantar los servicios con Docker:**
    Asegúrate de que Docker Desktop esté abierto y ejecuta:
    ```bash
    docker compose up --build -d
    ```

4.  **Acceder al Sistema:**
    * **Frontend**: Abre el archivo `frontend/index.html` en tu navegador (o usa la extensión *Live Server* de VS Code).
    * **BFF (API Gateway)**: `http://localhost:8080`
    * **Microservicio Usuarios**: `http://localhost:8081`
    * **MongoDB**: `mongodb://localhost:27017`

---

## 📂 Estructura de Carpetas

```text
Colegio-Bernardo-O-Higgins/
├── bff/                          # Orquestador Spring Boot (Puerto 8080)
├── microservicios/
│   └── usuarios/                 # Gestión de Alumnos (Puerto 8081)
├── frontend/                     # Interfaz de Usuario
│   ├── css/                      # Estilos (style.css)
│   ├── js/                       # Lógica (app.js)
│   └── index.html                # Dashboard Principal
└── docker-compose.yml            # Orquestación de contenedores
