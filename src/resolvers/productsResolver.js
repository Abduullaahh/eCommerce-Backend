const Product = require('../models/products');
const Cart = require('../models/cart');
const Category = require('../models/categories');

const ProductResolvers = {
  Query: {
    product: async (parent, args) => {
      try {
        // Fetch the product by ID
        const product = await Product.findById(args.id).lean();
    
        if (!product) {
          return null;
        }
    
        // Fetch the required category for the product
        const category = product.categoryId ? await Category.findById(product.categoryId).lean() : null;
    
        return {
          ...product,
          id: product._id.toString(),
          category: category
            ? { id: category._id.toString(), name: category.name }
            : null
        };
    
      } catch (error) {
        console.error('Error fetching product:', error);
        throw new Error(`Error fetching product: ${error.message}`);
      }
    },
    products: async () => {
      try {
        // Fetch all products and categories in parallel
        const [products, categories] = await Promise.all([
          Product.find().lean(),
          Category.find().lean()
        ]);
    
        // Create a category map for easy lookup
        const categoryMap = new Map(categories.map(category => [category._id.toString(), category.name]));
    
        // Map through products to attach category info
        const productsWithCategory = products.map(product => {
          const categoryId = product.categoryId?.toString();
          const categoryName = categoryId ? categoryMap.get(categoryId) : null;
    
          return {
            ...product,
            id: product._id.toString(),
            category: categoryId
              ? { id: categoryId, name: categoryName || 'Unknown Category' }
              : null
          };
        });
    
        return productsWithCategory;
    
      } catch (error) {
        console.error('Error fetching products:', error);
        throw new Error(`Error fetching products: ${error.message}`);
      }
    },
  },
  Mutation: {
    addProduct: async (parent, args) => {
      try {
        let categoryId = null;
        if (args.categoryId) {
          const category = await Category.findById(args.categoryId);
          if (!category) {
            throw new Error("Category not found");
          }
          categoryId = category._id;
        }

        const newProduct = new Product({
          name: args.name,
          description: args.description,
          price: args.price,
          quantity: args.quantity,
          categoryId: categoryId
        });

        const savedProduct = await newProduct.save();
        
        // Instead of populating, we'll fetch the category separately if it exists
        let category = null;
        if (savedProduct.categoryId) {
          category = await Category.findById(savedProduct.categoryId);
        }

        return {
          ...savedProduct.toObject(),
          id: savedProduct._id.toString(),
          category: category ? {
            id: category._id.toString(),
            name: category.name
          } : null
        };
      } catch (error) {
        console.error("Error adding product:", error);
        throw new Error("Failed to add product: " + error.message);
      }
    },
    updateProduct: async (parent, args) => {
      try {
        let updateData = {
          name: args.name,
          description: args.description,
          price: args.price,
          quantity: args.quantity
        };

        if (args.categoryId !== undefined) {
          if (args.categoryId) {
            const category = await Category.findById(args.categoryId);
            if (!category) {
              throw new Error("Category not found");
            }
            updateData.categoryId = category._id;
          } else {
            // If categoryId is explicitly set to null, remove the category
            updateData.categoryId = null;
          }
        }

        const updatedProduct = await Product.findByIdAndUpdate(
          args.id,
          { $set: updateData },
          { new: true, runValidators: true }
        );

        if (!updatedProduct) {
          throw new Error("Product not found");
        }

        // Populate the category manually to avoid issues with strictPopulate
        let populatedProduct = updatedProduct;
        if (updatedProduct.categoryId) {
          const category = await Category.findById(updatedProduct.categoryId);
          populatedProduct = {
            ...updatedProduct.toObject(),
            category: category ? {
              id: category._id.toString(),
              name: category.name
            } : null
          };
        }

        if (updatedProduct) {
          // Update the product in all carts
          await Cart.updateMany(
            { productId: args.id },
            { $set: { 'product': updatedProduct } }
          );
        }

        console.log("Updated product:", populatedProduct);

        return {
          ...populatedProduct,
          id: populatedProduct._id.toString(),
        };
      } catch (error) {
        console.error("Error updating product:", error);
        throw new Error("Failed to update product: " + error.message);
      }
    },
    deleteProduct: async (parent, args) => {
      try {
        const deletedProduct = await Product.findByIdAndDelete(args.id);

        if (!deletedProduct) {
          throw new Error("Product not found");
        }

        // Remove the product from all carts
        await Cart.deleteMany({ productId: args.id });

        // Fetch the category if it exists
        let category = null;
        if (deletedProduct.categoryId) {
          category = await Category.findById(deletedProduct.categoryId);
        }

        return {
          ...deletedProduct.toObject(),
          id: deletedProduct._id.toString(),
          category: category ? {
            id: category._id.toString(),
            name: category.name
          } : null
        };
      } catch (error) {
        console.error("Error deleting product:", error);
        throw new Error("Failed to delete product: " + error.message);
      }
    },
  },
};

module.exports = ProductResolvers;
