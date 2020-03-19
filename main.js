const cities = ['Киев', 'Харьков', 'Львов', 'Хмельницкий', 'Одесса', 'Мирноград', 'Миргород', 'Черновцы', 'Каменец-Подольский', 'Кривой Рог', 'Днепр', 'Николаев', 'Бердянск'];

const formSearch = document.querySelector('.form-search'),
  inputCitiesFrom = formSearch.querySelector('.input__cities-from'),
  dropdownCitiesFrom = formSearch.querySelector('.dropdown__cities-from'),
  inputCitiesTo = formSearch.querySelector('.input__cities-to'),
  dropdownCitiesTo = formSearch.querySelector('.dropdown__cities-to');

const showCities = (input, list) => {
  list.textContent = '';
  const inputValue = input.value.toLowerCase().trim();

  if (!inputValue) return;

  const citiesList = cities.filter(item => {
    return item.toLocaleLowerCase().includes(inputValue);
  });

  citiesList.map(item => {
    const li = document.createElement('li');
    li.classList.add('dropdown__city');
    li.textContent = item;
    list.append(li);
  });
};

inputCitiesFrom.addEventListener('input', () => {
  showCities(inputCitiesFrom, dropdownCitiesFrom);
});

inputCitiesTo.addEventListener('input', () => {
  showCities(inputCitiesTo, dropdownCitiesTo);
});