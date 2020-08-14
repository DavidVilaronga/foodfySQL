const Recipe = require('../models/Recipe')

module.exports = {
    index(req, res){
        Recipe.all(function(recipes){
            return res.render("recipes/index", { recipes })
        })
    }, 
    create(req, res){
        Recipe.chefsSelectOptions((options)=>{
            return res.render("recipes/create", { chefsOptions: options })
        })
    },
    show(req, res){
        Recipe.find(req.params.id, (recipe) => {
            if (!recipe) return res.send("Recipe not Found!")

            return res.render("recipes/show", {recipe})
        })
    },
    edit(req, res){
        Recipe.find(req.params.id, (recipe)=>{

            Recipe.chefsSelectOptions((options)=>{
                return res.render('recipes/edit', { recipe, chefsOptions: options })
            })
        })    
    },
    post(req, res){
        const keys = Object.keys(req.body)
        for(key of keys) {
            if(req.body[key]==""){
                return res.send('Please, fill all fields!')
            }
        }
        
        Recipe.create(req.body, function(recipe){
            return res.redirect(`/admin/recipes/${recipe.id}`)
        })
        //return res.send(req.body)
    },
    put(req,res){
        const keys = Object.keys(req.body)
        for(key of keys) {
            if(req.body[key]=="") {
                return res.send('Please, fill all fields!')
            }
        }

        Recipe.update(req.body, ()=>{
            return res.redirect(`/admin/recipes/${req.body.id}`)
        })
    },
    delete(req,res){
        Recipe.delete(req.body.id, ()=>{
            return res.redirect(`/admin/recipes`)
        })
    }
}