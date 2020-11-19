import axios from 'axios';

const userList = document.querySelector('#user-list');
const restaurantList = document.getElementById('restaurant-list');
const reservationList = document.getElementById('reservation-list');

const renderUsers = (users) => {
  const userId = window.location.hash.slice(1);

  const html = users
    .map(
      (user) => `
    <li class="${user.id === userId ? 'selected' : ''}"><a href="#${user.id}">${
        user.name
      }</a></li>
  `
    )
    .join('');
  userList.innerHTML = html;
};

const renderRestaurants = (restaurants) => {
  const html = restaurants
    .map(
      (restaurant) => `
    <li>${restaurant.name} </li>
    `
    )
    .join('');
  restaurantList.innerHTML = html;
};

const renderSales = (sales) => {
  const html = sales
    .map(
      (sale) =>
        `<li>${sale.restaurant.name}  @ ${sale.createdAt.slice(11, -1)}  </li>`
    )
    .join('');
  reservationList.innerHTML = html;
};

window.addEventListener('hashchange', async () => {
  const userId = window.location.hash.slice(1);
  console.log(userId, 'userId');
  const url = `/api/users/${userId}/reservations`;
  const sales = (await axios.get(url)).data;
  renderSales(sales);
  console.log(sales, 'sales');
});

console.log('testing');
const init = async () => {
  try {
    const users = (await axios.get('/api/users')).data;
    const restaurants = (await axios.get('/api/restaurants')).data;
    renderUsers(users);
    renderRestaurants(restaurants);
    const userId = window.location.hash.slice(1);
    console.log(userId, 'userId');
    const url = `/api/users/${userId}/reservations`;
    const sales = (await axios.get(url)).data;
    renderSales(sales);
    renderUsers(users);
  } catch (err) {
    console.log(err);
  }
};
init();
