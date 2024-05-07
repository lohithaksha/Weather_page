// Wrap Chart.js related code in a function
function initChart() {
  let ctx;
  let chart;

  // Function to draw temperature graph
  function drawGraph(ctx, city, data, type) {
    const labels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    chart = new Chart(ctx, {
      type: type,
      data: {
        labels: labels,
        datasets: [{
          label: city,
          data: data,
          backgroundColor: type === 'bar' ? 'rgb(75, 192, 192)' : 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  let selectedGraphType = 'bar'; // Global variable to store selected graph type

  async function fetchWeather(city) {
    const apiKey = '79587ac75d981a665aacb0789efe2610'; // Your OpenWeatherMap API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('City not found');
      }
      const data = await response.json();
      return data.main.temp;
    } catch (error) {
      console.error(error);
      return null; // return null if city not found or any error occurs
    }
  }

  async function updateTemperatures() {
    const cities = ["New York", "Houston", "London", "Paris", "Tokyo", "Sydney", "Dubai", "Moscow", "Mumbai", "Toronto"];
    for (const city of cities) {
      const temperature = await fetchWeather(city);
      const tempSpan = document.getElementById(`temp_${city.split(' ').join('_')}`);
      if (temperature !== null && tempSpan !== null) {
        tempSpan.textContent = `${temperature}°C`;
      } else {
        console.error(`Temperature data not available for ${city}`);
      }
    }
  }

  document.querySelectorAll('.city-list-item').forEach(item => {
    item.addEventListener('click', async event => {
      // Remove 'active' class from previously selected item
      document.querySelectorAll('.city-list-item').forEach(item => {
        item.classList.remove('active');
      });

      // Add 'active' class to the clicked item
      event.target.classList.add('active');

      const city = event.target.textContent.split(' ')[0];
      const temperature = await fetchWeather(city);
      if (temperature !== null) {
        if (!ctx) {
          ctx = document.getElementById('temperatureGraph').getContext('2d');
        }
        if (chart) {
          chart.destroy();
        }
        drawGraph(ctx, city, Array(7).fill(temperature), selectedGraphType);
      } else {
        alert('Temperature data not available for this city');
      }
    });
  });

  // Function to update the graph
  async function updateGraph() {
    const activeCity = document.querySelector('.city-list-item.active');
    if (activeCity) {
      const city = activeCity.textContent.split(' ')[0];
      const temperature = await fetchWeather(city);
      if (temperature !== null) {
        if (!ctx) {
          ctx = document.getElementById('temperatureGraph').getContext('2d');
        }
        if (chart) {
          chart.destroy();
        }
        drawGraph(ctx, city, Array(7).fill(temperature), selectedGraphType);
      } else {
        alert('Temperature data not available for this city');
      }
    }
  }

  async function applyGraphSetting() {
    const graphTypeDropdown = document.getElementById('graphTypeDropdown');
    selectedGraphType = graphTypeDropdown.value;
    
    const city = document.querySelector('.city-list-item.active').textContent.split(' ')[0];
    const temperature = await fetchWeather(city);

    if (temperature !== null) {
      if (!ctx) {
        ctx = document.getElementById('temperatureGraph').getContext('2d');
      }
      if (chart) {
        chart.destroy();
      }
      drawGraph(ctx, city, Array(7).fill(temperature), selectedGraphType);
    } else {
      alert('Temperature data not available for this city');
    }

    const dropdownMenu = document.getElementById("myDropdownGraph");
    if (dropdownMenu) {
      dropdownMenu.parentElement.removeChild(dropdownMenu);
      const cityCard = document.querySelector(".card");
      cityCard.style.display = "flex";
    }
  }

  async function applyTemperatureSetting() {
    const tempUnitDropdown = document.getElementById('tempUnitDropdown');
    const selectedUnit = tempUnitDropdown.value;
    
    if (selectedUnit === 'Celsius') {
      await updateTemperatures();
      updateGraph(); // Update the graph after updating temperatures
    } else if (selectedUnit === 'Fahrenheit') {
      await displayTemperaturesF();
      updateGraph(); // Update the graph after updating temperatures
    }

    const dropdownMenu = document.getElementById("myDropdown");
    if (dropdownMenu) {
      dropdownMenu.parentElement.removeChild(dropdownMenu);
      const cityCard = document.querySelector(".card");
      cityCard.style.display = "flex";
    }
  }

  async function displayTemperaturesF() {
    const cities = ["New York", "Houston", "London", "Paris", "Tokyo", "Sydney", "Dubai", "Moscow", "Mumbai", "Toronto"];
    for (const city of cities) {
      const temperatureSpan = document.getElementById(`temp_${city.split(' ').join('_')}`);
      if (temperatureSpan) {
        const temperatureC = await fetchWeather(city);
        if (temperatureC !== null) {
          const temperatureF = celsiusToFahrenheit(temperatureC);
          temperatureSpan.textContent = `${temperatureF.toFixed(1)}°F`;
        } else {
          temperatureSpan.textContent = "Data not available";
        }
      }
    }
  }

  function celsiusToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
  }

  // Initial update of temperatures and graph
  updateTemperatures();
  updateGraph();

  // Settings button functionality for temperature settings
  const settingIcon = document.getElementById("setting-icon");
  settingIcon.addEventListener("click", function(event) {
    event.stopPropagation();

    const cityCard = document.querySelector(".card");
    cityCard.style.display = "none";

    const newCard = document.createElement("div");
    newCard.className = "card";

    const dropdownContent = document.createElement("div");
    dropdownContent.className = "container card-content";
    dropdownContent.id = "myDropdown";
    dropdownContent.innerHTML = `
      <div class="dropdown-header">Temperature Settings</div>
      <select id="tempUnitDropdown">
        <option value="Celsius">Celsius</option>
        <option value="Fahrenheit">Fahrenheit</option>
      </select>
      <button class="apply-button" id="applyButton">Apply</button>
    `;

    newCard.appendChild(dropdownContent);
    document.body.appendChild(newCard);

    document.addEventListener("click", function(event) {
      if (!event.target.matches("#setting-icon") && !event.target.matches("#tempUnitDropdown") && !event.target.matches(".apply-button")) {
        const dropdownMenu = document.getElementById("myDropdown");
        if (dropdownMenu) {
          dropdownMenu.parentElement.removeChild(dropdownMenu);
          cityCard.style.display = "flex";
        }
      }
    });

    const applyButton = document.getElementById("applyButton");
    applyButton.addEventListener("click", applyTemperatureSetting);
  });

  // Settings button functionality for graph settings
  const settingIconGraph = document.getElementById("setting-icon-graph");
  settingIconGraph.addEventListener("click", function(event) {
    event.stopPropagation();

    const cityCard = document.querySelector(".card");
    cityCard.style.display = "none";

    const newCard = document.createElement("div");
    newCard.className = "card";

    const dropdownContent = document.createElement("div");
    dropdownContent.className = "container card-content";
    dropdownContent.id = "myDropdownGraph";
    dropdownContent.innerHTML = `
      <div class="dropdown-header">Graph Settings</div>
      <select id="graphTypeDropdown">
        <option value="bar">Bar Graph</option>
        <option value="line">Line Graph</option>
      </select>
      <button class="apply-button" id="applyButtonGraph">Apply</button>
    `;

    newCard.appendChild(dropdownContent);
    document.body.appendChild(newCard);

    document.addEventListener("click", function(event) {
      if (!event.target.matches("#setting-icon-graph") && !event.target.matches("#graphTypeDropdown") && !event.target.matches(".apply-button")) {
        const dropdownMenu = document.getElementById("myDropdownGraph");
        if (dropdownMenu) {
          dropdownMenu.parentElement.removeChild(dropdownMenu);
          cityCard.style.display = "flex";
        }
      }
    });

    const applyButtonGraph = document.getElementById("applyButtonGraph");
    applyButtonGraph.addEventListener("click", applyGraphSetting);
  });
}

// Call the function once Chart.js is loaded
window.onload = function() {
  initChart();
};
