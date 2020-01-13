document.addEventListener("DOMContentLoaded", postLoad);

const baseURL = "http://localhost:3000/";
const usersURL = "http://localhost:3000/users/";
const eventsURL = "http://localhost:3000/events/";

let eventsSection;
let updateEvent;
let createEvent;

function postLoad() {
    eventsSection = document.querySelector(".events");
    updateEvent = document.querySelector(".update-event");
    createEvent = document.querySelector(".create-event");

    fetch(eventsURL)
        .then(parseJSON)
        .then(extractData)
        .then(events => events.map(displayEvent));
    
    createEvent.addEventListener("submit", addEvent);
    updateEvent.addEventListener("submit", updteEvent);
}

function addEvent(event) {
    event.preventDefault();

    const newEventFormData = new FormData(event.target);
    const name = newEventFormData.get("name");
    const description = newEventFormData.get("description");
    const newEvent = { name, description };

    // displayEvent(newEvent);

    const newEventBody = JSON.stringify(newEvent);
    fetchCall(eventsURL, "POST", newEventBody)
        .then(parseJSON)
        .then(json => json.data.attributes)
        .then(displayEvent)
        .catch(error => console.error(error));

    event.target.reset();
}

function updteEvent(event) {
    event.preventDefault();

    const eventId = event.target.dataset.eventId;

    const updateEventFormData = new FormData(event.target);
    const name = updateEventFormData.get("name");
    const description = updateEventFormData.get("description");

    const updatedEvent = { name, description };
    const updatedEventBody = JSON.stringify(updatedEvent);

    const eventCards = Array.from(eventsSection.querySelectorAll(".event"));
    const eventCard = eventCards.find(eventCard => eventCard.dataset.eventId === eventId);
    const cardName = eventCard.querySelector("h2");
    const cardDescription = eventCard.querySelector("p");

    cardName.textContent = name;
    cardDescription.textContent = description;

    fetchCall(`${eventsURL}${eventId}`, "PATCH", updatedEventBody);

    event.target.classList.add("invisible");
    event.target.reset();
}

function displayEvent(event) {
    const eventCard = document.createElement("div");
    eventCard.classList.add("event");
    eventCard.dataset.eventId = event.id;

    const eventName = document.createElement("h2");
    const eventDescription = document.createElement("p");
    const updateButton = document.createElement("button");
    const deleteButton = document.createElement("button");

    eventName.classList.add("event-name");
    eventDescription.classList.add("event-description");
    updateButton.classList.add("update");
    deleteButton.classList.add("delete");

    eventName.textContent = event.name;
    eventDescription.textContent = event.description;
    updateButton.textContent = "UPDTE";
    deleteButton.textContent = "FOGET BOUT IT";

    eventCard.append(eventName, eventDescription, updateButton, deleteButton);

    updateButton.addEventListener("click", updte);
    deleteButton.addEventListener("click", forgetAboutIt);

    eventsSection.append(eventCard);
}

function updte(event) {
    updateEvent.classList.remove("invisible");

    const { parentNode } = event.target;
    // parentNode = event.target.parentNode

    const eventId = parentNode.dataset.eventId;
    updateEvent.dataset.eventId = eventId;

    const nameField = updateEvent.querySelector("input[name=name]");
    const descriptionField = updateEvent.querySelector("input[name=description]");
    const name = parentNode.querySelector(".event-name").textContent;
    const description = parentNode.querySelector(".event-description").textContent;

    nameField.value = name;
    descriptionField.value = description;
}

function forgetAboutIt(event) {
    if (window.confirm("Are you sure sucka?")) {
        const eventId = event.target.parentNode.dataset.eventId;
        fetchCall(`${eventsURL}${eventId}`, "DELETE");
        event.target.parentNode.remove();
    }
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