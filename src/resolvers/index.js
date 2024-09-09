const { mergeResolvers } = require('@graphql-tools/merge');
const productsResolvers = require('./productsResolver');
const cartResolvers = require('./cartResolver');
const authResolvers = require('./authResolver');
const checkoutResolver = require('./checkoutResolver');
const boysResolvers = require('./boysResolvers');
const deliveryHistoryResolvers = require('./boyHistoryResolver');
const categoriesResolvers = require('./categoriesResolvers');

const resolvers = mergeResolvers([authResolvers, productsResolvers, cartResolvers, checkoutResolver, boysResolvers, deliveryHistoryResolvers, categoriesResolvers]);

module.exports = resolvers;
