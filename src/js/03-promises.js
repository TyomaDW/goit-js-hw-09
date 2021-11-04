import { Notify } from 'notiflix/build/notiflix-notify-aio';

const formEl = document.querySelector('.form');
const delayEl = formEl.querySelector('[name=delay]');
const stepEl = formEl.querySelector('[name=step]');
const amountEl = formEl.querySelector('[name=amount]');

formEl.addEventListener('submit', submitPromise);

function submitPromise(evt) {
  evt.preventDefault();

  let position = 1;
  let delay = Number(delayEl.value);
  let step = Number(stepEl.value);

  for (let index = 0; index < amountEl.value; index += 1, position += 1, delay += step) {
    createPromise(position, delay)
      .then(({ position, delay }) => {
        Notify.success(`✅ Fulfilled promise ${position} in ${delay}ms`);
      })
      .catch(({ position, delay }) => {
        Notify.failure(`❌ Rejected promise ${position} in ${delay}ms`);
      });
  }
}

function createPromise(position, delay) {
  const shouldResolve = Math.random() > 0.3;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldResolve) {
        resolve({ position, delay });
      } else {
        reject({ position, delay });
      }
    }, delay);
  });
}
