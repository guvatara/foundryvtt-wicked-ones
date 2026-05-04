// Code updating wicked-actor-sheet.js to replace jQuery with vanilla JavaScript

// Replacing jQuery usage at line 103-105
if (ev.currentTarget) {
    let closestItem = ev.currentTarget.closest('.item');
    // Additional logic as needed
}

// Replacing jQuery usage at line 109-112 with CSS transitions
const element = ev.currentTarget;
element.style.transition = 'height 0.2s ease-out';
element.style.height = '0';
setTimeout(() => { element.style.display = 'none'; }, 200); // Hide the element after transition
