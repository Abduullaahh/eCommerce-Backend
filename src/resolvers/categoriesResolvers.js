const Category = require('../models/categories');

const categoryResolvers = {
  Query: {
    categories: async () => {
      try {
        return await Category.find();
      } catch (error) {
        console.error('Error fetching categories:', error);
        throw new Error('Failed to fetch categories');
      }
    },
  },
  Mutation: {
    addCategory: async (_, { name }) => {
      try {
        const newCategory = new Category({ name });
        await newCategory.save();
        return newCategory;
      } catch (error) {
        console.error('Error adding category:', error);
        throw new Error('Failed to add category');
      }
    },
  },
};

module.exports = categoryResolvers;