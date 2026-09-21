// ==========================================
// VARIABLES GLOBALES
// ==========================================

// Lista de productos obtenidos desde productos.json
let productos = [];

// Productos agregados al carrito
let carrito = [];


// ==========================================
// CARGAR PRODUCTOS DESDE JSON
// ==========================================

async function cargarProductos() {

    const contenedorProductos =
        document.getElementById("contenedorProductos");

    const mensajeCarga =
        document.getElementById("mensajeCarga");

    const mensajeError =
        document.getElementById("mensajeError");

    try {

        // Solicitar los productos al archivo JSON
        const respuesta = await fetch("productos.json");

        // Verificar que la respuesta sea correcta
        if (!respuesta.ok) {
            throw new Error("No se pudieron cargar los productos.");
        }

        // Convertir la respuesta a un arreglo JavaScript
        productos = await respuesta.json();

        // Ocultar mensaje de carga
        mensajeCarga.classList.add("d-none");

        // Mostrar productos
        mostrarProductos(productos);

    } catch (error) {

        console.error("Error al cargar los productos:", error);

        // Ocultar mensaje de carga
        mensajeCarga.classList.add("d-none");

        // Mostrar mensaje de error
        mensajeError.classList.remove("d-none");

        // Limpiar productos
        contenedorProductos.innerHTML = "";
    }
}


// ==========================================
// MOSTRAR PRODUCTOS
// ==========================================

function mostrarProductos(listaProductos) {

    const contenedorProductos =
        document.getElementById("contenedorProductos");

    // Limpiar contenido anterior
    contenedorProductos.innerHTML = "";

    listaProductos.forEach(producto => {

        // Crear columna Bootstrap
        const columna = document.createElement("div");

        columna.className =
            "col-12 col-sm-6 col-lg-4 col-xl-3";

        // Crear card del producto
        columna.innerHTML = `
            <article class="card h-100 shadow-sm">

                <img
                    src="${producto.imagen}"
                    class="card-img-top"
                    alt="${producto.nombre}"
                >

                <div class="card-body d-flex flex-column">

                    <span class="badge bg-secondary align-self-start mb-2">
                        ${producto.categoria}
                    </span>

                    <h3 class="card-title h5">
                        ${producto.nombre}
                    </h3>

                    <p class="card-text text-muted">
                        ${producto.descripcion}
                    </p>

                    <p class="fs-5 fw-bold text-primary mt-auto">
                        ${formatearPrecio(producto.precio)}
                    </p>

                    <button
                        type="button"
                        class="btn btn-primary btn-agregar"
                        data-id="${producto.id}"
                    >
                        <i class="bi bi-cart-plus"></i>
                        Agregar al carrito
                    </button>

                </div>

            </article>
        `;

        // Agregar card al DOM
        contenedorProductos.appendChild(columna);
    });
}


// ==========================================
// FORMATEAR PRECIOS
// ==========================================

function formatearPrecio(precio) {

    return precio.toLocaleString("es-CL", {
        style: "currency",
        currency: "CLP"
    });
}


// ==========================================
// AGREGAR PRODUCTO AL CARRITO
// ==========================================

function agregarAlCarrito(idProducto) {

    // Buscar el producto seleccionado
    const producto = productos.find(
        producto => producto.id === idProducto
    );

    // Verificar que el producto exista
    if (!producto) {
        return;
    }

    // Revisar si el producto ya está en el carrito
    const productoCarrito = carrito.find(
        producto => producto.id === idProducto
    );

    if (productoCarrito) {

        // Si ya existe, aumentar cantidad
        productoCarrito.cantidad++;

    } else {

        // Si no existe, agregarlo con cantidad 1
        carrito.push({
            ...producto,
            cantidad: 1
        });
    }

    // Actualizar interfaz
    actualizarCarrito();
}


// ==========================================
// ACTUALIZAR CARRITO
// ==========================================

function actualizarCarrito() {

    const resumenCarrito =
        document.getElementById("resumenCarrito");

    const contadorCarrito =
        document.getElementById("contadorCarrito");

    const totalCarrito =
        document.getElementById("totalCarrito");


    // Calcular cantidad total de productos
    const cantidadTotal = carrito.reduce(
        (total, producto) => total + producto.cantidad,
        0
    );


    // Actualizar contador
    contadorCarrito.textContent = cantidadTotal;


    // Si el carrito está vacío
    if (carrito.length === 0) {

        resumenCarrito.innerHTML = `
            <p class="text-muted text-center mb-0">
                El carrito está vacío.
            </p>
        `;

        totalCarrito.textContent = "$0";

        return;
    }


    // Limpiar resumen
    resumenCarrito.innerHTML = "";


    // Crear resumen de cada producto
    carrito.forEach(producto => {

        const subtotal =
            producto.precio * producto.cantidad;

        const elementoProducto =
            document.createElement("div");

        elementoProducto.className =
            "d-flex justify-content-between align-items-center border-bottom py-3";


        elementoProducto.innerHTML = `
            <div>

                <h6 class="mb-1">
                    ${producto.nombre}
                </h6>

                <small class="text-muted">
                    ${formatearPrecio(producto.precio)}
                    × ${producto.cantidad}
                </small>

            </div>

            <div class="text-end">

                <strong>
                    ${formatearPrecio(subtotal)}
                </strong>

                <br>

                <button
                    type="button"
                    class="btn btn-sm btn-outline-danger mt-1 btn-eliminar"
                    data-id="${producto.id}"
                >
                    <i class="bi bi-trash"></i>
                    Eliminar
                </button>

            </div>
        `;


        // Agregar producto al resumen
        resumenCarrito.appendChild(elementoProducto);
    });


    // Calcular total
    const total = carrito.reduce(
        (suma, producto) =>
            suma + producto.precio * producto.cantidad,
        0
    );


    // Mostrar total
    totalCarrito.textContent =
        formatearPrecio(total);
}


// ==========================================
// ELIMINAR PRODUCTO DEL CARRITO
// ==========================================

function eliminarDelCarrito(idProducto) {

    carrito = carrito.filter(
        producto => producto.id !== idProducto
    );

    actualizarCarrito();
}


// ==========================================
// EVENTOS DEL CARRITO
// ==========================================

document.addEventListener("click", event => {

    // Detectar botón "Agregar al carrito"
    if (event.target.closest(".btn-agregar")) {

        const boton =
            event.target.closest(".btn-agregar");

        const idProducto =
            Number(boton.dataset.id);

        agregarAlCarrito(idProducto);
    }


    // Detectar botón "Eliminar"
    if (event.target.closest(".btn-eliminar")) {

        const boton =
            event.target.closest(".btn-eliminar");

        const idProducto =
            Number(boton.dataset.id);

        eliminarDelCarrito(idProducto);
    }
});

// ==========================================
// BUSCAR PRODUCTOS
// ==========================================

function buscarProductos() {

    const inputBusqueda =
        document.getElementById("inputBusqueda");

    // Obtener el texto ingresado por el usuario
    const textoBusqueda =
        inputBusqueda.value.trim().toLowerCase();


    // Si el campo está vacío, mostrar todos los productos
    if (textoBusqueda === "") {

        mostrarProductos(productos);

        return;
    }


    // Filtrar productos por nombre, categoría o descripción
    const resultados = productos.filter(producto => {

        const nombre =
            producto.nombre.toLowerCase();

        const categoria =
            producto.categoria.toLowerCase();

        const descripcion =
            producto.descripcion.toLowerCase();


        return (
            nombre.includes(textoBusqueda) ||
            categoria.includes(textoBusqueda) ||
            descripcion.includes(textoBusqueda)
        );
    });


    // Mostrar resultados
    mostrarProductos(resultados);


    // Mostrar mensaje si no existen resultados
    if (resultados.length === 0) {

        const contenedorProductos =
            document.getElementById("contenedorProductos");

        contenedorProductos.innerHTML = `
            <div class="col-12">
                <div class="alert alert-warning text-center">
                    <i class="bi bi-search"></i>
                    No encontramos productos para
                    "<strong>${textoBusqueda}</strong>".
                </div>
            </div>
        `;
    }
}

// ==========================================
// EVENTO DE BÚSQUEDA
// ==========================================

document
    .getElementById("formBusqueda")
    .addEventListener("submit", event => {

        // Evitar que el formulario recargue la página
        event.preventDefault();

        // Ejecutar búsqueda
        buscarProductos();

    });
    
// ==========================================
// INICIAR APLICACIÓN
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    cargarProductos();

});