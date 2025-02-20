Pasarela de Pagos con Niubiz(dev)

Este proyecto es una implementación simple de una pasarela de pagos usando Niubiz. El frontend está desarrollado con React + Vite y el backend con Spring Boot. Todo el entorno está configurado en modo desarrollo y permite realizar pagos mediante un botón de pago.

🛠 Tecnologías Utilizadas

Frontend

  React (con Vite)

  JavaScript

Backend

  Spring Boot

  Java 17+


🚀 Inicio

Clonar el Repositorio

 git clone https://github.com/ronaldfelix/pasarela-pagos-niubiz-simple.git
 cd pasarela-pagos-niubiz-simple


La aplicación estará disponible en http://localhost:5173(frontend) y http://localhost:8080(backend)

⚡ Funcionamiento

Se muestra una casilla y un botón de pago en el frontend.

Al hacer clic, se envía una solicitud al backend.

El backend comunica con Niubiz y devuelve una respuesta.

El usuario es redirigido o recibe una confirmación del pago.

📌 Notas

Este proyecto está en ambiente de desarrollo, por lo que no es apto para producción.

Se debe configurar correctamente las credenciales de Niubiz en el backend.

Se recomienda utilizar herramientas como Postman para probar los endpoints.

📄 Licencia

Este proyecto es de uso libre y puede ser modificado según las necesidades.
