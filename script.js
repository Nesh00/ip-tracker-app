'use strict';

const input = document.querySelector('#input-tracker');
const inputBtn = document.querySelector('#input-button');
const detailsRow = document.querySelector('#details-row');

// LEAFLET MAP AND MARKER SET-UP
const renderMapAndMarker = function (lat, lng) {
  const container = L.DomUtil.get('map');
  if (container != null) {
    container._leaflet_id = null;
  }

  const myMap = L.map('map').setView([lat, lng], 13);

  L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
  }).addTo(myMap);

  const myIcon = L.icon({
    iconUrl: 'images/icon-location.svg',
  });

  L.marker([lat, lng], { icon: myIcon }).addTo(myMap);
};

// RENDER SEARCH RESULTS
const updateResultsUI = function (data) {
  const html = `
        <div class="col-md-3 d-flex flex-column text-md-start my-3">
            <small class="text-uppercase fw-bold text-muted">ip address</small>
            <span class="fs-3">${data.ip}</span>
        </div>
        <div class="col-md-3 d-flex flex-column text-md-start my-3 ps-md-4">
            <small class="text-uppercase fw-bold text-muted">location</small>
            <span class="fs-3">${data.location.city}, ${data.location.country} ${data.location.postalCode}</span>
        </div>
        <div class="col-md-3 d-flex flex-column text-md-start my-3 ps-md-4">
            <small class="text-uppercase fw-bold text-muted">timezone</small>
            <span class="fs-3">${data.location.timezone}</span>
        </div>
        <div class="col-md-3 d-flex flex-column text-md-start my-3 ps-md-4">
            <small class="text-uppercase fw-bold text-muted">isp</small>
            <span class="fs-4">${data.isp}</span>
        </div>
    `;
  detailsRow.textContent = '';
  detailsRow.insertAdjacentHTML('afterbegin', html);
};

// RENDER SEARCH ERROR MESSAGE
const errorMessageUI = () => {
  const html = `
    <div id="error-message" class="row p-2">
        <div class="col">
        <h3 class="display-6 text-danger">
            There was an error in your reguest, please try again!
        </h3>
        </div>
    </div>`;
  detailsRow.textContent = '';
  detailsRow.insertAdjacentHTML('afterbegin', html);
};

// API REQUEST(IPIFY)
const API = async function (IPI_ADDRESS = '') {
  try {
    const res = await fetch(
      `https://geo.ipify.org/api/v1?apiKey=at_zctaX5EfAVEhDhH6nAl9akYn83JUC&ipAddress=${IPI_ADDRESS}`
    );
    if (!res.ok) return;

    const data = await res.json();
    updateResultsUI(data);

    const { lat, lng } = data.location;
    renderMapAndMarker(lat, lng);
  } catch (err) {
    errorMessageUI();
  }
};

// INPUT BUTTON EVENT
inputBtn.addEventListener('click', () => {
  API(input.value);
});

// INITIALIZATION
API();
