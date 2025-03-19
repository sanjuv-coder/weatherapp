// OpenWeather API configuration
const API_KEY = '955825f327e67665032803383b4f7a4a'; // Replace with your OpenWeather API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM Elements
const searchInput = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-button');
const cityElement = document.querySelector('.city');
const temperatureElement = document.querySelector('.temperature');
const descriptionElement = document.querySelector('.description');
const weatherIconElement = document.querySelector('.weather-icon');
const windElement = document.querySelector('.wind');
const humidityElement = document.querySelector('.humidity');
const pressureElement = document.getElementById('pressure');
const feelsLikeElement = document.getElementById('feels-like');
const currentDateElement = document.getElementById('current-date');
const themeToggleBtn = document.getElementById('theme-toggle-btn');

// Theme toggle functionality
themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    if (document.body.classList.contains('dark-mode')) {
        themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('theme', 'dark');
    } else {
        themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', 'light');
    }
});

// Check for saved theme preference
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    updateCurrentDate();
});

// Function to update current date
function updateCurrentDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDateElement.textContent = now.toLocaleDateString('en-US', options);
}

// Function to fetch weather data
async function getWeatherData(city) {
    try {
        const response = await fetch(`${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        
        if (data.cod === '404') {
            throw new Error('City not found. Please check the spelling and try again.');
        }
        
        if (!response.ok) {
            throw new Error('Failed to fetch weather data. Please try again later.');
        }

        return data;
    } catch (error) {
        throw error;
    }
}

// Function to update the UI with weather data
function updateWeatherUI(data) {
    cityElement.textContent = data.name;
    temperatureElement.textContent = `${Math.round(data.main.temp)}°C`;
    descriptionElement.textContent = data.weather[0].description;
    weatherIconElement.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
    windElement.textContent = `${data.wind.speed} km/h`;
    humidityElement.textContent = `${data.main.humidity}%`;
    
    // Update new UI elements
    feelsLikeElement.textContent = `${Math.round(data.main.feels_like)}°C`;
    pressureElement.textContent = `${data.main.pressure} hPa`;
    
    // Apply subtle animation when updating data
    animateUpdate(cityElement);
    animateUpdate(temperatureElement);
}

// Function to animate updates
function animateUpdate(element) {
    element.style.transform = 'scale(0.95)';
    element.style.opacity = '0.8';
    
    setTimeout(() => {
        element.style.transform = 'scale(1)';
        element.style.opacity = '1';
    }, 150);
}

// Function to handle search
async function handleSearch() {
    const city = searchInput.value.trim();
    
    if (city === '') {
        showNotification('Please enter a city name');
        return;
    }

    try {
        // Show loading state
        cityElement.textContent = 'Loading...';
        temperatureElement.textContent = '--°C';
        descriptionElement.textContent = 'Fetching weather data...';
        
        const weatherData = await getWeatherData(city);
        updateWeatherUI(weatherData);
    } catch (error) {
        // Reset UI on error
        cityElement.textContent = 'Weather App';
        temperatureElement.textContent = '--°C';
        descriptionElement.textContent = 'Enter a city name to get started';
        weatherIconElement.src = '';
        windElement.textContent = '-- km/h';
        humidityElement.textContent = '--%';
        feelsLikeElement.textContent = '--°C';
        pressureElement.textContent = '-- hPa';
        
        showNotification(error.message);
    }
}

// Function to show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Event Listeners
searchButton.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Initialize 
updateCurrentDate(); 