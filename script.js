// Get HTML elements once at the start.
const cafeListContainer = document.getElementById('cafe_-list');
const searchBar = document.getElementById('search-bar');

// A global variable to hold all cafe data after it's fetched.
let allCafes = [];

/**
 * Renders an array of cafe objects into the DOM.
 * @param {Array} cafesToRender The array of cafes to display.
 */
function renderCafes(cafesToRender) {
  if (cafesToRender.length === 0) {
    cafeListContainer.innerHTML = '<p>No cafes match your search!</p>';
    return;
  }

  const cafeCardsHTML = cafesToRender.map(cafe => {
    const featuresHTML = cafe.features.map(feature => `<span>${feature}</span>`).join('');

    return `
      <div class="cafe-card">
          <img src="${cafe.image}" alt="${cafe.name}" loading="lazy">
          <div class="cafe-card-info">
              <h2>${cafe.name}</h2>
              <p>${cafe.location}</p>
              <div class="features">
                  ${featuresHTML}
              </div>
          </div>
      </div>
    `;
  }).join('');

  cafeListContainer.innerHTML = cafeCardsHTML;
}

/**
 * Sets up the event listener for the search bar.
 */
function setupSearch() {
  searchBar.addEventListener('keyup', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    const filteredCafes = allCafes.filter(cafe => {
      const nameMatch = cafe.name.toLowerCase().includes(searchTerm);
      const locationMatch = cafe.location.toLowerCase().includes(searchTerm);
      return nameMatch || locationMatch;
    });

    renderCafes(filteredCafes);
  });
}

/**
 * Main function to fetch data and initialize the application.
 */
async function main() {
  try {
    cafeListContainer.innerHTML = '<p>Loading cafes...</p>';

    const response = await fetch('data.json');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    // Store the fetched data in our global variable.
    allCafes = await response.json();
    
    renderCafes(allCafes); // Initial render of all cafes.
    setupSearch(); // Set up the search functionality.

  } catch (error) {
    console.error("Failed to load cafes:", error);
    cafeListContainer.innerHTML = '<p>Sorry, we could not load the cafes at this time.</p>';
  }
}

// Start the application.
main();
