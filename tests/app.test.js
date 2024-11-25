/**
 * @jest-environment jsdom
 */

const { actionGetWeather, API_URL } = require("../src/app");

describe("actionGetWeather", () => {
  beforeEach(() => {
    document.body.innerHTML = `
    <div class="loader" style="display: none;"></div>
    <div class="weather-container" style="visibility: visible;"></div>
    <div id="city"></div>
    <div id="temp"></div>
    <img id="weather-icon" />
    `;
  });

  it("debería mostrar el loader y ocultar el contenedor del clima al comenzar", async () => {
    await actionGetWeather("-34.61315,-58.37723");

    expect(document.querySelector(".loader").style.display).toBe("block");
    expect(document.querySelector(".weather-container").style.visibility).toBe(
      "hidden"
    );
  });

  it("debería actualizar el DOM con los datos del clima", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            location: "Buenos Aires",
            temp: "25°C",
            icon: "icon.png",
          }),
      })
    );

    await actionGetWeather("-34.61315,-58.37723");

    expect(document.getElementById("city").textContent).toBe("Buenos Aires");
    expect(document.getElementById("temp").textContent).toBe("25°C");
    expect(document.getElementById("weather-icon").src).toContain("icon.png");
  });

  it("debería manejar errores correctamente", async () => {
    global.fetch = jest.fn(() => Promise.reject("Error al obtener datos"));

    const consoleSpy = jest.spyOn(console, "log");

    await actionGetWeather("-34.61315,-58.37723");

    expect(consoleSpy).toHaveBeenCalledWith(
      "Error al obtener datos del clima:",
      "Error al obtener datos"
    );
  });
});
