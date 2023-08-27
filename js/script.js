const nombreCircuitoForm = document.getElementById("nombreCircuitoForm");
const nombreCircuitoInput = document.getElementById("nombreCircuito");
const botonIngresar = document.querySelector(".botonIngresar");
const tablaDatos = document.getElementById("tablaDatos");

// Aanimación de carga simulada durante 3 segundos cuando se ingresa a la página o cuando se reinicia la aplciación
function mostrarAnimacionCarga() {
  const overlay = document.createElement("div");
  overlay.id = "loading-overlay";
  document.body.appendChild(overlay);

  const loadingContainer = document.createElement("div");
  loadingContainer.className = "loading-container";
  overlay.appendChild(loadingContainer);

  const loadingCircle = document.createElement("div");
  loadingCircle.className = "loading-circle";
  loadingContainer.appendChild(loadingCircle);

  const loadingText = document.createElement("p");
  loadingText.textContent = "CARGANDO EL PROYECTO";
  loadingText.className = "loading-text";
  loadingContainer.appendChild(loadingText);

  const loadingCounter = document.createElement("p");
  loadingCounter.className = "loading-counter";
  loadingCounter.textContent = "Espere... 3 seg";
  loadingContainer.appendChild(loadingCounter);

  // Luego de 3 segundos, mostrará por primera vez la página para el usuario con un mensaje de bienvenida
  let countdown = 3;
  const counterInterval = setInterval(() => {
    countdown--;
    loadingCounter.textContent = "Espere... " + countdown + " seg";
    if (countdown === 0) {
      clearInterval(counterInterval);
      overlay.remove();
      mostrarMensajeBienvenida();
    }
  }, 1000);
  
}

// Mensaje de bienvenida utilizando SweetAlert, que dura 5 segundos y luego desaparece.
function mostrarMensajeBienvenida() {
  Swal.fire({
    icon: "success",
    imageUrl: './assets/img/f1a.gif',
    imageWidth: 400,
    imageHeight: 220,
    imageAlt: 'Custom image',
    title: "¡Bienvenido a QualyAPP!",
    text: "Disfruta de la experiencia.",
    timer: 5000,
    timerProgressBar: true,
    showConfirmButton: false,
  });
}
// Esperar a que se cargue la página y luego muestra la animación de carga
window.addEventListener("load", () => {
  mostrarAnimacionCarga();
});

// Selector de circuitos desde una API externa
function cargarOpcionesSelector() {
  const selector = document.getElementById('nombreCircuito');

  const optionPlaceholder = document.createElement('option');
  optionPlaceholder.value = '';
  optionPlaceholder.textContent = 'Ronda - País y Fecha';
  optionPlaceholder.disabled = true;
  optionPlaceholder.selected = true;

  selector.appendChild(optionPlaceholder);

  fetch("https://ergast.com/api/f1/2023.json")
    .then(response => response.json())
    .then(data => {
      const carreras = data.MRData.RaceTable.Races;

      carreras.forEach(carrera => {
        const fecha = carrera.round;
        const pais = carrera.Circuit.Location.country;
        const dia = new Date(carrera.date);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const diaFormateado = dia.toLocaleDateString('es-AR', options);

        const optionText = `Ronda ${fecha} - ${pais} - ${diaFormateado}`;
        const optionValue = `${fecha}-${pais}-${diaFormateado}`;

        const option = document.createElement('option');
        option.value = optionValue;
        option.textContent = optionText;

        selector.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error al cargar el archivo JSON:', error);
    });
}
//Una vez seleccionado el Circuito muestra la imagen de la bandera de ese país
function mostrarImagenPais(indiceFecha) {
  const banderaImg = document.getElementById("banderaImg");

  if (indiceFecha >= 1 && indiceFecha <= 22) {
    const rutaImagen = "./assets/flags/" + indiceFecha + ".png";
    banderaImg.src = rutaImagen;
    banderaImg.setAttribute("width", "500");
    banderaImg.style.display = "block";
    banderaImg.style.position = "absolute";
    banderaImg.style.top = "135px";
    banderaImg.style.left = "72%";
  } else {
    banderaImg.style.display = "none";
  }
}

let backupCircuito = "";
//Con esto se "escucha" la selección de un circuito y luego de la seleccion se muestra un diálogo de confirmación
nombreCircuitoForm.addEventListener("submit", function (event) {

  event.preventDefault();
  const tablaContenedor = document.getElementById("tablaContenedor");

  const botonActualizar = document.getElementById("botonActualizar");
  botonActualizar.style.display = document.getElementById("nombreCircuito").value !== "" ? "block" : "none";

  let seleccionado = nombreCircuitoInput.value;
  if (seleccionado) {
    const circuitoInfo = seleccionado.split('-');
    const country = circuitoInfo[1].trim();
    if (backupCircuito == "") {
      backupCircuito = seleccionado;
    }
    setTimeout(() => {
      Swal.fire({
        icon: 'question',
        title: 'Elegiste el circuito de\n ' + country,
        text: `¿Confirmas la selección?`,
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
        confirmButtonColor: '#38BA7C',
        cancelButtonColor: '#F34542',
      }).then((result) => {
        if (result.isConfirmed) {
          tablaDatos.innerHTML = "";//Vacía la tabla cunado elegimos un país nuevo
          backupCircuito = seleccionado;
          const mensajeBienvenida = document.getElementById("mensajeBienvenida");
          mensajeBienvenida.textContent = `Final JS - Comisión 43140 | J. Sebastián Rubio`;
          selectedRound = parseInt(circuitoInfo[0]);
          if (selectedRound < 23) {
            Swal.fire({
              icon: 'success',
              title: country,
              color: '#38BA7C',
              imageUrl: './assets/posters/' + selectedRound + '.jpg',
              imageWidth: 256,
              imageHeight: 384,
              imageAlt: 'Custom image',
              text: 'SELECCIONADO CON ÉXITO!',
            });
            mostrarImagenPais(parseInt(seleccionado.split(" ")[0]));
            mostrarSelectorTipo();
          } else {
            Toastify({
              text: "NO SE ENCUENTRAN DATOS PARA EL GRAN PREMIO",
              duration: 3000,
              close: true,
              gravity: "top",
              position: "center",
              style: {
                background: "#F34542",
              },
              stopOnFocus: true
            }).showToast();
            //En el caso de que que el Gran Premio todavía no se corrió, da un mensaje de error con un GIF alusivo y le permite al usuario volver a elegir otra Fecha/Carrera/Circuito
            Swal.fire({
              icon: 'error',
              imageUrl: './assets/img/f1error.gif',
              imageWidth: 400,
              imageHeight: 220,
              imageAlt: 'Custom image',
              title: 'Lo Siento',
              text: 'AUN NO HAY INFORMACIÓN DISPONIBLE DEL GRAN PREMIO SELECCIONADO',
              confirmButtonText: 'VOLVER'
            })
            return; // Salir de la función si el Gran Premio no existe
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          nombreCircuitoInput.value = backupCircuito;
        }
      });
    }, 200);
   
  }
});

// Esto es para mostrar un Toastify cuando cambia la selección en el selector de circuitos. Desaparece después de un segundo
nombreCircuitoInput.addEventListener("change", selectorCambio);
function selectorCambio() {
  const nombreCircuito = document.getElementById('nombreCircuito');
  const seleccionado = nombreCircuito.options[nombreCircuito.selectedIndex].value;

  if (!seleccionado || seleccionado === "Ronda - País y Fecha") {
    mostrarImagenPais(0); // Ocultar la imagen
    return;
  }

  const countryName = seleccionado.split("-")[1].trim();

  Toastify({
    text: `País seleccionado: ${countryName}`,
    duration: 1000,
    close: true,
    gravity: "top",
    position: "right",
    style: {
      background: "chartreuse",
    },
    stopOnFocus: true
  }).showToast();

}

//Con esto se "escucha" el evento de confirmación del tipo de tabla que el usuario quiere ver (Clasificación o Carrera)
document.getElementById("btnConfirmarTipo").addEventListener("click", function () {
  const selectedTipo = document.getElementById("tipoSelector").value;

  if (selectedTipo === "clasificacion") {
    cargarDatos(`https://ergast.com/api/f1/2023/${selectedRound}/qualifying.json`, true);

  } else if (selectedTipo === "carrera") {
    cargarDatos(`https://ergast.com/api/f1/2023/${selectedRound}/results.json`, false);
  }
});

// Función para actualizar la página con un GIF alusivo y reiniciarla
document.getElementById("botonActualizar").addEventListener("click", actualizarPagina);
function actualizarPagina() {
  setTimeout(() => {
    Swal.fire({
      icon: 'info',
      title: 'ESTAS POR REINICIAR LA APLICACION',
      text: `¿Confirmas la selección?`,
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      confirmButtonColor: '#38BA7C',
      cancelButtonColor: '#F34542',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
        icon: 'info',
        title: 'REINICIANDO APLICACION',
        text: 'Presiona "OK" para continuar con el Reinicio',
        imageUrl: './assets/img/f1reset.gif',
        imageWidth: 400,
        imageHeight: 220,
        imageAlt: 'Custom image',
      }).then(() => {
        //Mensaje de espera de 3 segundos que se muestra al usuario notificandole del reinicio de la aplicación
        Toastify({
          text: "LA APLICACION SE REINICIARA AUTOMATICAMENTE DESPUES DE 3 SEGUNDOS",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          style: {
            background: "linear-gradient(to right, #c92e46, #F34542)",
            color: "white",
          },
          stopOnFocus: true
        }).showToast();
        setTimeout(() => {
          location.reload();
        }, 3000);
      });
      } else {
        return; // Salir de la función si el Gran Premio no existe
      }
    });
  }, 200);
}
// Con esta función se muestra el selector de tipo de tabla que se quiere elegir y el botón de confirmación
function mostrarSelectorTipo() {
  const tipoSelector = document.getElementById("tipoSelector");
  const btnConfirmarTipo = document.getElementById("btnConfirmarTipo");

  tipoSelector.innerHTML = "";

  const opcionBlanco = document.createElement("option");
  opcionBlanco.value = "";
  opcionBlanco.textContent = "Elija los datos a mostrar";
  tipoSelector.appendChild(opcionBlanco);

  const opcionClasificacion = document.createElement("option");
  opcionClasificacion.value = "clasificacion";
  opcionClasificacion.textContent = "Clasificación";
  tipoSelector.appendChild(opcionClasificacion);

  const opcionCarrera = document.createElement("option");
  opcionCarrera.value = "carrera";
  opcionCarrera.textContent = "Carrera";
  tipoSelector.appendChild(opcionCarrera);

  tipoSelector.style.display = "block";
  btnConfirmarTipo.style.display = "block";
}
// Carga los datos que haya seleccionado el usuario (clasificación o carrera) trayendo la informacion elegida desde la  API y muestra todo en una tabla (1 para clasificacion y otra para carrera por la diferencia de datos que traen)
function cargarDatos(url, isClasificacion) {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const datos = isClasificacion ? data.MRData.RaceTable.Races[0].QualifyingResults : data.MRData.RaceTable.Races[0].Results;
      tablaDatos.innerHTML = "";

      const encabezados = isClasificacion
        ? ["POSICION", "PILOTO", "EQUIPO", "Q1", "Q2", "Q3"]
        : ["POSICION", "PILOTO", "EQUIPO", "TIEMPO TOTAL", "STATUS"];

      const encabezadosRow = document.createElement("tr");
      encabezados.forEach(headerText => {
        const th = document.createElement("th");
        th.textContent = headerText;
        encabezadosRow.appendChild(th);
      });
      tablaDatos.appendChild(encabezadosRow);
      // Estructura de la fila con los datos de cada piloto, aqui se incluye al boton INFO para luego si el usuario lo requiere pida información personal de ese piloto 
      datos.forEach(item => {
        let imgPiloto = `./assets/img/${item.Driver.permanentNumber}.png`;
        let imgMiniatura = `<div id=info"></div><button class="button btn-info">
        <svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 576 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><style>svg{fill:#ededed}</style><path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm80 256h64c44.2 0 80 35.8 80 80c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16c0-44.2 35.8-80 80-80zm-32-96a64 64 0 1 1 128 0 64 64 0 1 1 -128 0zm256-32H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s7.2-16 16-16z"/></svg>INFO</button><img src="${imgPiloto}" alt="Imagen del piloto" class="imagenPiloto" id="imgModal">`;

        let fila = document.createElement("tr");
        let tiempo = isClasificacion ? [item.Q1 || '', item.Q2 || '', item.Q3 || ''] : [item.Time ? item.Time.time : '', item.status || ''];
        fila.innerHTML = `
          <td>${item.position}</td>
          <td><div class="piloto-cell">${imgMiniatura}<span>${item.Driver.givenName} ${item.Driver.familyName}</div></span></td>
          <td>${item.Constructor ? item.Constructor.name.toUpperCase() : ''}</td>
          ${tiempo.map(t => `<td>${t}</td>`).join('')}
        `;
        tablaDatos.appendChild(fila);
        //Con esto lo que se genera SOLO EN CLASIFICACION NO ASI EN CARRRERA, es una linea posterior al puesto 10 (los que se cayeron en la Q2) y otra linea posterior al puesto 15 (los que se cayeron en la Q1).
        //A nivel reglas en F1, para que se entienda, los pilotos tienen 3 tandas posibles de clasficaciones para que se den las posiciones de largada para el día siguiente.
        //Se corre primero la Q1, y pasan los primeros 15 mejores tiempos de clasificación, luego se corre la Q2 y pasan los primeros 10 mejores tiempos de clasificación,
        //y por último se corre la Q3, que son los 10 mejores que pasaron la Q1 y la Q2 de la ronda de clasificación buscando un mejor tiempo para la carrera.
        //Por lo que las rondas de clasificaciones son eliminatorias. Por eso se notará en la lista que los que se cayeron en la Q1 solo tienen un tiempo de vuelta (su mejor tiempo en esa sesión),
        //los que se cayeron en la Q2 solo tienen 2 tiempos de vuelta, uno en Q1 y el otro en Q2 (su mejor tiempo de cada una de esas sesiones)
        //y por último figuran los 10 primeros con tiempos en las 3 sesiones (Q1, Q2 y Q3). 
        //Puede pasar que en Q1, Q2 o Q3, no haya tiempos reflejados para un piloto en particular ya que puede pasar que ese piloto en particular haya tenido algún tipo de problema 
        //y no pudo haber tirado algún tiempo para esa sesión.
        if (isClasificacion) {
          if (item.position == 10) {
            fila.classList.add("top10");
          }
          if (item.position == 15) {
            fila.classList.add("top15");
          }
        }
      });

      const tablaContenedor = document.getElementById("tablaContenedor");
      tablaContenedor.style.display = "block";
      tablaContenedor.style.marginTop = "20px";
      
      //Aqui está la información personal de cada piloto, es sólo INFORMACION PERSONAL para luego poder plasmarla en la CARD PERSONAL
      const pilotosJson = 'https://raw.githubusercontent.com/DowoDev/qinquela-43140-JS/main/js/pilotos.json';

      //Con esta función es como busco los datos de esa API y que se puede llegar a usar para generar la CARD PERSONAL
      async function fetchDataPilotos() {
        try {
          const respuesta = await fetch(pilotosJson);
          const datospilotos = await respuesta.json();
      
          const tarjetas = datospilotos.MRData.DriverTable.Drivers;
      
          let datosExtraidos = tarjetas.map(piloto => ({
            permanentNumber: piloto.permanentNumber,
            driverId: piloto.driverId,
            givenName: piloto.givenName,
            familyName: piloto.familyName,
            country: piloto.country,
            countryPic: piloto.countryPic,
            grands_prix_entered: piloto.grands_prix_entered,
            world_championships: piloto.world_championships,
            podiums: piloto.podiums,
            career_points: piloto.career_points,
            Constructors_Carreer: piloto.season,
            Constructor_name: piloto.name,
            logo: piloto.logo,
            pic: piloto.pic,
            picNumber: piloto.picNumber,
            helmet:piloto.helmet,
            season: piloto.season,
            races_won: piloto.races_won,
            wiki: piloto.wiki
          }));
          
          return datosExtraidos;
          
        } catch (error) {
          console.error('Error al extraer los datos:', error);
          return [];
        }
      }
      
      // Llamar a la función y se obtienen los datos
      fetchDataPilotos().then(data => {
        // Escuchamos el evento de los botones "INFO" y dependiendo de la posicion del piloto en la tabla cruza informacion con los datos de Carrera o Clasificacion y busca a ese piloto particular y trae sus datos personales
        let infoPiloto = document.getElementsByClassName("btn-info");
        
        for (let index = 0; index < infoPiloto.length; index++) {
          infoPiloto[index].addEventListener("click", () => {
            const pilotoData = data.find(piloto => piloto.driverId === datos[index].Driver.driverId);
            if (pilotoData) {
              setTimeout(() => {
                mostrarTarjetaPiloto(pilotoData); // muestra la CARD PERSONAL del piloto solicitado
              }, 200);
            } else {
              console.error(`No se encontró el piloto con driverId ${datos[index].Driver.driverId} en los datos.`);
            }

          });
        }
      });
      
      // Con esa función se arma la CARD PERSONAL con información del piloto que seleccionó el usuario
      function mostrarTarjetaPiloto(pilotoData) {
        const overlayContainer = document.createElement("div");
        overlayContainer.classList.add("overlayContainer");
        overlayContainer.style.display = "block";

        const cardContainer = document.createElement("div");
        cardContainer.classList.add("card-container");

        const closeBtn = document.createElement("button");
        closeBtn.classList.add("close-btn");
        closeBtn.innerHTML = "<i class='bx bx-x'></i>&nbsp&nbsp&nbspCERRAR";
        closeBtn.addEventListener("click", () => {
          setTimeout(() => {
            overlayContainer.style.display = "none";
            cardContainer.remove();
          }, 300);
        });

        const pilotoImg = document.createElement("img");
        pilotoImg.className = "pilotoImg";
        pilotoImg.src = pilotoData.pic;
        pilotoImg.alt = pilotoData.givenName + " " + pilotoData.familyName;

        const containerImg = document.createElement("p")
        containerImg.className="containerImg";
        containerImg.innerHTML = "<img class=containerImg2 src="+pilotoData.pic+"></img>";

        const pilotoName = document.createElement("h2");
        pilotoName.innerHTML = "<span class=nombre>"+pilotoData.givenName + " " + pilotoData.familyName+"</span>";

        const pilotoNumber = document.createElement("img");
        pilotoNumber.className = "pilotoNumber";
        pilotoNumber.src = pilotoData.picNumber;

        const helmet = document.createElement("img");
        helmet.className = "helmet";
        helmet.src = pilotoData.helmet;

        const wiki = document.createElement("p");
        wiki.className = "wiki";
        wiki.innerHTML  = "<a href="+pilotoData.wiki+" target=_blank><i class='bx bxl-wikipedia'></i>Wikipedia</a>";
        
        wiki.addEventListener("click", (event) => {
          event.preventDefault();
          setTimeout(() => {
            window.open(pilotoData.wiki, "_blank");
          }, 300);
        });

        const countryImg = document.createElement("img");
        countryImg.className = "countryImg";
        countryImg.src = pilotoData.countryPic;
        countryImg.alt = pilotoData.country;

        const constructorName = document.createElement("p");
        constructorName.innerHTML = "Constructor: " + "<span>"+pilotoData.Constructor_name+"</span>";

        const season = document.createElement("p");
        season.innerHTML  = "Temporada: " + "<span>" + pilotoData.season+"</span>";

        const racesWon = document.createElement("p");
        racesWon.innerHTML  = "Carreras ganadas: " + "<span>" + pilotoData.races_won+"</span>";

        const championships = document.createElement("p");
        championships.innerHTML  = "Campeonatos: " + "<span>" + pilotoData.world_championships+"</span>";

        document.body.appendChild(overlayContainer);
        document.body.appendChild(cardContainer);
        cardContainer.appendChild(closeBtn);
        cardContainer.appendChild(containerImg);
        // cardContainer.appendChild(pilotoImg);
        cardContainer.appendChild(pilotoName);
        cardContainer.appendChild(pilotoNumber);
        cardContainer.appendChild(helmet);
        cardContainer.appendChild(countryImg);
        cardContainer.appendChild(constructorName);
        cardContainer.appendChild(season);
        cardContainer.appendChild(racesWon);
        cardContainer.appendChild(championships);
        cardContainer.appendChild(wiki);
        
      }
      //Mensaje de Toastify que se envía cuando se cargan los datos de la Tabla de Clasificación o Carrera según lo que haya elegido el usuario
      Toastify({
        text: "LOS DATOS SOLICITADOS HAN SIDO CARGADOS EXITOSAMENTE",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
          top: '50% !important',
        },
        stopOnFocus: true,
      }).showToast();
      localStorage.setItem("datosCarrera", JSON.stringify(datos));
      localStorage.setItem("datosPilotos", JSON.stringify(pilotosJson));
    })

    .catch(error => {
      Toastify({
        text: "NO SE ENCUENTRAN DATOS PARA EL GRAN PREMIO",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        style: {
          background: "#f44336",
        },
        stopOnFocus: true
      }).showToast();
      Swal.fire({
        icon: 'error',
        imageUrl: './assets/img/f1error.gif',
        imageWidth: 400,
        imageHeight: 220,
        imageAlt: 'Custom image',
        title: 'Lo Siento',
        text: 'AUN NO HAY INFORMACIÓN DISPONIBLE DEL GRAN PREMIO SELECCIONADO',
        confirmButtonText: 'VOLVER'
      }).then(() => {
        return; // Salir de la función si el Gran Premio no existe
      });
      return; // Salir de la función si el Gran Premio no existe
    });
}
// Carga las opciones del selector de circuitos al cargar la página
cargarOpcionesSelector();
// Llama a la función para el cambio en el selector de circuitos al cargar la página
selectorCambio();


/*----------------------------------------------------------------------------------*/




