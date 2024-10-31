function fetchWeather() {
  const location = document.getElementById("locationInput").value.trim();
  if (!location) {
    alert("Please enter a location.");
    return;
  }

  const apiKey = "1a835b5099d14d32a7541403242410"; // Replace with your API key

  // Calculate remaining days in the month
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const daysLeft = daysInMonth - today.getDate();

  const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=${daysLeft}`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(data => {
      if (data.error) {
        alert(data.error.message);
        return;
      }

      // Store necessary data in localStorage
      localStorage.setItem("weatherData", JSON.stringify({
        location: {
          name: data.location.name,
          region: data.location.region,
          country: data.location.country,
          localtime: data.location.localtime,
        },
        current: {
          temp_c: data.current.temp_c,
          feelslike_c: data.current.feelslike_c,
          condition: {
            text: data.current.condition.text,
            icon: data.current.condition.icon,
          },
          wind_kph: data.current.wind_kph,
          humidity: data.current.humidity,
        },
        forecastDays: data.forecast.forecastday // Array of daily forecasts
      }));

      // Redirect to the weather details page
      window.location.href = "weatherDetails.html";
    })
    .catch(error => {
      console.error("Error fetching weather data:", error);
      alert("An error occurred while fetching the weather data. Please try again later.");
    });
}

function displayWeatherDetails() {
  const weatherData = JSON.parse(localStorage.getItem("weatherData"));

  if (!weatherData) {
    alert("No weather data found.");
    window.location.href = "index.html";
    return;
  }

  const currentWeatherContainer = document.getElementById("currentWeatherContainer");
  const weatherForecastContainer = document.getElementById("weatherForecastContainer");
  const hourlyForecastContainer = document.getElementById("hourlyForecast");

  const location = weatherData.location;
  const current = weatherData.current;
  const today = new Date();

  // Display current weather information
  currentWeatherContainer.innerHTML = `
    <h3>Today's Weather for ${location.name}, ${location.region}, ${location.country}</h3>
    <p><strong>Local Time:</strong> ${location.localtime}</p>
    <p><strong>Current Temperature:</strong> ${current.temp_c} °C</p>
    <p><strong>Feels Like:</strong> ${current.feelslike_c} °C</p>
    <p><strong>Condition:</strong> ${current.condition.text}</p>
    <img src="https:${current.condition.icon}" alt="Weather icon" />
    <p><strong>Humidity:</strong> ${current.humidity}%</p>
    <p><strong>Wind Speed:</strong> ${current.wind_kph} km/h</p>
  `;

  // Clear the forecast container before adding new forecasts
  weatherForecastContainer.innerHTML = "";

  // Loop through each day until the end of the month
  for (let dayOffset = 0; dayOffset < 60; dayOffset++) { // Displays up to 60 days
    const forecastDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + dayOffset);
    const formattedDate = forecastDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // Find the corresponding forecast day from the weather data
    const forecastDay = weatherData.forecastDays.find(day => day.date === forecastDate.toISOString().split('T')[0]);

    if (forecastDay) {
      const dayDiv = document.createElement("div");
      dayDiv.classList.add("day-forecast");

      dayDiv.innerHTML = `
        <p class="date"><strong>${formattedDate}</strong></p>
        <img src="https:${forecastDay.day.condition.icon}" alt="Weather icon" />
        <p class="temperature"><strong>Average Temp:</strong> ${forecastDay.day.avgtemp_c} °C</p>
        <p class="condition"><strong>Condition:</strong> ${forecastDay.day.condition.text}</p>
        <p><strong>Max:</strong> ${forecastDay.day.maxtemp_c} °C | <strong>Min:</strong> ${forecastDay.day.mintemp_c} °C</p>
        <p><strong>Humidity:</strong> ${forecastDay.day.avghumidity}%</p>
        <p><strong>Wind:</strong> ${forecastDay.day.maxwind_kph} km/h</p>
        <p><strong>Sunrise:</strong> ${forecastDay.astro.sunrise} | <strong>Sunset:</strong> ${forecastDay.astro.sunset}</p>
      `;

      weatherForecastContainer.appendChild(dayDiv);
    }
  }

  // Display hourly forecast for today
  const todayForecastDay = weatherData.forecastDays[0];
  if (todayForecastDay) {
    const hourlyForecast = todayForecastDay.hour;
    hourlyForecastContainer.innerHTML = ""; // Clear previous hourly forecasts

    hourlyForecast.forEach(hour => {
      const hourDiv = document.createElement("div");
      hourDiv.classList.add("hourly-forecast-item");

      const hourTime = new Date(hour.time);
      const formattedHour = hourTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      hourDiv.innerHTML = `
        <p><strong>${formattedHour}</strong></p>
        <img src="https:${hour.condition.icon}" alt="Weather icon" />
        <p><strong>Temp:</strong> ${hour.temp_c} °C</p>
        <p><strong>Condition:</strong> ${hour.condition.text}</p>
        <p><strong>Humidity:</strong> ${hour.humidity}%</p>
        <p><strong>Wind:</strong> ${hour.wind_kph} km/h</p>
      `;

      hourlyForecastContainer.appendChild(hourDiv);
    });
  }

  // Display recommendations based on weather conditions
  displayRecommendations(current.temp_c, current.humidity, current.condition.text);
}

function displayRecommendations(temp, humidity, condition) {
  const recommendationText = document.getElementById("recommendationText");
  const recommendationImage = document.getElementById("recommendationImage");
  let recommendations = [];
  let imageUrl = "";

  // Temperature recommendations
  if (temp < 10) {
    recommendations.push("It's quite cold! Wear a heavy coat, scarf, and gloves to stay warm.");
    imageUrl = "snowwy.jpg";
  } else if (temp < 20) {
    recommendations.push("It's a bit chilly. Consider a sweater or a light jacket.");
    imageUrl = "winter.jpg";
  } else if (temp >= 20 && temp < 30) {
    recommendations.push("The weather is mild. A t-shirt and jeans would be comfortable.");
    imageUrl = "mild.webp";
  } else {
    recommendations.push("It's hot! Light clothing and plenty of hydration are recommended.");
    imageUrl = "hot.jpg";
  }

  // Humidity recommendations
  if (humidity > 70) {
    recommendations.push("Also, it's quite humid, so breathable fabrics will be more comfortable.");
    if (!imageUrl) imageUrl = "humid.jpg";
  }

  // Rain recommendations
  if (condition.toLowerCase().includes("rain")) {
    recommendations.push("Don't forget to carry an umbrella or raincoat.");
    imageUrl = "rainy.jpg";
  }

  // Display all recommendations and image
  recommendationText.innerHTML = `<p>${recommendations.join(' ')}</p>`;
  recommendationImage.src = imageUrl;
}



// Load weather details on page load
document.addEventListener("DOMContentLoaded", displayWeatherDetails);
