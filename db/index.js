const pg = require('pg');
const uuid = require('uuid')
const client = new pg.Client(`postgres://localhost/${process.env.DB_NAME}`);

const initTables = async () => {
  const SQL = /*SQL*/ `
  DROP TABLE IF EXISTS customer;  
  DROP TABLE IF EXISTS restaurant;
  DROP TABLE IF EXISTS reservation; 
 
    CREATE TABLE customer(
      id UUID PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE
    ); 
    CREATE TABLE restaurant(
      id UUID PRIMARY KEY,
      name VARCHAR(100) NOT NULL
    );
    CREATE TABLE reservation(
      id UUID PRIMARY KEY, 
      date TIMESTAMP NOT NULL DEFAULT now(),
      party_count INTEGER NOT NULL
      customer_id UUID REFERENCES customer(id) NOT NULL, 
      restaurant_id UUID REFERENCES restaurant(id) NOT NULL
    );
  `
  await client.query(SQL);
}

const createCustomer = async (name) => {
  const SQL = /*SQL*/ `
    INSERT INTO customer(id, name) VALUES($1, $2) RETURNING *
  `;
  const { rows } = await client.query(SQL, [uuid.v4(), name]);
  return rows[0];
}

const createRestaurant = async (name) => {
  const SQL = /*SQL*/ `
    INSERT INTO restaurant(id, name) VALUES($1, $2) RETURNING *;
  `;
  const { rows } = await client.query(SQL, [uuid.v4(), name]);
  return rows[0];
}

const createReservation = async ({Restaurant_id, customer_id, travel_date}) => {
  const SQL = /*SQL*/ `
    INSERT INTO reservation(id, date, party_count, customer_id, restaurant_id) VALUES($1, $2, $3, $4, $5) RETURNING *;
  `;
  const { rows } = await client.query(SQL, [uuid.v4(), Restaurant_id, customer_id, travel_date]);
  return rows;
}

const fetchCustomer = async () => {
  const SQL = /*SQL*/ `SELECT * from customer`
  const { rows } = await client.query(SQL);
  return rows;
}
const fetchRestaurant = async () => {
  const SQL = /*SQL*/ `SELECT * from restaurant`
  const { rows } = await client.query(SQL);
  return rows;
}
const fetchReservation = async () => {
  const SQL = /*SQL*/ `SELECT * from reservation`
  const { rows } = await client.query(SQL);
  return rows;
}

const deleteReservation =  async ({id, customer_id}) => { 
  const SQL = /*SQL*/ `DELETE FROM reservation WHERE id=$1 AND customer_id=$2 RETURNING *`
  await client.query(SQL, [id, customer_id])
}

const seed = async () => {
  await Promise.all([
    createCustomer({name: 'Meg'}),
    createCustomer({name: 'Anastasia'}),
    createCustomer({name: 'Hasan'}),
    createCustomer({name: 'Jeff'}),
    createRestaurant({name: 'Taco Bell'}),
    createRestaurant({name: 'Chipotle'}),
    createRestaurant({name: 'McDs'}),
    createRestaurant({name: 'Cava'}),
  ]); 

  console.log('customer created: ', await fetchCustomer()); 
  const customer = await fetchCustomer(); 
  console.log('restaurant created: ', await fetchRestaurant()); 
  const restaurant = await fetchRestaurant(); 

  await Promise.all([
    createReservation({
      customer_id: customer[0].id,
      Restaurant_id: restaurant[3].id,
      travel_date: '11/4/24'
    }),
    createReservation({
      customer_id: customer[1].id,
      Restaurant_id: restaurant[2].id,
      travel_date: '5/14/26'
    }),
    createReservation({
      customer_id: customer[2].id,
      Restaurant_id: restaurant[1].id,
      travel_date: '1/1/27'
    }),
    createReservation({
      customer_id: customer[3].id,
      Restaurant_id: restaurant[0].id,
      travel_date: '9/12/24'
    }),
  ])
  console.log("reservation created: ", await fetchReservation())
}



module.exports = {
  client, 
  initTables,
  createCustomer,
  createRestaurant,
  createReservation,
  fetchCustomer,
  fetchRestaurant,
  fetchReservation,
  deleteReservation,
  seed
}