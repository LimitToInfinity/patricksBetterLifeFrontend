document.addEventListener("DOMContentLoaded", postLoad);

const baseURL = "http://localhost:3000/";
const usersURL = "http://localhost:3000/users/";
const eventsURL = "http://localhost:3000/events/";

let eventsSection;
let createEvent;

function postLoad() {
    eventsSection = document.querySelector(".events");
    createEvent = document.querySelector(".create-event");

    fetch(eventsURL)
        .then(parseJSON)
        .then(extractData)
        .then(events => events.map(displayEvent));
    
    createEvent.addEventListener("submit", addEvent);
}

function addEvent(event) {
    event.preventDefault();

    const newEventFormData = new FormData(event.target);
    const name = newEventFormData.get("name");
    const description = newEventFormData.get("description");
    const newEvent = { name, description };

    displayEvent(newEvent);

    fetch(eventsURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent)
    })
        // .then(parseJSON)
        // .then(json => json.data.attributes)
        // .then(displayEvent)
        // .catch(error => console.error(error));
}

function displayEvent(event) {
    const eventCard = document.createElement("div");
    eventCard.classList.add("event");
    eventCard.dataset.eventId = event.id;

    const eventName = document.createElement("h2");
    const eventDescription = document.createElement("p");

    eventName.textContent = event.name;
    eventDescription.textContent = event.description;

    eventCard.append(eventName, eventDescription);

    eventsSection.append(eventCard);
}

function extractData(object) {
    return object.data.map(unNest);
}

function unNest(element) {
    return element.attributes;
}

function parseJSON(response) {
    return response.json();
}

function fetchCall(url, method, body) {
    const headers = { "Content-Type": "application/json" }
    return fetch(url, { method, headers, body })
}