const conn = require('./conn');

const sync = ()=> {
  return conn.sync({ force: true });
};

const Product = require('./Product');
const Order = require('./Order');
const LineItem = require('./LineItem');


LineItem.belongsTo(Product);
LineItem.belongsTo(Order);
Order.hasMany(LineItem);

const seed = ()=> {
  return Promise.all([
    Product.create({ name: 'foo' }),
    Product.create({ name: 'bar' }),
    Product.create({ name: 'bazz' }),
  ]);
};

module.exports = {
  sync,
  seed,
  models: {
    Product,
    Order,
    LineItem
  }
};
