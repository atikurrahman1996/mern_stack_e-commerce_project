const { Schema, model } = require("mongoose");

//name, slug, descriptions, price, quantity,  image, sold, shipping

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      unique: true,
      minLength: [3, "The minimum leanght of catagory name is 3 characters"],
    },

    slug: {
      type: String,
      required: [true, "Product slug is required"],
      lowercase: true,
      unique: true,
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      unique: true,
      minLength: [
        3,
        "The minimum leanght of Product description is 3 characters",
      ],
    },

    price: {
      type: Number,
      required: [true, "Product price is required"],
      trim: true,

      validate: {
        validator: (v) => v > 0,
        message: (props) =>
          `${props.value} is not a valid price! price must be greater than 0 `,
      },
    },

    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
      trim: true,

      validate: {
        validator: (v) => v > 0,
        message: (props) =>
          `${props.value} is not a valid quantity! quantity must be greater than 0 `,
      },
    },
    sold: {
      type: Number,
      required: [true, "Sold quantity is required"],
      trim: true,
      default: 0,
    },
    shipping: {
      type: Number,
      default: 0, // shipping free -0, otherwise some ammount
    },

    image: {
      type: Buffer,
      contentType: String,
      //required: [true, "Product Image is required"],
    },

    catagory: {
      type: Schema.Types.ObjectId,
      ref: "Catagory",
      required: true,
    },
  },

  // timestamps will return two value , created at and updated at

  { timestamps: true }
);

//Create model

const Product = model("Product", productSchema);

module.exports = Product;
