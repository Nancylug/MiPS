Sistema de Gestión para Catering Urtubey
Este sistema fue desarrollado para optimizar la gestión interna de la empresa Catering Urtubey, permitiendo llevar un control centralizado de proveedores, productos, clientes, usuarios y próximamente menús y presupuestos para eventos.

Objetivo del Proyecto
Brindar una herramienta sencilla y funcional que permita:

Registrar y administrar productos con precios sin IVA y con IVA.

Asignar productos a proveedores.

Gestionar clientes y usuarios del sistema.

Organizar la base de datos de manera estructurada y escalable.

Facilitar futuras funcionalidades como armado de menús y generación de presupuestos.

Tecnologías Utilizadas
Frontend: React con Bootstrap 5

Backend: Node.js con Express

Base de Datos: MongoDB usando Mongoose

Funcionalidades Implementadas
Gestión de Proveedores
Alta, baja y modificación de proveedores.

Asociación de productos a proveedores.

Gestión de Productos
Registro de productos con:

Nombre, descripción, unidad de medida (kg, litro, unidad, paquete).

Precio unitario sin IVA y con IVA.

Stock actual.

Proveedor asociado.

Posibilidad de editar y eliminar productos.

Gestión de Clientes
Alta, baja y modificación de clientes.

Gestión de Usuarios
Creación y mantenimiento de usuarios del sistema.

Estructura de Datos
Producto
nombre: string

descripcion: string

unidad: enum (kg, unidad, litro, paquete)

precioUnitario: number (sin IVA)

precioConIVA: number (calculado)

categoria: string (opcional)

stock: number

proveedor: referencia a documento Proveedor

fecha: fecha de creación (por defecto: fecha actual)

Instalación del Proyecto
Requisitos previos
Node.js instalado

MongoDB (local o Atlas)

Pasos
Clonar el repositorio:

bash
Copiar
Editar
git clone https://github.com/tuusuario/sistema-catering.git
cd sistema-catering
Instalar las dependencias:

bash
Copiar
Editar
npm install
Crear un archivo .env con las siguientes variables:

ini
Copiar
Editar
MONGODB_URI=mongodb://localhost:27017/cateringurtubey
PORT=5000
Iniciar el servidor:

bash
Copiar
Editar
npm start
(Opcional) Si usás el frontend en otra carpeta:

bash
Copiar
Editar
cd frontend
npm install
npm start
