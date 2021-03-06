const express = require('express')
const routes = express.Router()
const multer = require('./app/middlewares/multer')

const recipes = require('./app/controllers/recipes')
const chefs = require('./app/controllers/chefs')

routes.get("/", function(req, res){
    return res.redirect("/admin/recipes")
})

routes.get("/admin/recipes", recipes.index)
routes.get("/admin/recipes/create", recipes.create)
routes.get("/admin/recipes/:id", recipes.show) 
routes.get("/admin/recipes/:id/edit", recipes.edit)
routes.post("/admin/recipes", multer.array("photos", 5), recipes.post)
routes.put("/admin/recipes", multer.array("photos", 5), recipes.put)
routes.delete("/admin/recipes", recipes.delete)


routes.get("/admin/chefs", chefs.index)
routes.get("/admin/chefs/create", chefs.create)
routes.get('/admin/chefs/:id', chefs.show)
routes.get('/admin/chefs/:id/edit', chefs.edit)
routes.post("/admin/chefs", multer.single("photo", 1), chefs.post)
routes.put('/admin/chefs', multer.single("photo", 1), chefs.put)
routes.delete('/admin/chefs', chefs.delete)

module.exports = routes