const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const RecipeSchema = new Schema ({
    recipe_title: {
        type: String,
        required: true,
        unique: true
      },
      recipe_image: {
        type: String,
        default: null
      },
      recipe_ingredients: {
          type: [String],
          default: null
        },
        recipe_steps: {
          type: String,
          default: null
        },
})

module.exports = mongoose.model('recipes', RecipeSchema)