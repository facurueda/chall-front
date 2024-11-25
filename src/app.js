export const API_URL = "localhost:3000";

const video = document.getElementById("video");
const socket = new WebSocket(`ws://${API_URL}/`);

let currentState = "pause";

// Escuchar mensajes del servidor
socket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (message.type === "state") {
    const { action } = message.data;

    if (action === "play" && video.paused) {
      video.play();
    } else if (action === "pause" && !video.paused) {
      video.pause();
    }
  }
};

// Detectar eventos del reproductor de video
if (video) {
  video.addEventListener("play", () => {
    if (currentState !== "play") {
      currentState = "play";
      socket.send(
        JSON.stringify({ type: "control", data: { action: "play" } })
      );
    }
  });

  video.addEventListener("pause", () => {
    if (currentState !== "pause") {
      currentState = "pause";
      socket.send(
        JSON.stringify({ type: "control", data: { action: "pause" } })
      );
    }
  });
}

// Obtener ubicacion para el clima, en el caso que lo rechace poner la de buenos aires por defecto
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      actionGetWeather(`${latitude},${longitude}`);
    },
    function (error) {
      actionGetWeather("-34.61315,-58.37723");
    }
  );
} else {
  console.log("Geolocalización no soportada en este navegador.");
}

export const actionGetWeather = async (coords) => {
  // Mostrar el loader y ocultar el contenido del clima
  document.querySelector(".loader").style.display = "block";
  document.querySelector(".weather-container").style.visibility = "hidden";

  try {
    const getData = await fetch(`http://${API_URL}/weather?coords=${coords}`);
    const formatData = await getData.json();
    document.getElementById("city").textContent = formatData.location;
    document.getElementById("temp").textContent = formatData.temp;
    document.getElementById("weather-icon").src = formatData.icon;

    // Ocultar el loader y mostrar el contenido del clima
    document.querySelector(".loader").style.display = "none";
    document.querySelector(".weather-container").style.visibility = "visible";
  } catch (error) {
    console.log("Error al obtener datos del clima:", error);
  }
};
