// Global variable to hold manufacturer data
let manufacturersData = {};

// Function to load manufacturer data from a separate JSON file
function loadManufacturerData() {
  fetch('path/to/manufacturers.json')  // Change this to the path where your JSON file is located
    .then(response => response.json())
    .then(data => {
      manufacturersData = data;
      populateManufacturerDropdown();
    })
    .catch(error => console.error('Error loading manufacturer data:', error));
}

// Function to populate the manufacturer dropdown after the data is loaded
function populateManufacturerDropdown() {
  const manufacturerDropdown = document.getElementById('manufacturer');
  let options = '<option value="">Select Manufacturer</option>';

  // Loop through each manufacturer category and populate the dropdown
  for (const category in manufacturersData) {
    manufacturersData[category].forEach(manufacturer => {
      options += `<option value="${manufacturer.value}">${manufacturer.name}</option>`;
    });
  }

  manufacturerDropdown.innerHTML = options;
}

// Function to calculate the home value based on input factors
function calculateMobileHomeValue() {
  // Get values from the form
  const homeAge = parseInt(document.getElementById('home-age').value);
  const homeSize = parseInt(document.getElementById('home-size').value);
  const homeCondition = document.getElementById('home-condition').value;
  const numRooms = parseInt(document.getElementById('num-rooms').value);
  const homeType = document.getElementById('home-type').value;
  const locationDemand = document.getElementById('location-demand').value;
  const manufacturer = document.getElementById('manufacturer').value;

  // Validation: Check for empty fields and invalid input
  if (isNaN(homeAge) || homeAge <= 0) {
    alert("Please enter a valid age for the home.");
    return;
  }
  if (isNaN(homeSize) || homeSize <= 0) {
    alert("Please enter a valid size for the home.");
    return;
  }
  if (homeCondition === '') {
    alert("Please select a condition for the home.");
    return;
  }
  if (isNaN(numRooms) || numRooms <= 0) {
    alert("Please enter a valid number of rooms.");
    return;
  }
  if (homeType === '') {
    alert("Please select a type of mobile home.");
    return;
  }
  if (locationDemand === '') {
    alert("Please select the location demand level.");
    return;
  }
  if (manufacturer === '') {
    alert("Please select a manufacturer.");
    return;
  }

  // Set a base value for calculation
  let baseValue = 10000;

  // Factor multipliers based on inputs
  let ageFactor = 1 - (homeAge * 0.01);
  let sizeFactor = homeSize * 50;
  let conditionFactor = homeCondition === 'Excellent' ? 1.2 : (homeCondition === 'Good' ? 1.1 : 1);
  let roomFactor = numRooms * 500;
  let typeFactor = homeType === 'Single Wide' ? 0.8 : 1.2;
  let demandFactor = locationDemand === 'High' ? 1.3 : (locationDemand === 'Medium' ? 1.2 : 1);

  // Manufacturer level factor
  let manufacturerLevelFactor = getManufacturerLevelFactor(manufacturer);

  // Calculate total value
  let totalValue = baseValue * ageFactor + sizeFactor * conditionFactor + roomFactor * typeFactor * demandFactor * manufacturerLevelFactor;

  // Display the calculated value
  document.getElementById('result').innerText = 'Estimated Mobile Home Value: $' + totalValue.toFixed(2);
}

// Function to determine manufacturer level factor
function getManufacturerLevelFactor(manufacturer) {
  // Check which category the manufacturer falls into
  for (const category in manufacturersData) {
    if (manufacturersData[category].some(item => item.value === manufacturer)) {
      switch (category) {
        case 'Premium':
          return 1.5;  // Premium
        case 'Standard':
          return 1.2;  // Standard
        case 'Budget':
          return 0.8;  // Budget
        case 'Regional/Specialty':
          return 1.1;  // Regional/Specialty
        default:
          return 1;  // Default if no match
      }
    }
  }

  // Default return if no manufacturer category is matched
  return 1;
}

// Load manufacturer data when the page is loaded
document.addEventListener('DOMContentLoaded', loadManufacturerData);
