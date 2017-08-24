const db = require('./db');
const { Product, Order, LineItem } = db.models;
const express = require('express');
const pug = require('pug');
const path = require('path');
const app = express();

app.use(require('body-parser')({ urlencoded: false }));
app.use(require('method-override')('_method'));

app.use('/vendor', express.static(path.join(__dirname, 'node_modules')));

app.set('view engine', 'html');
app.engine('html', pug.renderFile);

app.use((req, res, next)=> {
  Promise.all([
    Order.getCart(),
    Product.findAll(),
    Order.getOrders()
  ])
  .then( ( [ cart, products, orders ]) => {
    res.locals.cart = cart;
    res.locals.products = products;
    res.locals.orders = orders;
    next();
  })
  .catch(next);
});

app.get('/', (req, res, next)=> {
  res.render('index');
});

app.use('/orders', require('./routes/orders'));


const port = process.env.PORT || 3000;

db.sync()
  .then(db.seed)
  .then(()=> {
    app.listen(port, ()=> {
      console.log(`listening on port ${port}`);
    });
  })
  .catch( ex => console.log(ex));
