const express = require('express')
const router = express.Router()
const recipe_model = require('../models/recipe.model')
const multer = require('multer')
const storage = multer.diskStorage({
  destination:(req, file, callback)=> {
    callback(null, "../frontend/public/uploads");
  },
  filename:(req, file, callback)=>{
    callback(null, file.originalname);
  }
})

const upload = multer({storage: storage});

//add recipe

router.post('/recipes', async (req, res)=> {
    if (! req.body.recipe_title){
        res.status(404).send("Please enter a recipe title");
        return;
    }
    const foundRecipe = await recipe_model.findOne({ recipe_title: req.body.recipe_title});
    if (foundRecipe!==null){
        res.status(422).send("This recipe already exists");
      return;
    }
    const new_recipe = new recipe_model({
    recipe_title: req.body.recipe_title,
    recipe_ingredients: req.body.recipe_ingredients,
    recipe_image:  req.body.recipe_image,
    recipe_steps: req.body.recipe_steps,
    recipe_tags: req.body.recipe_tags
    });

    try {
        await recipe_model.create(new_recipe);
        res.status(200).send("Recipe created successfully");
      }
      catch (error) {
        res.status(500).send(error);
      }
})

//view all recipes

router.get('/recipes',async (req, res)=> {
    const recipes = await recipe_model.find({});
    res.send(recipes)
})

//view single recipe

router.get('/recipes/:recipe_title', async (req, res)=> {
    const recipe = await recipe_model.findOne({ recipe_title: req.params.recipe_title });
    if (!recipe) {
        res.status(404).send("Recipe not found");
        return;
    }
    else{
        res.send(recipe);
    }
})

//update recipe

router.put('/recipes/:id',upload.single('recipe_image'), async (req, res)=> {
    var recipe = await recipe_model.findOne({ _id: req.params.id });
        if (!recipe) {
            res.status(404).send("Recipe not found");
            return;
        }
        var image = null;
        if (req.file){
            image = req.file.originalname;
        }
        const otherRecipe = await recipe_model.findOne({ recipe_title: req.body.recipe_title });
        if(otherRecipe){
            res.status(409).send("A recipe with this title already exists");
            return;
        }
            await recipe_model.replaceOne(
            { _id: req.params.id },
            { recipe_title: req.body.recipe_title,
              recipe_ingredients :  req.body.recipe_ingredients,
              recipe_steps: req.body.recipe_steps,
              recipe_image:image
             }
          )


})

//delete recipe

router.delete('/recipes/:recipe_title', async (req, res)=> {
    try {
        const recipe = await recipe_model.findOne({ recipe_name: req.params.recipe_name });
        if (!recipe) {
          res.status(404).send("Recipe not found");
          return;
        }
  
        await recipe_model.deleteOne({ recipe_title: req.params.recipe_title });
        res.send("Recipe deleted successfully");
      }
      catch (error) {
        res.status(500).send(error.message);
      }
})



module.exports = router;