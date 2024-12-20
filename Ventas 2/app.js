// Variables globales para almacenar datos de productos, ventas y gastos
let productos = JSON.parse(localStorage.getItem('productos')) || [];
let ventas = JSON.parse(localStorage.getItem('ventas')) || [];
let gastos = JSON.parse(localStorage.getItem('gastos')) || [];
// Actualiza la lista de productos en el select y en la interfaz
function actualizarProductos() {
    const selectProducto = document.getElementById('productoSeleccionado');
    const productosListados = document.getElementById('productosListados');

    // Limpiar select y lista
    selectProducto.innerHTML = '<option value="">Seleccionar Producto</option>';
    productosListados.innerHTML = '';

    productos.forEach((producto, index) => {
        // Agregar al select
        const option = document.createElement('option');
        option.value = producto.nombre;
        option.textContent = `${producto.nombre} - $${producto.precio.toLocaleString('es-CO')} (Stock: ${producto.stock})`;
        selectProducto.appendChild(option);

        // Agregar a la lista de productos
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${producto.nombre} - $${producto.precio.toLocaleString('es-CO')} (Stock: ${producto.stock})</span>
            <button onclick="modificarStock(${index}, 1)">+</button>
            <button onclick="modificarStock(${index}, -1)">-</button>
            <button onclick="eliminarProducto(${index})">Eliminar</button>
        `;
        productosListados.appendChild(li);
    });
}
// Agrega un nuevo producto a la lista de productos
document.getElementById('btnAgregarProducto').onclick = function () {
    const nombre = document.getElementById('nombreProducto').value;
    const precio = parseFloat(document.getElementById('precioProducto').value);
    const costo = parseFloat(document.getElementById('costoProducto').value);
    const stock = parseInt(document.getElementById('stockProducto').value);
    const urlImagen = document.getElementById('urlImagenProducto').value;

    // Validar que los campos sean válidos
    if (nombre && !isNaN(precio) && !isNaN(costo) && !isNaN(stock) && stock >= 0) {
        const nuevoProducto = { nombre, precio, costo, stock, urlImagen };
        productos.push(nuevoProducto);
        localStorage.setItem('productos', JSON.stringify(productos));
        actualizarProductos();
    } else {
        alert('Por favor, completa todos los campos correctamente.');
    }
};
// Modifica el stock de un producto específico
function modificarStock(index, cantidad) {
    const producto = productos[index];
    producto.stock += cantidad;

    // Asegurarse de que el stock no sea negativo
    if (producto.stock < 0) {
        producto.stock = 0;
    }

    localStorage.setItem('productos', JSON.stringify(productos));
    actualizarProductos();
}
// Elimina un producto de la lista
function eliminarProducto(index) {
    productos.splice(index, 1);
    localStorage.setItem('productos', JSON.stringify(productos));
    actualizarProductos();
}
// Registra una nueva venta y actualiza el stock del producto
document.getElementById('btnRegistrarVenta').onclick = function () {
    const productoSeleccionadoNombre = document.getElementById('productoSeleccionado').value;
    const cantidad = parseInt(document.getElementById('cantidadVendida').value);

    const producto = productos.find(p => p.nombre === productoSeleccionadoNombre);

    if (producto && cantidad > 0 && cantidad <= producto.stock) {
        const venta = {
            producto: producto.nombre,
            cantidad,
            monto: producto.precio * cantidad,
            ganancia: (producto.precio - producto.costo) * cantidad
        };

        producto.stock -= cantidad;
        ventas.push(venta);

        localStorage.setItem('productos', JSON.stringify(productos));
        localStorage.setItem('ventas', JSON.stringify(ventas));

        actualizarProductos();
        actualizarReporte();
    } else {
        alert('Por favor, seleccione un producto y una cantidad válida.');
    }
};
// Agrega un gasto a la lista de gastos
document.getElementById('btnAgregarGasto').onclick = function () {
    const monto = parseFloat(document.getElementById('gasto').value);
    const descripcion = document.getElementById('descripcionGasto').value;

    if (!isNaN(monto) && descripcion) {
        const gasto = { monto, descripcion };
        gastos.push(gasto);

        localStorage.setItem('gastos', JSON.stringify(gastos));
        actualizarGastos();
        actualizarReporte();
    } else {
        alert('Por favor, completa todos los campos.');
    }
};
// Muestra los gastos registrados en la interfaz y agrega la opción para eliminarlos
function actualizarGastos() {
    const gastosListados = document.getElementById('gastosListados');
    gastosListados.innerHTML = ''; // Limpiar la lista antes de volver a cargarla

    gastos.forEach((gasto, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${gasto.descripcion} - $${gasto.monto.toLocaleString('es-CO')}
            <button onclick="eliminarGasto(${index})">Eliminar</button>
        `;
        gastosListados.appendChild(li);
    });
}

// Elimina un gasto de la lista
function eliminarGasto(index) {
    // Eliminar el gasto del array
    gastos.splice(index, 1);
    
    // Actualizar localStorage con los gastos restantes
    localStorage.setItem('gastos', JSON.stringify(gastos));
    
    // Actualizar la interfaz
    actualizarGastos();
    actualizarReporte();  // Actualiza también el reporte financiero
}


// Calcula y muestra el total de ventas, ganancias, gastos y balance
function actualizarReporte() {
    const totalVentas = ventas.reduce((total, venta) => total + venta.monto, 0);
    const gananciasTotales = ventas.reduce((total, venta) => total + venta.ganancia, 0);
    const totalGastos = gastos.reduce((total, gasto) => total + gasto.monto, 0);
    const balance = gananciasTotales - totalGastos;

    document.getElementById('totalVentas').textContent = `Total Ventas: $${totalVentas.toLocaleString('es-CO')}`;
    document.getElementById('gananciasTotales').textContent = `Ganancias Totales: $${gananciasTotales.toLocaleString('es-CO')}`;
    document.getElementById('totalGastos').textContent = `Total Gastos: $${totalGastos.toLocaleString('es-CO')}`;
    document.getElementById('balance').textContent = `Balance: $${balance.toLocaleString('es-CO')}`;
}
// Función para actualizar el reporte financiero
function actualizarReporte() {
    // Calcular total de ventas
    let totalVentas = ventas.reduce((total, venta) => total + venta.monto, 0);

    // Calcular total de gastos
    let totalGastos = gastos.reduce((total, gasto) => total + gasto.monto, 0);

    // Calcular el balance (Ventas - Gastos)
    let balance = totalVentas - totalGastos;

    // Actualizar la UI con los totales
    document.getElementById('totalVentas').textContent = `Total Ventas: $${totalVentas.toLocaleString('es-CO')}`;
    document.getElementById('totalGastos').textContent = `Total Gastos: $${totalGastos.toLocaleString('es-CO')}`;
    document.getElementById('balance').textContent = `Balance: $${balance.toLocaleString('es-CO')}`;

    // Crear un objeto de reporte financiero
    const fechaHoy = new Date().toISOString().split('T')[0]; // Formato: "YYYY-MM-DD"
    const reporte = {
        fecha: fechaHoy,
        totalVentas: totalVentas,
        totalGastos: totalGastos,
        balance: balance
    };

    // Guardar el reporte en el historial usando la fecha como clave
    let historial = JSON.parse(localStorage.getItem('historialReportes')) || {};
    historial[fechaHoy] = reporte;
    localStorage.setItem('historialReportes', JSON.stringify(historial));

    // Actualizar el historial en la interfaz
    actualizarHistorial();
}
// Función para actualizar el historial de reportes en la interfaz
function actualizarHistorial() {
    const historialReportes = JSON.parse(localStorage.getItem('historialReportes')) || {};
    const historialListados = document.getElementById('historialReportes');
    historialListados.innerHTML = '';

    // Recorrer las claves del historial (fechas) y generar la lista
    Object.keys(historialReportes).forEach(fecha => {
        const reporte = historialReportes[fecha];
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>Fecha: ${reporte.fecha}</strong><br>
            Total Ventas: $${reporte.totalVentas.toLocaleString('es-CO')}<br>
            Total Gastos: $${reporte.totalGastos.toLocaleString('es-CO')}<br>
            Balance: $${reporte.balance.toLocaleString('es-CO')}<br>
            <button onclick="eliminarReporteHistorial('${fecha}')">Eliminar</button>
        `;
        historialListados.appendChild(li);
    });
}
// Elimina un reporte del historial por fecha
function eliminarReporteHistorial(fecha) {
    let historial = JSON.parse(localStorage.getItem('historialReportes')) || {};
    delete historial[fecha]; // Eliminar el reporte con la fecha específica
    localStorage.setItem('historialReportes', JSON.stringify(historial));

    // Actualizar el historial en la interfaz
    actualizarHistorial();

    // Notificar al usuario
    alert(`El reporte del ${fecha} ha sido eliminado del historial.`);
}


// Inicializa la interfaz con los datos almacenados en LocalStorage
actualizarProductos();
actualizarGastos();
actualizarReporte();
actualizarHistorial();

