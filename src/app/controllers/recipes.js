const Recipe = require('../models/Recipe')
const File = require('../models/File')
const RecipeFiles = require('../models/RecipeFiles')

module.exports = {
    async index(req, res){
        let results = await Recipe.all()
        const recipes = results.rows

        results = await RecipeFiles.findPath()
        const paths = results.rows.map(path => ({
            ...path,
            src: `${req.protocol}://${req.headers.host}${path.file_path.replace("public", "")}`
        }))

        return res.render("recipes/index", { recipes, paths })

    }, 
    async create(req, res){
        let results = await Recipe.chefsSelectOptions()
        const options = results.rows

        return res.render("recipes/create", { chefsOptions: options })

    },
    async show(req, res){
        let results = await Recipe.find(req.params.id)
        const recipe = results.rows[0]

        if (!recipe) return res.send("Recipe not Found!")

        results = await RecipeFiles.find(recipe.id)
        const recipe_files_id = results.rows[0].id

        results = await File.find(recipe_files_id)
        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        return res.render("recipes/show", {recipe, files})

    },
    async edit(req, res){
        let results = await Recipe.find(req.params.id)
        const recipe = results.rows[0]

        if(!recipe) return res.send("Recipe not found!")

        results = await Recipe.chefsSelectOptions()
        const options = results.rows

        results = await RecipeFiles.find(recipe.id)
        const recipe_files_id = results.rows[0].id

        results = await File.find(recipe_files_id)
        let files = results.rows
        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))


        return res.render('recipes/edit', { recipe, chefsOptions: options, files })
  
    },
    async post(req, res){
        const keys = Object.keys(req.body)
        for(key of keys) {
            if(req.body[key]==""){
                return res.send('Please, fill all fields!')
            }
        }

        if (req.files.length == 0)
            return res.send('Please, send at least one image')        

        let results = await Recipe.create(req.body)
        const recipeId = results.rows[0].id

        results = await RecipeFiles.create(recipeId)
        const file_id = results.rows[0].id

        const filesPromise = req.files.map(file => {File.create({...file, recipe_files_id: file_id})})
                                                    
        await Promise.all(filesPromise)

        results = await File.file(file_id)
        const file = results.rows[0].id

        await RecipeFiles.createFileId(file, file_id)

        return res.redirect(`/admin/recipes/${recipeId}`)
    },
    async put(req,res){
        const keys = Object.keys(req.body)
        for(key of keys) {
            if(req.body[key]=="" && key != "removed_files") {
                return res.send('Please, fill all fields!')
            }
        }

        results = await RecipeFiles.find(req.body.id)
        const recipe_files_id = results.rows[0].id

        if (req.files.length != 0) {
            const newFilesPromise = req.files.map(file => 
                File.create({...file, recipe_files_id: recipe_files_id}))

            await Promise.all(newFilesPromise)
        }

        if (req.body.removed_files) {
            const removedFiles = req.body.removed_files.split(",")
            const lastIndex = removedFiles.length - 1
            removedFiles.splice(lastIndex, 1)
            const removedFilesPromise = removedFiles.map(id => File.delete(id))

            await Promise.all(removedFilesPromise)
        }

        await Recipe.update(req.body)

        return res.redirect(`/admin/recipes/${req.body.id}`)
    },
    async delete(req,res){
        let results = await RecipeFiles.find(req.body.id)
        const recipe_files_id = results.rows[0].id
        
        await RecipeFiles.delete(req.body.id)

        await File.delete_files_recipe(recipe_files_id)

        Recipe.delete(req.body.id, ()=>{
            return res.redirect(`/admin/recipes`)
        })
    }
}