document.addEventListener("DOMContentLoaded", () => {
	const itineraryForm = document.getElementById("itineraryForm");
	const itineraryList = document.getElementById("itineraryList");

	// Load itineraries from local storage
	function loadItineraries() {
		itineraryList.innerHTML = "";
		const itineraries = JSON.parse(localStorage.getItem("itineraries")) || [];
		itineraries.forEach((itinerary, index) => displayItinerary(itinerary, index));
	}

	// Display an itinerary
	function displayItinerary(itinerary, index) {
		const itineraryItem = document.createElement("div");
		itineraryItem.classList.add("itinerary-item");

		itineraryItem.innerHTML = `
			<p><strong>Destination:</strong> ${itinerary.destination}</p>
			<p><strong>Date:</strong> ${itinerary.date}</p>
			<p><strong>Details:</strong> ${itinerary.details}</p>
			<button class="button update" onclick="editItinerary(${index})">Edit</button>
			<button class="button delete" onclick="deleteItinerary(${index})">Delete</button>
		`;
		itineraryList.appendChild(itineraryItem);
	}

	// Add itinerary
	itineraryForm.addEventListener("submit", (event) => {
		event.preventDefault();
		const itineraries = JSON.parse(localStorage.getItem("itineraries")) || [];

		const newItinerary = {
			destination: document.getElementById("destination").value,
			date: document.getElementById("date").value,
			details: document.getElementById("details").value
		};

		itineraries.push(newItinerary);
		localStorage.setItem("itineraries", JSON.stringify(itineraries));

		itineraryForm.reset();
		loadItineraries();
	});

	// Edit itinerary
	window.editItinerary = function(index) {
		const itineraries = JSON.parse(localStorage.getItem("itineraries"));
		const itinerary = itineraries[index];

		document.getElementById("destination").value = itinerary.destination;
		document.getElementById("date").value = itinerary.date;
		document.getElementById("details").value = itinerary.details;

		itineraries.splice(index, 1);
		localStorage.setItem("itineraries", JSON.stringify(itineraries));
		loadItineraries();
	}

	// Delete itinerary
	window.deleteItinerary = function(index) {
		const itineraries = JSON.parse(localStorage.getItem("itineraries"));
		itineraries.splice(index, 1);
		localStorage.setItem("itineraries", JSON.stringify(itineraries));
		loadItineraries();
	}

	// Initial load
	loadItineraries();
});
