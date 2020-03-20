const CITY_API_URL = 'http://api.travelpayouts.com/data/ru/cities.json',
  PROXY = 'https://cors-anywhere.herokuapp.com/',
  API_KEY = '756ee7f5074b93862f1b9f343e97dff9',
  CALENDAR = 'http://min-prices.aviasales.ru/calendar_preload';

let cities = [];

const formSearch = document.querySelector('.form-search'),
  inputCitiesFrom = formSearch.querySelector('.input__cities-from'),
  dropdownCitiesFrom = formSearch.querySelector('.dropdown__cities-from'),
  inputCitiesTo = formSearch.querySelector('.input__cities-to'),
  dropdownCitiesTo = formSearch.querySelector('.dropdown__cities-to');

// Get data request

const getData = (url, callbackFunction) => {
  const request = new XMLHttpRequest();
  request.open('GET', url);
  request.addEventListener('readystatechange', () => {
    if (request.readyState !== 4) return;
    if (request.status === 200) {
      callbackFunction(request.response);
    } else {
      console.error(request.status);
    }
  });
  request.send();
};

// Function for displaying dropdown list when type in input

const showDropdown = (input, list, data = []) => {
  list.textContent = '';
  const inputValue = input.value.toLowerCase().trim();

  if (!inputValue) return;

  const dropdownList = data.filter(item => {
    const itemName = item.name.toLocaleLowerCase();
    return itemName.includes(inputValue);
  });

  dropdownList.map(item => {
    const li = document.createElement('li');
    li.classList.add('dropdown__city');
    li.textContent = item.name;
    list.append(li);
  });
};

// Function for filling an input with a clicked element

const fillInput = (input, list, e) => {
  const target = e.target;
  if (target.tagName.toLowerCase() === 'li') {
    input.value = target.textContent;
    list.textContent = '';
  }
};

// Display cities of direction from

inputCitiesFrom.addEventListener('input', () => {
  showDropdown(inputCitiesFrom, dropdownCitiesFrom, cities);
});

// Display cities of direction to

inputCitiesTo.addEventListener('input', () => {
  showDropdown(inputCitiesTo, dropdownCitiesTo, cities);
});

// Fill input of direction from

dropdownCitiesFrom.addEventListener('click', (e) => {
  fillInput(inputCitiesFrom, dropdownCitiesFrom, e);
});

// Fill input of direction to

dropdownCitiesTo.addEventListener('click', (e) => {
  fillInput(inputCitiesTo, dropdownCitiesTo, e);
});

// Form submit

formSearch.addEventListener('submit', (e) => {
  e.preventDefault();
});

// Get cities from API

getData(PROXY + CITY_API_URL, (data) => {
  cities = JSON.parse(data).filter(item => item.name);
});

// getData(PROXY + CALENDAR + "?origin=SVX&destination=KGD&depart_date=2020-05-15&one_way=true&token=" + API_KEY, getTicket);