// Get the HTML container for the cafe list once at the start.
const cafeListContainer = document.getElementById('cafe-list');

/**
 * Renders an array of cafe objects into the DOM.
 * @param {Array} cafesToRender The array of cafes to display.
 */
function renderCafes(cafesToRender) {
  // If the array is empty, display a helpful message.
  if (cafesToRender.length === 0) {
    cafeListContainer.innerHTML = '<p>Noo cafess found!</p>';
    return;
  }

  // Use map() to create an array of HTML strings for each cafe.
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
  }).join(''); // Join the array of HTML into a single, large string.

  // Set the innerHTML of the container only ONCE. This is much more efficient.
  cafeListContainer.innerHTML = cafeCardsHTML;
}

/**
 * Main function to fetch data and initialize the application.
 */
async function main() {
  try {
    // Show a loading message while fetching data.
    cafeListContainer.innerHTML = '<p>Loading cafes...</p>';

    const response = await fetch('data.json');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const allCafes = await response.json();
    
    // Once data is loaded, render it.
    renderCafes(allCafes);

  } catch (error) {
    console.error("Failed to load cafes:", error);
    cafeListContainer.innerHTML = '<p>Sorry, we could not load the cafes at this time.</p>';
  }
}

// Start the application.
main();