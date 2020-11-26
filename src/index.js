import axios from 'axios';


const userList = document.querySelector('#user-list');
const restaurantList = document.getElementById('restaurant-list');
const reservationList = document.getElementById('reservation-list');

let users;
let sales;
let restaurants

const renderUsers = (users) => {
  const userId = window.location.hash.slice(1)*1;
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

const renderRestaurants = async(restaurants) => {
  const reservations = (await axios.get('/api/reservations')).data;
  const html = restaurants
    .map(
      (restaurant) => `
    <li res-id = '${restaurant.id}'>${restaurant.name} (${reservations.filter(reservation=>reservation.restaurant.id===restaurant.id).length})</li>
    `
    )
    .join('');
  restaurantList.innerHTML = html;
};

const renderSales = (sales) => {
  const html = sales
    .map(
      (sale) =>
        `<li sale-id='${sale.id}'>${sale.restaurant.name}  @ ${sale.createdAt.slice(11, -1)}  <button>X</button></li>`
    )
    .join('');
  reservationList.innerHTML = html;
};

window.addEventListener('hashchange', async () => {
  const userId = window.location.hash.slice(1)*1;
  const url = `/api/users/${userId}/reservations`;
  sales = (await axios.get(url)).data;
  users = (await axios.get('/api/users')).data;
  renderSales(sales);
  renderUsers(users);
});

restaurantList.addEventListener('click', async(ev) => {
  const userId = window.location.hash.slice(1)*1;
  users = (await axios.get('/api/users')).data;
  const user = users.filter(user=>user.id===userId)[0].name
  const reservation = {
    userId,
    restaurantId: ev.target.getAttribute('res-id')*1
  }
  const res = (await axios.post(`/api/users/${userId}/reservations`,reservation)).data;
  const url = `/api/users/${userId}/reservations`;
  sales = (await axios.get(url)).data;
  renderSales(sales);
})

reservationList.addEventListener('click', async(ev) => {
  if(ev.target.tagName==='BUTTON'){
    const userId = window.location.hash.slice(1)*1;
    const saleId = ev.target.parentElement.getAttribute('sale-id')*1
    const res = (await axios.delete(`/api/reservations/${saleId}`));
    const url = `/api/users/${userId}/reservations`;
    const sales = (await axios.get(url)).data;
    renderSales(sales);
  }
})

const init = async () => {
  try {
    users = (await axios.get('/api/users')).data;
    restaurants = (await axios.get('/api/restaurants')).data;
    renderUsers(users);
    renderRestaurants(restaurants);
    let userId = window.location.hash.slice(1);
    if(!userId){
      userId = users[0].id
    }
    const url = `/api/users/${userId}/reservations`;
    sales = (await axios.get(url)).data;
    renderSales(sales);
  } catch (err) {
    console.log(err);
  }
};
init();
