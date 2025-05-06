import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

const startButton = document.querySelector("[data-start]");
const datetimeInput = document.querySelector("#datetime-picker");
const daysElement = document.querySelector("[data-days]");
const hoursElement = document.querySelector("[data-hours]");
const minutesElement = document.querySelector("[data-minutes]");
const secondsElement = document.querySelector("[data-seconds]");

let userSelectedDate;
let timerId = null;
startButton.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
//   dateFormat: "Y-m-d H:i",
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];

    if (!userSelectedDate || userSelectedDate <= new Date()) {
      iziToast.error({
        message: "Please choose a date in the future",
        position: "topRight",
      });
      startButton.disabled = true;
    } else {
      startButton.disabled = false;
    }
  },
};

flatpickr(datetimeInput, options);

startButton.addEventListener("click", () => {
  if (!userSelectedDate) return;

  startButton.disabled = true;
  datetimeInput.disabled = true;

  timerId = setInterval(() => {
    const now = new Date();
    const delta = userSelectedDate - now;

    if (delta <= 0) {
      clearInterval(timerId);
      updateTimer(0);
      datetimeInput.disabled = false;
      return;
    }

    updateTimer(delta);
  }, 1000);
});

function updateTimer(ms) {
  const time = convertMs(ms);
  const timeElements = {
    days: daysElement,
    hours: hoursElement,
    minutes: minutesElement,
    seconds: secondsElement,
  };

  for (const key in timeElements) {
    timeElements[key].textContent = addLeadingZero(time[key]);
  }
}


