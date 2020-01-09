document.addEventListener("DOMContentLoaded", postLoad);

const baseURL = "http://localhost:3000/";
const usersURL = "http://localhost:3000/users/";
const eventsURL = "http://localhost:3000/events/";

let eventsSection;

function postLoad() {
    eventsSection = document.querySelector(".events");

    fetch(eventsURL)
        .then(parseJSON)
        .then(extractData)
        .then(events => events.map(displayEvent));
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