const CITY_API_URL = 'http://api.travelpayouts.com/data/ru/cities.json',
  PROXY = 'https://cors-anywhere.herokuapp.com/',
  API_KEY = '756ee7f5074b93862f1b9f343e97dff9',
  CALENDAR = 'http://min-prices.aviasales.ru/calendar_preload';

let cities = [];

const formSearch = document.querySelector('.form-search'),
  inputCitiesFrom = formSearch.querySelector('.input__cities-from'),
  dropdownCitiesFrom = formSearch.querySelector('.dropdown__cities-from'),
  inputCitiesTo = formSearch.querySelector('.input__cities-to'),
  dropdownCitiesTo = formSearch.querySelector('.dropdown__cities-to'),
  inputDateDepart = formSearch.querySelector('.input__date-depart'),
  cheapestTicket = document.getElementById('cheapest-ticket'),
  otherCheapTickets = document.getElementById('other-cheap-tickets');

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

// Function for sort

const sortByField = (field) => {return (a, b) => a[field] > b[field] ? 1 : -1};

// Function for displaying dropdown list when type in input

const showDropdown = (input, list, data = []) => {
  list.textContent = '';
  const inputValue = input.value.toLowerCase().trim();

  if (!inputValue) return;

  const dropdownList = data.filter(item => {
    const itemName = item.name.toLocaleLowerCase();
    return itemName.startsWith(inputValue);
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

// Get number of changes

const getNumberOfChanges = (number) => {
  return number > 0 ?  'Кол-во персадок: ' + number : 'Без пересадок';
};

// Get name of city by its code

const getCityName = (code) => {
  const cityCode = cities.find(item => item.code === code);
  return cityCode.name;
};

// Function for convert date

const convertDate = (date) => {
  return new Date(date).toLocaleString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Get sales link for a ticket

const getSalesLink = (data) => {
  const date = new Date(data.depart_date);
  const day = date.getDate();
  const updateDay = day < 10 ? '0' + day : day;
  const month = date.getMonth() + 1;
  const updateMonth = month < 10 ? '0' + month : month;

  return 'https://www.aviasales.ru/search/' + data.origin + updateDay + updateMonth + data.destination + '1';
};

// Create card for tickets

const createCard = (data) => {
  const card = document.createElement('article');
  card.classList.add('ticket');
  let cardBlock = '';
  console.log(data);

  if (data) {
    const {gate, value, origin, number_of_changes, destination, depart_date} = data;
    cardBlock = `
    <h3 class="agent">${gate}</h3>
    <div class="ticket__wrapper">
      <div class="left-side">
        <a href=${getSalesLink(data)} class="button button__buy" target="_blank">Купить за ${value}₽</a>
      </div>
      <div class="right-side">
        <div class="block-left">
          <div class="city__from">Вылет из города
            <span class="city__name">${getCityName(origin)}</span>
          </div>
          <div class="date">${convertDate(depart_date)}</div>
        </div>    
        <div class="block-right">
          <div class="changes">${getNumberOfChanges(number_of_changes)}</div>
          <div class="city__to">Город назначения:
            <span class="city__name">${getCityName(destination)}</span>
          </div>
        </div>
      </div>
    </div>
    `
  } else {
    cardBlock = `<p>К сожалению, билетов нет. Попробуйте выбрать другую дату</p>`
  }

  card.insertAdjacentHTML('afterbegin', cardBlock);
  return card;
};

// Get tickets

const renderCheapTickets = (items) => {
  otherCheapTickets.innerHTML = '<h2>Самые дешевые билеты на другие даты</h2>';
  items.sort(sortByField('value'));
  // console.log(items)
};

const renderCheapTicket = (items) => {
  cheapestTicket.innerHTML = '<h2>Самый дешевый билет на выбранную дату</h2>';
  const cheapTicket = createCard(items[0]);
  cheapestTicket.append(cheapTicket);
};

const getTickets = (data, date) => {
  const ticketsAll = JSON.parse(data).best_prices;
  const ticketsDay = ticketsAll.filter(item => date === item.depart_date);

  renderCheapTickets(ticketsAll);
  renderCheapTicket(ticketsDay);
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

  const fromCity = cities.find(item => inputCitiesFrom.value === item.name),
  toCity = cities.find(item => inputCitiesTo.value === item.name);

  const formData = {
    from: fromCity,
    to: toCity,
    date: inputDateDepart.value
  };

  const {from, to, date} = formData;

  if (from && to) {
    const getTicketsStringParam = `?origin=${from.code}&destination=${to.code}&depart_date=${date}&one_way=true`;

    getData(CALENDAR + getTicketsStringParam, (data) => {
      getTickets(data, date);
    });

  } else {
    alert('Enter a correct city name!');
  }
});

// Get cities from API

getData(PROXY + CITY_API_URL, (data) => {
  cities = JSON.parse(data).filter(item => item.name).sort(sortByField('name'));
  console.log(cities);
});