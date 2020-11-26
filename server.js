const {conn,syncAndSeed,model:{User,Reservation,Restaurant}}=require('./db')
const express = require('express');
const app = express();
const routes = require('./routes');


app.use('/',routes);


const port = process.env.PORT || 3000;

const init = async () => {
  await syncAndSeed();
  app.listen(port, () => console.log(`listening on port ${port}`));
};

init();
