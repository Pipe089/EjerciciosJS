function mostrar(id) {
    let secciones = document.getElementsByClassName("seccion");
    for (let i = 0; i < secciones.length; i++) {
        secciones[i].style.display = "none";
    }
    document.getElementById(id).style.display = "block";
}

/* 1. EMPLEADOS */
let empleados = [];
let indiceEditar = -1;

function agregarEmpleado() {
    let nombre = document.getElementById("nombre").value;
    let apellido = document.getElementById("apellido").value;
    let genero = document.getElementById("genero").value;
    let anio = document.getElementById("anio").value;
    let ingreso = document.getElementById("ingreso").value;
    let egreso = document.getElementById("egreso").value;
    let salario = document.getElementById("salario").value;

    // VALIDAR CAMPOS VACÍOS
    if (nombre == "" || apellido == "" || genero == "" || anio == "" || ingreso == "" || salario == "") {
        alert("No se puede agregar, hay campos vacíos");
        return;
    }

    let empleado = {
        nombre,
        apellido,
        genero,
        anio,
        ingreso,
        egreso,
        salario: parseFloat(salario)
    };

    if (indiceEditar == -1) {
        empleados.push(empleado);
        alert("Empleado agregado");
    } else {
        empleados[indiceEditar] = empleado;
        alert("Empleado modificado");
        indiceEditar = -1;
    }

    limpiarCampos();
}

function mostrarEmpleados() {
    let lista = document.getElementById("listaEmpleados");
    lista.innerHTML = "";

    empleados.forEach((e, i) => {
        let edad = new Date().getFullYear() - e.anio;
        let antiguedad = new Date().getFullYear() - new Date(e.ingreso).getFullYear();
        let estado = e.egreso ? "Inactivo" : "Activo";

        let salud = e.salario * 0.04;
        let pension = e.salario * 0.04;
        let arl = e.salario * 0.00522;
        let auxilio = e.salario < 2600000 ? 162000 : 0;

        let claseEstado = estado == "Activo" ? "estado-activo" : "estado-inactivo";

        lista.innerHTML += `
            <div class="empleado-card">
                <h3>${e.nombre} ${e.apellido}</h3>
                <p><b>Género:</b> ${e.genero}</p>
                <p><b>Edad:</b> ${edad}</p>
                <p><b>Antigüedad:</b> ${antiguedad} años</p>
                <p><b>Estado:</b> <span class="${claseEstado}">${estado}</span></p>
                <p><b>Salario:</b> $${e.salario}</p>
                <hr>
                <p><b>Salud:</b> $${salud.toFixed(0)}</p>
                <p><b>Pensión:</b> $${pension.toFixed(0)}</p>
                <p><b>ARL:</b> $${arl.toFixed(0)}</p>
                <p><b>Auxilio:</b> $${auxilio}</p>

                <div class="botones">
                    <button class="btn-editar" onclick="editarEmpleado(${i})">Modificar</button>
                    <button class="btn-baja" onclick="eliminarEmpleado(${i})">Dar de baja</button>
                </div>
            </div>
        `;
    });
}

function editarEmpleado(i) {
    let e = empleados[i];

    document.getElementById("nombre").value = e.nombre;
    document.getElementById("apellido").value = e.apellido;
    document.getElementById("genero").value = e.genero;
    document.getElementById("anio").value = e.anio;
    document.getElementById("ingreso").value = e.ingreso;
    document.getElementById("egreso").value = e.egreso;
    document.getElementById("salario").value = e.salario;

    indiceEditar = i;
}

function eliminarEmpleado(i) {
    let confirmar = confirm("¿Desea dar de baja este empleado?");
    if (confirmar) {
        empleados[i].egreso = new Date().toISOString().split('T')[0];
        alert("Empleado dado de baja");
        mostrarEmpleados();
    }
}

function limpiarCampos() {
    document.getElementById("nombre").value = "";
    document.getElementById("apellido").value = "";
    document.getElementById("genero").value = "";
    document.getElementById("anio").value = "";
    document.getElementById("ingreso").value = "";
    document.getElementById("egreso").value = "";
    document.getElementById("salario").value = "";
}

/* 2. BANCO */
function simularBanco() {
    let nombre = document.getElementById("clienteNombre").value;
    let cedula = document.getElementById("clienteCedula").value;
    let id = document.getElementById("clienteId").value;
    let tipo = document.getElementById("tipoCuenta").value;
    let saldo = parseFloat(document.getElementById("saldoInicial").value);
    let movimiento = parseFloat(document.getElementById("movimiento").value);
    let unidad = parseInt(document.getElementById("unidadTiempo").value);
    let tiempo = parseInt(document.getElementById("tiempoTotal").value);

    if (nombre == "" || cedula == "" || id == "" || tipo == "" || isNaN(saldo) || isNaN(movimiento) || isNaN(tiempo)) {
        alert("Complete todos los campos");
        return;
    }

    // Tasas promedio Colombia mensual
    let interes = 0;

    if (tipo == "ahorros") interes = 0.004;   // 0.4% mensual
    if (tipo == "corriente") interes = 0.001; // 0.1% mensual
    if (tipo == "cdt") interes = 0.008;       // 0.8% mensual

    let saldoFinal = saldo;

    for (let i = 1; i <= tiempo; i++) {
        saldoFinal += movimiento; // depósito o retiro
        saldoFinal += saldoFinal * interes; // interés mensual

        // Mostrar saldo por periodo
        if (i % unidad == 0) {
            console.log("Saldo en mes " + i + ": " + saldoFinal);
        }
    }

    document.getElementById("resultadoBanco").innerHTML = `
        <h3>Resultado</h3>
        <p><b>Cliente:</b> ${nombre}</p>
        <p><b>Cédula:</b> ${cedula}</p>
        <p><b>ID Cuenta:</b> ${id}</p>
        <p><b>Tipo Cuenta:</b> ${tipo}</p>
        <p><b>Saldo Final:</b> $${saldoFinal.toFixed(2)}</p>
    `;
}

/* 3. ADIVINAR */
let numeroSecreto = Math.floor(Math.random() * 101);
let intentos = 0;
let juegoActivo = true;
let historial = [];

// Permitir ENTER
document.getElementById("numeroUsuario").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        adivinarNumero();
    }
});

function adivinarNumero() {
    if (!juegoActivo) return;

    let inputBox = document.getElementById("numeroUsuario");
    let input = inputBox.value;
    let mensaje = document.getElementById("mensajeAdivinar");
    let intentosTxt = document.getElementById("intentosAdivinar");

    if (input === "*") {
        mensaje.innerHTML = "Juego finalizado. El número era " + numeroSecreto;
        juegoActivo = false;
        return;
    }

    let numero = parseInt(input);
    inputBox.value = ""; // limpiar input

    if (isNaN(numero)) {
        mensaje.innerHTML = "Ingrese un número válido";
        animarError();
        return;
    }

    if (numero < 0 || numero > 100) {
        mensaje.innerHTML = "Error: El número debe estar entre 0 y 100";
        animarError();
        return;
    }

    intentos++;

    let resultado = "";

    if (numero === numeroSecreto) {
        mensaje.innerHTML = "🎉 ¡Felicidades! El número era: " + numeroSecreto;
        mensaje.className = "correcto";
        resultado = "CORRECTO";
        juegoActivo = false;
    } 
    else if (numero < numeroSecreto) {
        mensaje.innerHTML = "El número es MAYOR ↑";
        mensaje.className = "mayor";
        resultado = "↑";
        animarError();
    } 
    else {
        mensaje.innerHTML = "El número es MENOR ↓";
        mensaje.className = "menor";
        resultado = "↓";
        animarError();
    }

    // Guardar historial
    historial.push("Intento " + intentos + ": " + numero + " " + resultado);

    // Mostrar historial
    intentosTxt.innerHTML = "<b>Historial:</b><br>" + historial.join("<br>");

    // Pistas cada 3 intentos
    if (intentos % 3 === 0 && juegoActivo) {
        darPista();
    }
}

// Función pistas
function darPista() {
    let mensaje = document.getElementById("mensajeAdivinar");

    let pista = Math.floor(Math.random() * 3);

    if (pista === 0) {
        mensaje.innerHTML += "<br>Pista: El número es " + (numeroSecreto % 2 === 0 ? "PAR" : "IMPAR");
    } 
    else if (pista === 1) {
        mensaje.innerHTML += "<br>Pista: El número es " + (numeroSecreto > 50 ? "mayor que 50" : "menor o igual que 50");
    } 
    else {
        mensaje.innerHTML += "<br>Pista: Está entre " + (numeroSecreto - 5) + " y " + (numeroSecreto + 5);
    }
}

// Animación cuando se equivoca
function animarError() {
    let inputBox = document.getElementById("numeroUsuario");
    inputBox.classList.add("errorInput");

    setTimeout(() => {
        inputBox.classList.remove("errorInput");
    }, 300);
}

// Mantener cursor siempre en el input
setInterval(() => {
    document.getElementById("numeroUsuario").focus();
}, 500);

/* 4. PRESTAMO */
function calcularPrestamo() {
    let capital = parseFloat(document.getElementById("capital").value);
    let tiempo = parseInt(document.getElementById("tiempo").value);
    let tipo = document.getElementById("tipoInteres").value;
    let momento = document.getElementById("momento").value;
    let tiempoConsulta = parseInt(document.getElementById("tiempoConsulta").value);

    let resultado = document.getElementById("resultadoPrestamo");

    if (!capital || !tiempo || !tipo || !momento) {
        resultado.innerHTML = "Complete todos los campos obligatorios";
        return;
    }

    let t;

    if (momento === "mitad") {
        t = tiempo / 2;
    } else if (momento === "final") {
        t = tiempo;
    } else {
        if (!tiempoConsulta || tiempoConsulta > tiempo) {
            resultado.innerHTML = "Ingrese un tiempo válido";
            return;
        }
        t = tiempoConsulta;
    }

    let interes = 0;
    let total = 0;

    if (tipo === "simple") {
        let tasa = 0.015;
        interes = capital * tasa * t;
        total = capital + interes;
    } 
    else if (tipo === "compuesto") {
        let tasa = 0.02;
        total = capital * Math.pow((1 + tasa), t);
        interes = total - capital;
    }

    resultado.innerHTML = `
        <div class="card p-3">
            <h4>Resultado del préstamo</h4>
            <p><strong>Capital:</strong> $${capital.toFixed(2)}</p>
            <p><strong>Interés generado:</strong> $${interes.toFixed(2)}</p>
            <p><strong>Total a pagar:</strong> $${total.toFixed(2)}</p>
            <p><strong>Tiempo evaluado:</strong> ${t} meses</p>
        </div>
    `;
}

/* 5. TEJADO */
function calcularTejado() {
    let ancho = parseFloat(document.getElementById("ancho").value);
    let fondo = parseFloat(document.getElementById("fondo").value);
    let tipo = document.getElementById("tipoTeja").value;
    let resultado = document.getElementById("resultadoTejado");

    if (!ancho || !fondo || tipo === "") {
        resultado.innerHTML = "Complete todos los campos";
        return;
    }

    let area = ancho * fondo;

    let tamañoTeja = 0;
    let remachesPorTeja = 0;

    switch (tipo) {
        case "1":
            tamañoTeja = 1;
            remachesPorTeja = 4;
            break;
        case "2":
            tamañoTeja = 1.5;
            remachesPorTeja = 6;
            break;
        case "3":
            tamañoTeja = 2;
            remachesPorTeja = 8;
            break;
        case "4":
            tamañoTeja = 2.5;
            remachesPorTeja = 10;
            break;
        case "5":
            tamañoTeja = 3;
            remachesPorTeja = 12;
            break;
    }

    let cantidadTejas = Math.ceil(area / tamañoTeja);

    // Aproximación de líneas (filas)
    let lineas = Math.ceil(fondo);

    let soportes = lineas * 3;
    let remaches = cantidadTejas * remachesPorTeja;

    resultado.innerHTML = `
        <div class="card p-3">
            <h4>Resultado del cálculo</h4>
            <p><strong>Área del tejado:</strong> ${area.toFixed(2)} m²</p>
            <p><strong>Tejas necesarias:</strong> ${cantidadTejas}</p>
            <p><strong>Soportes:</strong> ${soportes}</p>
            <p><strong>Remaches:</strong> ${remaches}</p>
        </div>
    `;
}

/* 6. VENTAS */
let productos = [];

function agregarProducto() {
    let nombre = document.getElementById("nombreProducto").value;
    let precio = parseFloat(document.getElementById("precioProducto").value);
    let cantidad = parseInt(document.getElementById("cantidadProducto").value);
    let tipo = document.getElementById("tipoProducto").value;

    if (!nombre || !precio || !cantidad || !tipo) {
        alert("Complete todos los campos");
        return;
    }

    let iva = 0;

    if (tipo === "general" || tipo === "aseo" || tipo === "tecnologia") {
        iva = 0.19;
    } else {
        iva = 0;
    }

    productos.push({
        nombre: nombre,
        precio: precio,
        cantidad: cantidad,
        tipo: tipo,
        iva: iva
    });

    mostrarProductos();
}

function mostrarProductos() {
    let lista = document.getElementById("listaProductos");
    lista.innerHTML = "<h4>Productos agregados:</h4>";

    productos.forEach(p => {
        lista.innerHTML += `<p>${p.nombre} - Cantidad: ${p.cantidad} - Precio: $${p.precio}</p>`;
    });
}

function calcularVenta() {
    let totalSinIVA = 0;
    let totalIVA = 0;
    let totalArticulos = 0;

    let ivaPorTipo = {
        alimentos: 0,
        general: 0,
        aseo: 0,
        tecnologia: 0,
        libros: 0,
        medicamentos: 0
    };

    productos.forEach(p => {
        let subtotal = p.precio * p.cantidad;
        let ivaProducto = subtotal * p.iva;

        totalSinIVA += subtotal;
        totalIVA += ivaProducto;
        totalArticulos += p.cantidad;

        ivaPorTipo[p.tipo] += ivaProducto;
    });

    let totalConIVA = totalSinIVA + totalIVA;

    document.getElementById("resultadoVenta").innerHTML = `
        <div class="card p-3">
            <h4>Resumen de la Venta</h4>
            <p><strong>Total artículos:</strong> ${totalArticulos}</p>
            <p><strong>Total sin IVA:</strong> $${totalSinIVA.toFixed(2)}</p>
            <p><strong>Total IVA:</strong> $${totalIVA.toFixed(2)}</p>
            <p><strong>Total con IVA:</strong> $${totalConIVA.toFixed(2)}</p>
            <hr>
            <h5>IVA por tipo de producto:</h5>
            <p>Alimentos: $${ivaPorTipo.alimentos.toFixed(2)}</p>
            <p>General: $${ivaPorTipo.general.toFixed(2)}</p>
            <p>Aseo: $${ivaPorTipo.aseo.toFixed(2)}</p>
            <p>Tecnología: $${ivaPorTipo.tecnologia.toFixed(2)}</p>
            <p>Libros: $${ivaPorTipo.libros.toFixed(2)}</p>
            <p>Medicamentos: $${ivaPorTipo.medicamentos.toFixed(2)}</p>
        </div>
    `;
}