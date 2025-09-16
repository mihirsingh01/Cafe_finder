// Google Maps API configuration
const apiKey = "AIzaSyCOeHQdLZqFS939POtdXPe8LmepdtMvzXg"; // Replace with your actual API key
const useProxy = true;
const proxy = "https://cors-anywhere.herokuapp.com";

// DOM Elements
const cardsContainer = document.querySelector('.cards');
const findCafesBtn = document.getElementById('findCafes');
const showSavedBtn = document.getElementById('showSaved');
const loadingElement = document.getElementById('loading');

// Event Listeners
findCafesBtn.addEventListener('click', getLocation);
showSavedBtn.addEventListener('click', showSaved);

// Get user's location
function getLocation() {
    // Check if we have a cached location
    const cache = JSON.parse(localStorage.getItem('cachedLocation') || '{}');
    const now = Date.now();
    
    if (cache.timestamp && now - cache.timestamp < 10 * 60 * 1000) {
        if (confirm("Use your previous location to find cafes?")) {
            useLocation(cache.lat, cache.lng);
            return;
        }
    }
    
    // Get new location
    if (navigator.geolocation) {
        loadingElement.style.display = 'block';
        navigator.geolocation.getCurrentPosition(
            position => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                
                // Save to cache
                localStorage.setItem('cachedLocation', JSON.stringify({ 
                    lat, 
                    lng, 
                    timestamp: now 
                }));
                
                useLocation(lat, lng);
            },
            () => {
                loadingElement.style.display = 'none';
                alert("Location access denied or unavailable. Please enable location services.");
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Use location to find cafes
async function useLocation(lat, lng) {
    const endpoint = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=1500&type=cafe&key=${apiKey}`;
    const url = useProxy ? proxy + '/' + endpoint : endpoint;
    
    try {
        loadingElement.style.display = 'block';
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            displayCards(data.results);
        } else {
            alert("No cafes found in your area.");
        }
    } catch (e) {
        console.error("Error fetching Places API:", e);
        alert("Error fetching cafes. Please check your API key and try again.");
    } finally {
        loadingElement.style.display = 'none';
    }
}

// Display cafe cards
function displayCards(cafes) {
    cardsContainer.innerHTML = '';
    
    cafes.forEach((cafe, i) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'swipe-wrapper';
        wrapper.style.zIndex = 200 - i;

        const card = document.createElement('div');
        card.className = 'location-card';
        
        // Get photo URL if available
        const imgUrl = cafe.photos?.[0]?.photo_reference
            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${cafe.photos[0].photo_reference}&key=${apiKey}`
            : 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80';
        
        // Prepare cafe data for saving
        const cafeData = {
            name: cafe.name,
            place_id: cafe.place_id,
            photo: imgUrl,
            rating: cafe.rating || 'N/A',
            address: cafe.vicinity || 'Address not available',
            lat: cafe.geometry?.location?.lat,
            lng: cafe.geometry?.location?.lng
        };

        // Create card content
        card.innerHTML = `
            <img src="${imgUrl}" alt="${cafe.name}" />
            <div class="location-card-content">
                <div>
                    <h3>${cafe.name}</h3>
                    <div class="rating">
                        <span>⭐️</span>
                        <span>${cafe.rating || 'N/A'}</span>
                    </div>
                    <p class="address">${cafe.vicinity || 'Address not available'}</p>
                </div>
                <p class="swipe-hint">Swipe right to save 💖 | Swipe left to skip</p>
            </div>
        `;

        wrapper.appendChild(card);
        cardsContainer.appendChild(wrapper);

        // Add swipe functionality with Hammer.js
        const hammertime = new Hammer(wrapper);
        hammertime.on('swipeleft', () => {
            wrapper.style.transform = 'translateX(-150%) rotate(-15deg)';
            wrapper.style.opacity = 0;
            setTimeout(() => wrapper.remove(), 300);
        });
        
        hammertime.on('swiperight', () => {
            saveCafe(cafeData);
            wrapper.style.transform = 'translateX(150%) rotate(15deg)';
            wrapper.style.opacity = 0;
            setTimeout(() => wrapper.remove(), 300);
        });
    });
}

// Save cafe to localStorage
function saveCafe(cafe) {
    let saved = JSON.parse(localStorage.getItem('savedCafes') || '[]');
    
    if (!saved.find(c => c.place_id === cafe.place_id)) {
        saved.push(cafe);
        localStorage.setItem('savedCafes', JSON.stringify(saved));
        alert(`${cafe.name} saved to your favorites!`);
    } else {
        alert(`${cafe.name} is already in your saved cafes.`);
    }
}

// Show saved cafes
function showSaved() {
    cardsContainer.innerHTML = '';
    const saved = JSON.parse(localStorage.getItem('savedCafes') || '[]');
    
    if (saved.length === 0) {
        cardsContainer.innerHTML = `
            <div class="location-card" style="display: flex; align-items: center; justify-content: center;">
                <p>No saved cafes yet 😢<br>Find cafes and swipe right to save them!</p>
            </div>
        `;
        return;
    }
    
    saved.forEach(cafe => {
        const card = document.createElement('div');
        card.className = 'location-card';
        card.innerHTML = `
            <img src="${cafe.photo}" alt="${cafe.name}" />
            <div class="location-card-content">
                <div>
                    <h3>${cafe.name}</h3>
                    <div class="rating">
                        <span>⭐️</span>
                        <span>${cafe.rating}</span>
                    </div>
                    <p class="address">${cafe.address}</p>
                </div>
            </div>
        `;
        cardsContainer.appendChild(card);
    });
}

// Check for cached location on page load
document.addEventListener('DOMContentLoaded', () => {
    // You could add code here to automatically load cafes if a recent location exists
});