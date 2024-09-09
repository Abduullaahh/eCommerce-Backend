const { mergeTypeDefs } = require('@graphql-tools/merge');
const productsTypeDefs = require('./productsSchema');
const cartTypeDefs = require('./cartSchema');
const authTypeDefs = require('./authSchema');
const checkoutTypeDefs = require('./checkoutSchema');
const boysTypeDefs = require('./boysSchema');
const deliveryHistoryTypeDefs = require('./boyHistorySchema');
const categoriesTypeDefs = require('./categoriesSchema');

const typeDefs = mergeTypeDefs([authTypeDefs, productsTypeDefs, cartTypeDefs, checkoutTypeDefs, boysTypeDefs, deliveryHistoryTypeDefs, categoriesTypeDefs]);

module.exports = typeDefs;
