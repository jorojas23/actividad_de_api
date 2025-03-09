const apiUrl = "http://127.0.0.1:8000"; // URL de tu API de FastAPI
const botonEL = document.getElementById("boton");
let datosSerie = []
const buscarEl = document.getElementById("buscar");
const detalleEL = document.getElementById("serie-container")


// Función para obtener y mostrar la lista de series
async function cargarSeries() {
    try {
        const respuesta = await fetch(`${apiUrl}/personajes/`);
        console.log(respuesta)
        const series = await respuesta.json();
        datosSerie = series
    } catch (error) {
        console.error("Error al cargar las series:", error);
        listaSeries.innerHTML = "<li>Error al cargar las series.</li>";
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
                    <p><strong>Año de Transmisión:</strong> ${serie.año_de_transmision}</p>
                    <p><strong>Año de Finalización:</strong> ${serie.año_de_finalizacion}</p>
                </div>
        `;
    } catch (error) {
        console.error("Error al cargar los detalles de la serie:", error);
        detalleEL.innerHTML = "<p>Error al cargar los detalles de la serie.</p>";
    }
}
botonEL.addEventListener("click",()=>{
    const text = buscarEl.value
    console.log(datosSerie)
    const peliculasFiltradas=datosSerie.filter(titulo=>titulo.titulo.toLowerCase().includes(text))
    console.log(text)
    console.log(peliculasFiltradas)
    mostrarDetallesSerie(peliculasFiltradas);
  
})

// Cargar las series cuando la página se cargue
window.onload = cargarSeries;