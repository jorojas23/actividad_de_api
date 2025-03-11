const apiUrl = "http://127.0.0.1:8000"; // URL de tu API de FastAPI
const botonEL = document.getElementById("boton");
let datosSerie = []
const buscarEl = document.getElementById("buscar");
const detalleEL = document.getElementById("serie-container")
const botonAggEL = document.getElementById("guardar")
const boton = document.getElementById('boton');
const dialog = document.getElementById('dialog');
const dialogEliminar = document.getElementById('dialog-eliminar');
const dialogañadir = document.getElementById("anadir")
const overlay = document.getElementById('overlay');
const cerrarDialogo = document.getElementById('cerrar-dialogo');
const confirmarEliminar = document.getElementById('confirmar-eliminar');
const anadir = document.getElementById('agregar-datos');

let id 
//se define la clase
class Serie {
    constructor(lista) {
        this.id = ++id;  
        this.titulo = lista.elements["titulo"].value;
        this.foto = lista.elements["foto"].value;
        this.creador = lista.elements["creador"].value;
        this.cantidad_de_temporadas = lista.elements["cantidad_de_temporadas"].value;
        this.personajes_principales = lista.elements["personajes_principales"].value.split(",");
        this.valoracion = lista.elements["valoracion"].value;
        this.ano_de_transmision = lista.elements["ano_de_transmision"].value;
        this.ano_de_finalizacion = lista.elements["ano_de_finalizacion"].value;
    }
}
function cargarDatosEnFormulario(serie) {
    const serieContainer = document.getElementById("serie-container");
    const titulo = serieContainer.querySelector("h1").innerText;
    const imagen = serieContainer.querySelector(".image img").src;
    const descripcion = serieContainer.querySelector(".decribcion");
    const creador = descripcion.querySelector("p:nth-child(1)").innerText.replace("Creador: ", "");
    const temporadas = descripcion.querySelector("p:nth-child(2)").innerText.replace("Cantidad de temporadas: ", "");
    const personajes = descripcion.querySelector("p:nth-child(3)").innerText.replace("Personajes principales: ", "");
    const valoracion = descripcion.querySelector("p:nth-child(4)").innerText.replace("Valoración: ", "");
    const anoTransmision = descripcion.querySelector("p:nth-child(5)").innerText.replace("Año de transmisión: ", "");
    const anoFinalizacion = descripcion.querySelector("p:nth-child(6)").innerText.replace("Año de finalización: ", "");

    // Obtener el formulario
    const formulario = document.getElementById("formulario-editar");

    // Cargar los datos en el formulario
    formulario.elements["titulo"].value = titulo;
    formulario.elements["foto"].value = imagen;
    formulario.elements["creador"].value = creador;
    formulario.elements["cantidad_de_temporadas"].value = temporadas;
    formulario.elements["personajes_principales"].value = personajes;
    formulario.elements["valoracion"].value = valoracion;
    formulario.elements["ano_de_transmision"].value = anoTransmision;
    formulario.elements["ano_de_finalizacion"].value = anoFinalizacion;
}

async function actualizarDetalleSerie(id, datosActualizados) {
    try {
      const respuesta = await fetch(`${apiUrl}/personajes/${id}`, {
        method: "PUT", // O "PATCH" si prefieres actualizaciones parciales
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosActualizados),
      });
  
      if (!respuesta.ok) {
        throw new Error(`Error al actualizar el elemento: ${respuesta.status}`);
      }
  
      const elementoActualizado = await respuesta.json();
      console.log("Elemento actualizado:", elementoActualizado);
      return elementoActualizado; // Devuelve el elemento actualizado
  
    } catch (error) {
      console.error("Error al actualizar el elemento:", error);
      return null; // Indica que hubo un error
    }
  }
// Funcion para actualizar los datos
async function aggDetalleSerie(serie) {
    try {
        const respuesta = await fetch(`${apiUrl}/personajes/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(serie),
        });
        if (!respuesta.ok) {
            throw new Error(`Error al agregar la serie: ${respuesta.status}`);
        }
        await cargarSeries()
        const serieAgregada = await respuesta.json();
        console.log('Serie agregada:', serieAgregada);
    } catch (error) {
        console.error("Error al agregar la serie:", error);
    }
}

async function eliminarElementoAPI(id) {
    try {
            const respuesta = await fetch(`${apiUrl}/personajes/${id}`, {
            method: "DELETE",
            });

            if (!respuesta.ok) {
            throw new Error(`Error al eliminar el elemento: ${respuesta.status}`);
            }
            await cargarSeries()
            console.log(`Elemento con ID ${id} eliminado correctamente.`);
            
            return true; // Indica que el elemento fue eliminado correctamente
    } catch (error) {
        console.error("Error al eliminar el elemento:", error);
        return false; // Indica que hubo un error al eliminar el elemento
    }
}

// Función para obtener y mostrar la lista de series
async function cargarSeries() {
    try {
        const respuesta = await fetch(`${apiUrl}/personajes/`);
        console.log(respuesta)
        const series = await respuesta.json();
        datosSerie = series
        id = datosSerie[datosSerie.length-1].id

    } catch (error) {
        console.error("Error al cargar las series:", error);
        listaSeries.innerHTML = "<li>Error al cargar las series.</li>";
    }
}

async function actualizarSerie(id, datosActualizados) {
    try {
        const respuesta = await fetch(`${apiUrl}/personajes/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(datosActualizados),
        });

        if (!respuesta.ok) {
            throw new Error(`Error al actualizar la serie: ${respuesta.status}`);
        }

        const resultado = await respuesta.json();
        console.log("Serie actualizada:", resultado);

        // Recargar la lista de series después de actualizar
        await cargarSeries();

        // Ocultar el formulario de edición
        dialog.style.display = 'none';
        overlay.style.display = 'none';
    } catch (error) {
        console.error("Error al actualizar la serie:", error);
    }
}



// Función para mostrar los detalles de una serie específica
async function mostrarDetallesSerie(titulo) {
    try {
        const respuesta = await fetch(`${apiUrl}/personajes/${titulo[0].id}`);
        const serie = await respuesta.json();

        // Mostrar los detalles en el HTML
        detalleEL.innerHTML = `
            <h1>${serie.titulo}</h1>
            <div class="container-second">
                <div class="image">
                    <img src="${serie.foto}" alt="${serie.titulo}" width="200px">
                </div>
                <div class="decribcion">
                    <p><strong>Creador:</strong> ${serie.creador}</p>
                    <p><strong>Temporadas:</strong> ${serie.cantidad_de_temporadas}</p>
                    <p><strong>Personajes Principales:</strong> ${serie.personajes_principales.join(", ")}</p>
                    <p><strong>Valoración:</strong> ${serie.valoracion}</p>
                    <p><strong>Año de Transmisión:</strong> ${serie.ano_de_transmision}</p>
                    <p><strong>Año de Finalización:</strong> ${serie.ano_de_finalizacion}</p>
                    <button id="editar-datos" data-id="${serie.id}">Editar</button>
                    <button id="eliminar-datos" data-id="${serie.id}">Eliminar</button>
                </div>
        `;
        const eliminar = document.getElementById('eliminar-datos');
        const editar = document.getElementById('editar-datos');
        eliminar.addEventListener('click', () => {
            dialogEliminar.style.display = 'block';
            overlay.style.display = 'block';
        });
        confirmarEliminar.addEventListener("click", () => {
            const id = eliminar.dataset.id;
            console.log(id)
            eliminarElementoAPI(id);
        });
        editar.addEventListener('click', () => {
            const h3 = document.querySelector('#dialog h3');
            h3.innerHTML = 'editar datos';
            console.log("hola")
            cargarDatosEnFormulario()
            botonAggEL.dataset.id = editar.dataset.id
            dialog.style.display = 'block';
            overlay.style.display = 'block';
        });
    } catch (error) {
        console.error("Error al cargar los detalles de la serie:", error);
        detalleEL.innerHTML = "<p>Error al cargar los detalles de la serie.</p>";
    }
}
botonEL.addEventListener("click",()=>{
    const text = buscarEl.value
    console.log(datosSerie)
    const peliculasFiltradas=datosSerie.filter(titulo=>titulo.titulo.toLowerCase().includes(text))
    console.log(peliculasFiltradas)
    
    mostrarDetallesSerie(peliculasFiltradas);
  
})

botonAggEL.addEventListener("click", (e) => {
    const formulario = document.getElementById("formulario-editar");
    const serie = new Serie(formulario);
    console.log("hola")
    if (e.currentTarget.dataset.id == 0) {
        aggDetalleSerie(serie);
    }else{
        actualizarSerie(e.currentTarget.dataset.id, serie);
    }
    
});


dialogañadir.addEventListener('click', () => {
    const h3 = document.querySelector('#dialog h3');
    h3.innerHTML = 'añadir datos';
    
    botonAggEL.dataset.id = 0
    dialog.style.display = 'block';
    overlay.style.display = 'block';
});


cerrarDialogo.addEventListener('click', () => {

    dialog.style.display = 'none';
    overlay.style.display = 'none';
});

document.getElementById('cancelar-eliminar').addEventListener('click', () => {
    dialogEliminar.style.display = 'none';
    overlay.style.display = 'none';
});

document.getElementById('confirmar-eliminar').addEventListener('click', () => {
    alert("Elemento eliminado.");
    dialogEliminar.style.display = 'none';
    overlay.style.display = 'none';
});

// Cerrar el overlay al hacer clic en él
overlay.addEventListener('click', () => {
    dialog.style.display = 'none';
    dialogEliminar.style.display = 'none';
    overlay.style.display = 'none';
});

// Cargar las series cuando la página se cargue
window.onload = cargarSeries