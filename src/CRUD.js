const fs = require('fs');
const path = require('path');

// HTML element references
const btnCreate = document.getElementById('btnCreate');
const btnRead = document.getElementById('btnRead');
const btnUpdate = document.getElementById('btnUpdate');
const btnDelete = document.getElementById('btnDelete');
const fileName = document.getElementById('fileName');
const fileContents = document.getElementById('fileContents');
const itineraryDisplay = document.getElementById('itineraryDisplay');

// Directory to store itinerary files
const pathName = path.join(__dirname, 'Destinations');
if (!fs.existsSync(pathName)) fs.mkdirSync(pathName);

// Utility Functions
const getFilePath = (name) => path.join(pathName, `${name}.txt`);
const showAlert = (message) => alert(message);

// Display all itineraries on page load
displayAllItineraries();

// Create Itinerary
btnCreate.addEventListener('click', () => {
    const filePath = getFilePath(fileName.value);
    const content = fileContents.value;

    fs.writeFile(filePath, content, (err) => {
        if (err) return console.error('Error creating file:', err);
        showAlert(`Itinerary "${fileName.value}" Saved successfully!`);
        clearFields();
        displayAllItineraries();
    });
});

// Read Itinerary
btnRead.addEventListener('click', () => readItinerary(fileName.value));

// Update Itinerary
btnUpdate.addEventListener('click', () => {
    const filePath = getFilePath(fileName.value);
    const content = fileContents.value;

    fs.writeFile(filePath, content, (err) => {
        if (err) return console.error('Error updating file:', err);
        showAlert(`Itinerary "${fileName.value}" updated successfully!`);
        displayAllItineraries();
    });
});

// Delete Itinerary
btnDelete.addEventListener('click', () => {
    const itineraryName = fileName.value;
    if (!itineraryName) {
        showAlert("Please enter a valid itinerary name to delete.");
        return;
    }

    const isConfirmed = confirm(`Are you sure you want to delete the itinerary "${itineraryName}"?`);
    if (isConfirmed) {
        deleteItinerary(itineraryName);
    }
});


// Display all itineraries with Update and Delete buttons
function displayAllItineraries() {
    itineraryDisplay.innerHTML = ""; // Clear previous entries
    detailsBox.innerHTML = ""; // Clear details box initially

    fs.readdir(pathName, (err, files) => {
        if (err) return console.error('Error reading directory:', err);

        files.forEach(file => {
            const filePath = path.join(pathName, file);

            fs.readFile(filePath, 'utf-8', (err, data) => {
                if (err) return console.error('Error reading file:', err);

                // Create an itinerary box displaying only the title
                const itineraryBox = document.createElement('div');
                itineraryBox.classList.add('itinerary-box');

                const itineraryTitle = document.createElement('h3');
                itineraryTitle.textContent = file.replace('.txt', ''); // Display file name without extension
                itineraryBox.appendChild(itineraryTitle);

                // Add click event to load the itinerary details into the details box
                itineraryTitle.addEventListener('click', () => {
                    // Populate the details box with the selected itinerary's details
                    detailsBox.innerHTML = `
                        <h3>Details for ${file.replace('.txt', '')}</h3>
                        <p>${data}</p>
                    `;
                });

                // Append the itinerary box to the display section
                itineraryDisplay.appendChild(itineraryBox);
            });
        });
    });
}


// Function to read itinerary
function readItinerary(itineraryName) {
    const filePath = getFilePath(itineraryName);

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) return console.error('Error reading file:', err);
        fileContents.value = data;
        console.log(`Itinerary "${itineraryName}" loaded.`);
    });
}

// Function to delete itinerary
function deleteItinerary(itineraryName) {
    const filePath = getFilePath(itineraryName);

    fs.unlink(filePath, (err) => {
        if (err) return console.error('Error deleting file:', err);
        showAlert(`Itinerary "${itineraryName}" deleted.`);
        clearFields();
        displayAllItineraries();
    });
}

// Clear input fields
function clearFields() {
    fileName.value = "";
    fileContents.value = "";
}
