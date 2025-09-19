// Get the container element from the HTML once at the start.
const cafeListContainer = document.getElementById('cafe-list');

/**
 * Renders a list of cafe objects to the page.
 * @param {Array} cafesToRender - The array of cafe objects to display.
 */
function renderCafes(cafesToRender) {
  // If the array is empty, show a message.
  if (cafesToRender.length === 0) {
    cafeListContainer.innerHTML = '<p>No cafes found!</p>';
    return;
  }

  // Use map() to create an array of HTML strings for each cafe.
  const cafeCardsHTML = cafesToRender.map(cafe => {
    // Generate the HTML for the feature tags separately for cleaner code.
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
  }).join(''); // Join the array of HTML strings into a single string.

  // Set the innerHTML of the container only ONCE. This is much more efficient.
  cafeListContainer.innerHTML = cafeCardsHTML;
}

/**
 * Main function to fetch data and initialize the application.
 */
async function main() {
  try {
    // Show a loading message while we fetch the data.
    cafeListContainer.innerHTML = '<p>Loooading cafes...</p>';

    const response = await fetch('data.json');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const allCafes = await response.json();
    
    // Now that we have the data, render it.
    renderCafes(allCafes);

  } catch (error) {
    console.error("Failed to load cafes:", error);
    cafeListContainer.innerHTML = '<p>Sorry, we could not load the cafes at this time.</p>';
  }
}

// Start the application when the script loads.
main();