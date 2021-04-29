const Chef = require('../models/Chef')
const Recipe = require('../models/Recipe')
const RecipeFiles = require('../models/RecipeFiles')
const File = require('../models/File')

module.exports = {
    async index(req, res){
        let results = await Chef.findPath()

        const chefs = results.rows.map(chef => ({
            ...chef,
            src: `${req.protocol}://${req.headers.host}${chef.path.replace("public", "")}`
        }))

        return res.render('chefs/index', { chefs })

    },
    create(req,res){
        return res.render('chefs/create')
    },
    async post(req, res){
        const keys = Object.keys(req.body)
        for(key of keys) {
            if(req.body[key]==""){
                return res.send('Please, fill all fields!')
            }
        }
        
        let results = await File.create_avatar(req.file)
        const fileId = results.rows[0].id

        results = await Chef.create({...req.body, fileId})
        const chefId = results.rows[0].id

        return res.redirect(`/admin/chefs/${chefId}`)
    },
    async show(req, res){
        let results = await Chef.find(req.params.id)
        const chef = results.rows[0]

        results = await Chef.findRecipes(req.params.id)
        const recipes = results.rows

        results = await RecipeFiles.all()
        const recipeFiles = results.rows

        results = await RecipeFiles.findPath()
        const paths = results.rows.map(path => ({
            ...path,
            src: `${req.protocol}://${req.headers.host}${path.file_path.replace("public", "")}`
        }))
        
        results = await File.find_avatar_chef(chef.file_id)
        const avatar_path = results.rows[0]
        
        const avatarPath = {
            ...avatar_path,
            src: `${req.protocol}://${req.headers.host}${avatar_path.path.replace("public", "")}`
        }
        
        return res.render('chefs/show', { chef, recipes, recipeFiles, paths, avatarPath })
    },
    async edit(req, res){
        let results = await Chef.findToEdit(req.params.id)
        const chef = results.rows[0]
        return res.render('chefs/edit', { chef })
    },
    async put(req, res){
        const keys = Object.keys(req.body)
        for(key of keys) {
            if(req.body[key]=="") {
                return res.send('Please, fill all fields!')
            }
        }
        
            let results = await File.create_avatar(req.file)
            const fileId = results.rows[0].id

            await Chef.updateFileNull(req.body.id)

            await File.delete_avatar(req.body.path)

            await Chef.updateNewAvatar(fileId, req.body.id)
        

        await Chef.update({...req.body, fileId})

        return res.redirect(`/admin/chefs/${req.body.id}`)
    },
    async delete(req, res){
        let results = await Chef.find(req.body.id)
        const chef = results.rows[0]
        
        if (chef.total_recipes == 0) {
            await Chef.delete(req.body.id)

            await File.delete(chef.file_id)
            
            return res.redirect('/admin/chefs')

        } else if(chef.total_recipes != 0) {
            return res.send(`Esse chef ainda tem ${chef.total_recipes} receitas! Não é possível deleta-lo!`)
        }
    }
}