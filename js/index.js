'use strict';

const modal = document.querySelector('.modal');

const changeLocationButton = document.querySelector('.change-location-button');

// Event listeners
// to show the modal when we click on the change location button
changeLocationButton.addEventListener('click', function (e) {
  e.preventDefault();
  modal.style.display = 'block';
});
// to close modal when we click any where outside the modal
document.addEventListener('click', function (e) {
  if (e.target.className === 'modal') modal.style.display = 'none';
});
