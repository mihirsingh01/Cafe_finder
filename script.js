// This is our temporary database of cafes in Lucknow
const cafes = [
    {
        name: "Cappuccino Blast",
        location: "Hazratganj",
        image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93",
        features: ["Wi-Fi", "Outdoor Seating"]
    },
    {
        name: "The Hazelnut Factory",
        location: "Gomti Nagar",
        image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8",
        features: ["Wi-Fi", "Power Outlets", "Pet-Friendly"]
    },
    {
        name: "Homey's Cafe",
        location: "Aliganj",
        image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf",
        features: ["Wi-Fi", "Cozy Reading Nook"]
    },
    {
        name: "Buttercup Bungalow",
        location: "Mall Avenue",
        image: "https://images.unsplash.com/photo-1511920183276-5941c3e938e3",
        features: ["Instagrammable", "Desserts"]
    }
];

// Get the container element from the HTML where we will insert the cafe cards
const cafeListContainer = document.getElementById('cafe-list');

// Function to create and display all cafe cards
function displayCafes() {
    // Clear the container first
    cafeListContainer.innerHTML = '';

    // Loop through each cafe in our database array
    cafes.forEach(cafe => {
        // Create the HTML for one cafe card using a template literal
        const cafeCardHTML = `
            <div class="cafe-card">
                <img src="${cafe.image}" alt="${cafe.name}">
                <div class="cafe-card-info">
                    <h2>${cafe.name}</h2>
                    <p>${cafe.location}</p>
                    <div class="features">
                        ${cafe.features.map(feature => `<span>${feature}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
        // Add the new card's HTML to the container
        cafeListContainer.innerHTML += cafeCardHTML;
    });
}

// Call the function to display the cafes when the page loads
displayCafes();