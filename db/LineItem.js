const conn = require('./conn');
const Sequelize = conn.Sequelize;

const LineItem = conn.define('lineItem', {
  quantity: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  }
});

module.exports = LineItem;
