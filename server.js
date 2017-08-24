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

app.put('/orders/:id', (req, res, next)=> {
  Order.findById(req.params.id)
    .then( order => {
      Object.assign(order, req.body);
      return order.save();
    })
    .then( () => res.redirect('/'))
    .catch(ex => {
      console.log(ex);
      if(ex.message === 'address required'){
        return res.render('index', { error: ex });
      }
      next(ex);
    });
});

app.post('/orders/:id/lineItems', (req, res, next)=> {
  Order.addProductToCart(req.body.productId*1)
    .then( ()=> res.redirect('/'))
    .catch(next);
});

app.delete('/orders/:orderId/lineItems/:id', (req, res, next)=> {
    LineItem.destroy({
      where: {
        id: req.params.id
      }
    })
    .then( ()=> res.redirect('/'))
    .catch(next);
});

const port = process.env.PORT || 3000;

db.sync()
  .then(db.seed)
  .then(()=> {
    app.listen(port, ()=> {
      console.log(`listening on port ${port}`);
    });
  })
  .catch( ex => console.log(ex));
