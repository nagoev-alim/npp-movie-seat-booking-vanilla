// ⚡️ Import Styles
import './style.scss';
import feather from 'feather-icons';
import { showNotification } from './modules/showNotification.js';
import axios from 'axios';

// ⚡️ Render Skeleton
document.querySelector('#app').innerHTML = `
<div class='app-container'>
  <div class='seat-booking'>
   <h3 class='title'>Movie Seat Booking</h3>
    <div class='header'>
      <label>
        <span class='label'>Pick a movie:</span>
        <select data-select=''>
          <option value='10'>The Guard ($10)</option>
          <option value='12'>Harry Potter ($12)</option>
          <option value='8'>Detachment ($8)</option>
          <option value='9'>Sing Street ($9)</option>
        </select>
      </label>
    </div>

    <ul class='showcase'>
      ${[...Array(3).keys()].map(row => `
        <li>
          <div class='seat ${row === 1 ? 'selected' : ''} ${row === 2 ? 'occupied' : ''}'></div>
          <small>
              ${row === 0 ? 'N/A' : ''}
              ${row === 1 ? 'Selected' : ''}
              ${row === 2 ? 'Occupied' : ''}
          </small>
        </li>
      `).join('')}
    </ul>

    <div class='container' data-booking=''>
      <div class='screen'></div>
      ${[...Array(6).keys()].map(row => `
        <div class='row'>
          ${row === 0 ? `${[...Array(8).keys()].map(index => `<button class='seat'></button>`).join('')}` : ''}
          ${row === 1 ? `${[...Array(8).keys()].map(index => index === 3 || index === 4 ? `<button class='seat occupied'></button>` : `<button class='seat'></button>`).join('')}` : ''}
          ${row === 2 ? `${[...Array(8).keys()].map(index => index === 6 || index === 7 ? `<button class='seat occupied'></button>` : `<button class='seat'></button>`).join('')}` : ''}
          ${row === 3 ? `${[...Array(8).keys()].map(index => `<button class='seat'></button>`).join('')}` : ''}
          ${row === 4 ? `${[...Array(8).keys()].map(index => index === 3 || index === 4 ? `<button class='seat occupied'></button>` : `<button class='seat'></button>`).join('')}` : ''}
          ${row === 5 ? `${[...Array(8).keys()].map(index => index === 4 || index === 5 || index === 6 ? `<button class='seat occupied'></button>` : `<button class='seat'></button>`).join('')}` : ''}
        </div>
      `).join('')}
    </div>

    <p class='result'>
      You have selected <span data-count>0</span> seats for a price of $<span data-total>0</span>
    </p>
  </div>

  <a class='app-author' href='https://github.com/nagoev-alim' target='_blank'>${feather.icons.github.toSvg()}</a>
</div>
`;

// ⚡️Create Class
class App {
  constructor() {
    this.DOM = {
      container: document.querySelector('[data-booking]'),
      seats: document.querySelectorAll('.row .seat:not(.occupied)'),
      count: document.querySelector('[data-count]'),
      total: document.querySelector('[data-total]'),
      select: document.querySelector('[data-select]'),
    };

    this.PROPS = {
      ticketPrice: Number(this.DOM.select.value),
    };

    this.storageGetData();
    this.updateSelected();

    this.DOM.container.addEventListener('click', this.containerHandler);
    this.DOM.select.addEventListener('change', this.selectHandler);
  }

  /**
   * @function storageGetData - Get data from local storage
   */
  storageGetData = () => {
    const selectedSeats = JSON.parse(localStorage.getItem('seats'));

    if (selectedSeats !== null && selectedSeats.length > 0) {
      this.DOM.seats.forEach((seat, index) => {
        if (selectedSeats.indexOf(index) > -1) seat.classList.add('selected');
      });
    }

    const selectedMovieIndex = localStorage.getItem('movieIndex');

    if (selectedMovieIndex !== null) this.DOM.select.selectedIndex = selectedMovieIndex;
  };

  /**
   * @function updateSelected - Get selected seats and calculate total price
   */
  updateSelected = () => {
    const selectedSeats = document.querySelectorAll('.row .seat.selected');
    localStorage.setItem('seats', JSON.stringify([...selectedSeats].map(seat => [...this.DOM.seats].indexOf(seat))));
    this.DOM.count.innerText = selectedSeats.length;
    this.DOM.total.innerText = selectedSeats.length * this.PROPS.ticketPrice;
  };

  /**
   * @function containerHandler - Seat container click handler
   * @param target
   */
  containerHandler = ({ target }) => {
    if (target.classList.contains('seat') && !target.classList.contains('occupied')) {
      target.classList.toggle('selected');
      this.updateSelected();
    }
  };

  /**
   * @function selectHandler - Select element change event handler
   * @param selectedIndex
   * @param value
   */
  selectHandler = ({ target: { selectedIndex, value, text } }) => {
    this.PROPS.ticketPrice = Number(value);
    this.storageSaveMovie(selectedIndex);
    this.updateSelected();
  };

  /**
   * @function storageSaveMovie - Save selected movie price and id
   * @param index
   */
  storageSaveMovie = (index) => localStorage.setItem('movieIndex', index);
}

// ⚡️Class instance
new App();
