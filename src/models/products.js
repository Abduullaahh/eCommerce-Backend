const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
});

// Add a virtual 'id' field that returns the _id as a string
// productSchema.virtual('id').get(function() {
//   return this._id.toHexString();
// });

// // Ensure virtual fields are serialized
// productSchema.set('toJSON', {
//   virtuals: true
// });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
