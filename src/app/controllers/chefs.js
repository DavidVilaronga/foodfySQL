const Chef = require('../models/Chef')

module.exports = {
    index(req, res){
        Chef.all((chefs)=>{
            return res.render('chefs/index', { chefs })
        })
    },
    create(req,res){
        return res.render('chefs/create')
    },
    post(req, res){
        const keys = Object.keys(req.body)
        for(key of keys) {
            if(req.body[key]==""){
                return res.send('Please, fill all fields!')
            }
        }

        Chef.create(req.body, (chef)=>{
            return res.redirect(`/admin/chefs/${chef.id}`)
        })
    },
    show(req, res){
        Chef.find(req.params.id, (chef)=>{
            if(!chef) return res.send('Chef not Found!')

            Chef.findRecipes(req.params.id, (recipes)=>{
                return res.render('chefs/show', { chef, recipes })
            })
        })
    },
    edit(req, res){
        Chef.find(req.params.id, (chef)=>{
            return res.render('chefs/edit', { chef })
        })
    },
    put(req, res){
        Chef.update(req.body, ()=>{
            return res.redirect(`/admin/chefs/${req.body.id}`)
        })
    },
    delete(req, res){
        Chef.find(req.body.id, (chef)=>{
            if(chef.total_recipes != 0) {
                return res.send(`Esse chef ainda tem ${chef.total_recipes} receitas! Não é possível deleta-lo!`)
            } else {
                Chef.delete(req.body.id, ()=>{
                    return res.redirect('/admin/chefs')
                })
            }
        })
    }
}