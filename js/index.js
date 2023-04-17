// Obtener los elementos del DOM que se utilizarán
const mensaje = document.querySelector("#mensaje");
const formulario = document.querySelector("#formulario");

const result = document.querySelector('.result');
const form = document.querySelector('.get-weather');
const nameCity = document.querySelector('#city');
const nameCountry = document.querySelector('#country');

// Agregar evento de submit al formulario
form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validar que los campos de ciudad y país no estén vacíos
    if (nameCity.value === '' || nameCountry.value === '') {
        showError('Ambos campos son obligatorios...');
        return;
    }

    callAPI(nameCity.value, nameCountry.value);
    
})

// Función para llamar a la API de OpenWeatherMap
function callAPI(city, country){
    const apiId = '97bfcaaa4ed2a81f2bf3346eee2e0478';
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${apiId}`;

// Hacer una solicitud a la API y obtener la respuesta en formato JSON
    fetch(url)
        .then(data => {
            return data.json(); // Convertir la respuesta a formato JSON
        })
        .then(dataJSON => {
            if (dataJSON.cod === '404') { // Si la ciudad no se encuentra, mostrar mensaje de error
                showError('Ciudad no encontrada...');

            } else { // Si la ciudad se encuentra, mostrar información del clima
                clearHTML(); // Limpiar cualquier información anterior en el contenedor de resultados
                showWeather(dataJSON); // Mostrar la información del clima en el contenedor de resultados
            }
            //console.log(dataJSON);
        })
        .catch(error => {
            console.log(error);
        })
}

// Función para mostrar la información del clima en el contenedor de resultados
function showWeather(data){
    const {name, main:{temp, temp_min, temp_max}, weather:[arr]} = data;

    const degrees = kelvinToCentigrade(temp);
    const min = kelvinToCentigrade(temp_min);
    const max = kelvinToCentigrade(temp_max);

    // Crear un elemento HTML que muestre la información del clima
    const content = document.createElement('div');
    content.innerHTML = `
        <h5>Clima en ${name}</h5>
        <img src="https://openweathermap.org/img/wn/${arr.icon}@2x.png" alt="icon">
        <h2>${degrees}°C</h2>
        <p>Max: ${max}°C</p>
        <p>Min: ${min}°C</p>
    `;

    result.appendChild(content);
}

// Función para mostrar un mensaje de error
function showError(message){
    //console.log(message);
    const alert = document.createElement('p');
    alert.classList.add('alert-message');
    alert.innerHTML = message;

    form.appendChild(alert);
    setTimeout(() => {
        alert.remove();
    }, 3000);
}

function kelvinToCentigrade(temp){
    return parseInt(temp - 273.15);
}

function clearHTML(){
    result.innerHTML = '';
}

// Función de orden superior para ejecutar una función con validación
function ejecutarConValidacion(fn) {
  return function (...args) {
    const { value: nombre } = document.querySelector("#nombre");
    const { value: apellido } = document.querySelector("#apellido");

    // Validar que el nombre y apellido contengan solo letras
    if (!/^[a-zA-Z ]+$/.test(nombre) || !/^[a-zA-Z ]+$/.test(apellido)) {
      mensaje.textContent = "El nombre y apellido solo pueden contener letras.";
      return;
    }

    return fn(...args);
  }
}

// Cargar los datos del LocalStorage al cargar la página
window.addEventListener("load", () => {
  const nombre = localStorage.getItem("nombre");
  const apellido = localStorage.getItem("apellido");
  const nivel = localStorage.getItem("nivel");
  const fechaInicio = localStorage.getItem("fechaInicio");

  if (nombre && apellido && nivel && fechaInicio) {
    const edad = localStorage.getItem("edad");
    const data = {
      nombre: nombre,
      apellido: apellido,
      edad: edad,
      nivel: nivel,
      fechaInicio: fechaInicio,
    };

    const resultado = inscribirseEnTenis(nombre, apellido, nivel, fechaInicio, edad);
    mensaje.textContent = resultado;
  }
})


// Manejar el envío del formulario
formulario.addEventListener("submit", (event) => {
  event.preventDefault();

  // Obtener los datos del formulario
  const { value: nombre } = document.querySelector("#nombre");
  const { value: apellido } = document.querySelector("#apellido");
  const { value: edad } = document.querySelector("#edad");
  const { value: nivel } = document.querySelector("#nivel");
  const { value: fechaInicio } = document.querySelector("#fechaInicio");


  // Crear un objeto con los datos del formulario
  const data = {
    nombre: nombre,
    apellido: apellido,
    edad: edad,
    nivel: nivel,
    fechaInicio: fechaInicio,
  };

  // Validar los datos del formulario

  //Nivel Tenístico
  //Se convierte el objeto data en una cadena JSON y se imprime en la consola
  const jsonString = JSON.stringify(data);
  console.log(data);
  
  //Se valida que se haya seleccionado un nivel de tenis
  if (!nivel) {
    mensaje.textContent = "Seleccione un nivel.";
    return;
  }

  //Inicio de la actividad
  //Se valida que se haya seleccionado una fecha de inicio
  if (!fechaInicio) {
    mensaje.textContent = "Seleccione una fecha de inicio.";
    return;
  }

  //Se valida que la fecha de inicio sea posterior a la fecha actual
  const hoy = new Date();
  const fechaInicioDate = new Date(fechaInicio);
  if (fechaInicioDate <= hoy) {
    mensaje.textContent = "La fecha de inicio debe ser posterior a la fecha actual.";
    return;
  }

  //Se almacenan los datos en el Local Storage del navegador
  localStorage.setItem("nombre", nombre);
  localStorage.setItem("apellido", apellido);
  localStorage.setItem("edad", edad);
  localStorage.setItem("nivel", nivel);
  localStorage.setItem("fechaInicio", fechaInicio);

  //Se llama a la función inscribirseEnTenis con los datos ingresados
  const resultado = inscribirseEnTenis(nombre, apellido, nivel, fechaInicio, edad);

  //Se muestra el resultado de la función en el mensaje de la página
  mensaje.textContent = resultado;
});


//Precio segun los dias
//Se define una función que devuelve una promesa que calcula el precio total de la reserva
function calcularPrecioTotal(diasReserva, nivel, edad) {
  return new Promise((resolve, reject) => {
    const precios = {
      1: 100,
      2: 175,
      3: 270,
      4: 380,
      5: 490,
    };
    let errorMensaje = "";

    if (nivel === "escuelita") {
      if (edad < 5 || edad > 11) {
        errorMensaje = "Lo sentimos, la Escuelita de Tenis es para niños entre 5 y 11 años.";
      }
    } else {
      if (isNaN(diasReserva)) {
        errorMensaje = "Ingrese un número válido de días de reserva.";
      } else {
        diasReserva = parseInt(diasReserva);
      }
    }

    if (errorMensaje) {
      reject(errorMensaje);
    }

    const precioTotal = precios[diasReserva];
    resolve(precioTotal);
  });
}

//Función que se llama al hacer clic en el botón de "Inscribirse"
//Se llama a la función calcularPrecioTotal y se devuelve una promesa con el resultado
function inscribirseEnTenis(nombre, apellido, nivel, fechaInicio, edad) {

  const hoy = new Date();
  let diasReserva = 1;

  if (nivel === "escuelita") {
    if (edad < 5 || edad > 11) {
      return Promise.reject("Lo sentimos, la Escuelita de Tenis es para niños entre 5 y 11 años.");
    }
    diasReserva = 2;
  } else {
    const diasInput = document.querySelector("#diasReserva").value;
    diasReserva = parseInt(diasInput);
  }

  return calcularPrecioTotal(diasReserva, nivel, edad)
    .then((precioTotal) => {
      return `¡Felicidades ${nombre} ${apellido}! Te has inscripto en las clases de tenis. El precio total de tu reserva por ${diasReserva} día(s) es de ${precioTotal} dólares.`;
    })
    .catch((error) => {
      return error;
    })
    .then(resultado => {
      mensaje.textContent = resultado;
    })
    .catch(error => {
      mensaje.textContent = error;
    });
}