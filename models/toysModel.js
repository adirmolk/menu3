const mongoose = require("mongoose");
const Joi = require("joi");

const toysSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    info: String,
    category: String,
    img_url: String,
    user_id: String,
  },
  { timestamps: true }
);

exports.toysModel = mongoose.model("toys", toysSchema);

exports.validatetoys = (_reqBody) => {
  const joiSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    img_url: Joi.string().min(2).max(1000).required(),
    info: Joi.string().min(2).max(1000).required(),
    category: Joi.string().min(2).max(100).required(),
    price: Joi.number().min(1).max(9999).required(),
  });
  return joiSchema.validate(_reqBody);
};
