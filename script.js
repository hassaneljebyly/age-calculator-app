const DAY_INPUT = document.getElementById('Day');
const MONTH_INPUT = document.getElementById('Month');
const YEAR_INPUT = document.getElementById('Year');
const SUBMIT_BTN = document.getElementById('submit-button');

DAY_INPUT.addEventListener('keyup', (e) => {
  formatInput(DAY_INPUT, 2, e.key);
});
MONTH_INPUT.addEventListener('keyup', (e) => {
  formatInput(MONTH_INPUT, 2, e.key);
});
YEAR_INPUT.addEventListener('keyup', (e) => {
  formatInput(YEAR_INPUT, 4, e.key);
});

SUBMIT_BTN.addEventListener('click', () => {
  // true if all inputs are valid, if not then the result is an array of errors
  const validationResult = validateInput([DAY_INPUT, MONTH_INPUT, YEAR_INPUT]);
  if (validationResult === true) {
    let { years, months, days } = calculateAge(DAY_INPUT, MONTH_INPUT, YEAR_INPUT);
    anime({
      targets: document.getElementById('years-span'),
      innerText: [0, years],
      easing: 'linear',
      round: true,
    });
    anime({
      targets: document.getElementById('months-span'),
      innerText: [0, months],
      easing: 'linear',
      round: true,
    });
    anime({
      targets: document.getElementById('days-span'),
      innerText: [0, days],
      easing: 'linear',
      round: true,
    });
  } else {
    displayError(validationResult);
  }
});

[DAY_INPUT, MONTH_INPUT, YEAR_INPUT].forEach((input) => {
  input.addEventListener('click', () => {
    removeErrors(input);
  });
});
function formatInput(input, length, key) {
  if (key != 'Backspace') {
    let value = input.value;
    // replace "e" and "."
    input.value = value.replaceAll(/([e\.])/gm, '');
    // make input length always 2
    value.length > length ? (input.value = value.slice(-length)) : '';
    // apply left pad, also avoid having "00"
    input.value = /[0-9]/.test(key) ? ('0' + value).slice(-length) : input.value;
  }
}
function validateInput(dateInputArray) {
  const DATE = new Date();
  let currentYear = DATE.getFullYear();
  let errors = [];
  let inputsToCheck = []; // so we only check none empty inputs
  dateInputArray.forEach((input) => {
    input.value === ''
      ? errors.push({
          target: input,
          message: 'This filed is required',
        })
      : inputsToCheck.push(input);
  });

  //
  let [dayInput, monthInput, yearInput] = dateInputArray;
  let selectedMonth;
  // 30 days months
  let standardMonths = [4, 6, 9, 11];
  // 31 days months
  let extendedMonths = [1, 3, 5, 7, 8, 10, 12];
  // for February
  let februaryLastDay = currentYear % 4 === 0 ? 29 : 28;

  // validate year
  if (inputsToCheck.includes(yearInput)) {
    if (Number(yearInput.value) > currentYear || Number(yearInput.value) === 0) {
      errors.push({
        target: yearInput,
        message: Number(yearInput.value) === 0 ? 'Must be a valid year' : 'Must be in the past',
      });
    }
  }
  // validate month
  if (inputsToCheck.includes(monthInput)) {
    if (Number(monthInput.value) < 1 || Number(monthInput.value) > 12) {
      errors.push({
        target: monthInput,
        message: 'Must be a valid month',
      });
    } else {
      selectedMonth = Number(monthInput.value);
    }
  }
  if (inputsToCheck.includes(dayInput)) {
    let day = Number(dayInput.value);
    if (day > 0 && day <= 31) {
      if (selectedMonth) {
        standardMonths.includes(selectedMonth) && day > 30
          ? errors.push({
              target: dayInput,
              message: 'Must be a valid day',
            })
          : '';
        extendedMonths.includes(selectedMonth) && day > 31
          ? errors.push({
              target: dayInput,
              message: 'Must be a valid day',
            })
          : '';
        selectedMonth === 2 && day > februaryLastDay
          ? errors.push({
              target: dayInput,
              message: 'Must be a valid day',
            })
          : '';
      }
    } else {
      errors.push({
        target: dayInput,
        message: 'Must be a valid day',
      });
    }
  }
  return errors.length === 0 ? true : errors;
}

function calculateAge(dayInput, monthInput, year_Input) {
  const date = new Date();
  let // birth year
    birthYear = Number(year_Input.value),
    // birth month
    birthMonth = Number(monthInput.value),
    // birth day
    birthDay = Number(dayInput.value),
    // current year
    currentYear = Number(date.getFullYear()),
    // current month
    currentMonth = Number(date.getMonth() + 1),
    // current day
    currentDay = Number(date.getDate()),
    days,
    months,
    years;
  // assuming months are 30 days long
  if (currentDay < birthDay) {
    days = currentDay - birthDay + 30;
    currentMonth = currentMonth - 1;
  } else {
    days = currentDay - birthDay;
  }

  if (currentMonth < birthMonth) {
    months = currentMonth - birthMonth + 12;
    currentYear = currentYear - 1;
  } else {
    months = currentMonth - birthMonth;
  }

  years = currentYear - birthYear;
  return { years, months, days };
}

function displayError(errorsArray) {
  errorsArray.forEach((error) => {
    let hintElement = document.getElementById(error.target.getAttribute('data-hint-id'));
    // add border
    error.target.classList.add('border-danger');
    // show message text
    hintElement.innerHTML = error.message;
    // add accessibility attribute
    error.target.setAttribute('aria-invalid', 'true');
    hintElement.setAttribute('aria-hidden', 'false');
    // because previous sibling selector doesn't work on firefox
    error.target.previousElementSibling.classList.add('label-error');
  });
}
function removeErrors(input) {
  let hintElement = document.getElementById(input.getAttribute('data-hint-id'));
  input.classList.remove('border-danger');
  hintElement.innerHTML = '';
  input.setAttribute('aria-invalid', 'false');
  hintElement.setAttribute('aria-hidden', 'true');
  input.previousElementSibling.classList.remove('label-error');
}
