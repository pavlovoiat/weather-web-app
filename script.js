import { CONFIG } from "./config.js";

const input = document.getElementById("searchBar");
const button = document.getElementById("button");
const suggestions = document.getElementById("suggestions");
const city = document.getElementById("city");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const icon = document.getElementById("icon");
const humidity = document.getElementById("humidity");
const feelsLike = document.getElementById("feelsLike");
const windSpeed = document.getElementById("windSpeed");

button.onclick = async () => {
    const cityInput = input.value.trim();
    if (!cityInput) return;
    
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${CONFIG.API_KEY}&units=${CONFIG.UNITS}&lang=${CONFIG.LANGUAGE}`);
        
        if (!response.ok) {
            city.style.color = "red";
            city.innerText = `${cityInput}: Not found`;
            return;
        }

        const data = await response.json();

        city.style.color = "white";
        city.innerText = data.name;
        temperature.innerText = `${Math.round(data.main.temp)}°C`;
        description.innerText = data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1);
        icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        humidity.innerText = `${data.main.humidity}%`;
        feelsLike.innerText = `${Math.round(data.main.feels_like)}°C`;
        windSpeed.innerText = `${data.wind.speed}km/h`;
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

const selectCity = (cityName) => {
    input.value = cityName.name;
    suggestions.innerHTML = "";
    button.click();
};

input.oninput = async () => {
    suggestions.innerHTML = "";
    const text = input.value.trim();

    if (text.length > 2) {
        try {
            const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${text}&limit=10&appid=${CONFIG.API_KEY}`);
            const suggestion = await response.json();

            suggestion.forEach(cityData => {
                const div = document.createElement("div");

                div.classList.add("suggestion-item");
                div.innerText = `${cityData.name}, ${cityData.country}`;
                div.onclick = () => selectCity(cityData);

                suggestions.appendChild(div);
                suggestions.style.display = "block";
            });
        } catch (error) {
            console.error("Fetch error:", error);
        }
    } else {
        suggestions.innerHTML = "";
        suggestions.style.display = "none";
    }
}

document.addEventListener("click", (e) =>{
    if (!input.contains(e.target) && !suggestions.contains(e.target)) {
        suggestions.innerHTML = "";
        suggestions.style.display = "none";
    }
});

input.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        button.click();
    }
});