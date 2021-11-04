import flatpickr from 'flatpickr';
import Notiflix from 'notiflix';
import 'flatpickr/dist/flatpickr.min.css';
require('flatpickr/dist/themes/dark.css');

const refs = {
  inputEl: document.querySelector('#datetime-picker'),
  btnStart: document.querySelector('[data-start]'),
  timerEl: document.querySelector('.timer'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

refs.btnStart.setAttribute('disabled', true);
refs.btnStart.classList.add('button');

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onClose(selectedDates) {
    const currentDate = Date.now();
    if (currentDate > selectedDates[0]) {
      return Notiflix.Notify.failure('Please choose a date in the future');
    }
    refs.btnStart.removeAttribute('disabled');
    refs.btnStart.addEventListener('click', () => {
      const start = setInterval(() => {
        const timer = Date.now() - currentDate;
        const timeDifference = selectedDates[0] - currentDate;
        const { days, hours, minutes, seconds } = convertMs(timeDifference - timer);
        if (timeDifference - timer > 0) {
          console.log('Обратный отсчет:', `${days}:${hours}:${minutes}:${seconds}`);
          updateTimer({ days, hours, minutes, seconds });
        } else {
          clearInterval(start);
          return Notiflix.Notify.success('Time is up!');
        }
      }, 1000);
    });
  },
};

flatpickr('#datetime-picker', options);
refs.btnStart.addEventListener('click', flatpickr);

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = addLeadingZero(Math.floor(ms / day));
  // Remaining hours
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  // Remaining minutes
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  // Remaining seconds
  const seconds = addLeadingZero(Math.floor((((ms % day) % hour) % minute) / second));

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function updateTimer({ days, hours, minutes, seconds }) {
  refs.days.textContent = `${days}`;
  refs.hours.textContent = `${hours}`;
  refs.minutes.textContent = `${minutes}`;
  refs.seconds.textContent = `${seconds}`;
}
