require('dotenv').config();
const express = require('express');
const { client, initTables, seed } = require('./db');
const morgan = require('morgan');
const apiRouter = require('./api');

const app = express(); 
app.use(express.json());
app.use(morgan('combined'))

const init = async () => {

  await client.connect(); 
  console.log('db connected')
  await initTables(); 
  console.log('tables created')
  await seed(); 
  console.log('data seeded')

  app.listen(process.env.PORT, () => {
    console.log(`server is listening on port ${process.env.PORT}`);
  });
}; 


app.use((err, req, res, next) => {
  res.status(500).send(err.message);
})

app.use('/api', apiRouter);

init();
