// Update: Replaced jQuery `html.find()` with vanilla JavaScript `document.querySelectorAll()` and `addEventListener()` for Foundry v13 compatibility.

// Replacing `$(document).find('#items-to-add')` with
const itemsToAdd = document.querySelector('#items-to-add');

// Update `activateListeners` method to use vanilla JS event listeners
activateListeners() {
    // Example of using addEventListener instead of jQuery's on
    itemsToAdd.addEventListener('click', () => {
        // Your event handling logic here
    });
    // Add more event listeners as needed
}