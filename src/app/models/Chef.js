const {date} = require('../../lib/utils')
const db = require('../../config/db')

module.exports = {
    all(callback) {
        db.query(`SELECT * FROM chefs`,
            (err, results)=>{
                if(err) throw `Database Erro! ${err}`

                callback(results.rows)
            }
        )
    },
    create(data, callback) {
        const query = `
            INSERT INTO chefs (
                name,
                avatar_url,
                created_at
            ) VALUES ($1, $2, $3)
            RETURNING id
        `

        const values = [
            data.name,
            data.avatar_url,
            date(Date.now()).iso
        ]

        db.query(query, values, (err, results)=>{
            if(err) throw `Database Error! ${err}`

            callback(results.rows[0])
        })
    },
    find(id, callback) {
        db.query(`
            SELECT chefs.*, 
            ( select count(*) from recipes where chefs.id = recipes.chef_id ) as total_recipes
            from chefs
            left join recipes on (recipes.chef_id = chefs.id)
            WHERE chefs.id = $1`, [id], (err, results)=>{
                if(err) throw `Database Error! ${err}`

                callback(results.rows[0])
            })
    },
    findRecipes(id, callback) {
        db.query(`
            SELECT 
            recipes.image, 
            recipes.title, 
            recipes.id,
            chefs.name AS recipe_by
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.chef_id = $1`, [id], (err, results)=>{
                if(err) throw `Database Error! ${err}`

                callback(results.rows)
            })
    },
    update(data, callback) {
        const query =  `
            UPDATE chefs SET
            name = $1,
            avatar_url = $2
        WHERE id = $3
        `
        const values = [
            data.name,
            data.avatar_url,
            data.id
        ]

        db.query(query, values, (err)=>{
            if(err) throw `Database Error! ${err}`

            callback()
        })

    },
    delete(id, callback) {
        db.query(`DELETE FROM chefs WHERE id = $1`, [id], (err)=>{
            if(err) throw `Databesa Error! ${err}`

            callback()
        })
    }
}