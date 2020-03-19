const cities = ['Киев', 'Харьков', 'Львов', 'Хмельницкий', 'Одесса', 'Мирноград', 'Миргород', 'Черновцы', 'Каменец-Подольский', 'Кривой Рог', 'Днепр', 'Николаев', 'Бердянск'];

const formSearch = document.querySelector('.form-search'),
  inputCitiesFrom = formSearch.querySelector('.input__cities-from'),
  dropdownCitiesFrom = formSearch.querySelector('.dropdown__cities-from'),
  inputCitiesTo = formSearch.querySelector('.input__cities-to'),
  dropdownCitiesTo = formSearch.querySelector('.dropdown__cities-to');

// Function for displaying dropdown list when type in input

const showDropdown = (input, list, data = []) => {
  list.textContent = '';
  const inputValue = input.value.toLowerCase().trim();

  if (!inputValue) return;

  const dropdownList = data.filter(item => {
    return item.toLocaleLowerCase().includes(inputValue);
  });

  dropdownList.map(item => {
    const li = document.createElement('li');
    li.classList.add('dropdown__city');
    li.textContent = item;
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