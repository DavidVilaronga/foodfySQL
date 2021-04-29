const {date} = require('../../lib/utils')
const db = require('../../config/db')

module.exports = {
    all() {
        return db.query(`SELECT * FROM chefs`)
    },
    create({name, fileId}) {
        const query = `
            INSERT INTO chefs (
                name,
                created_at,
                file_id
            ) VALUES ($1, $2, $3)
            RETURNING id
        `

        const values = [
            name,
            date(Date.now()).iso,
            fileId
        ]

        return db.query(query, values)
    },
    find(id) {
        return db.query(`
            SELECT chefs.*, 
            ( select count(*) from recipes where chefs.id = recipes.chef_id ) as total_recipes
            from chefs
            left join recipes on (recipes.chef_id = chefs.id)
            WHERE chefs.id = $1`, [id])
    },
    findRecipes(id) {
        return db.query(`
            SELECT 
            recipes.title, 
            recipes.id,
            chefs.name AS recipe_by
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.chef_id = $1`, [id])
    },
    findPath() {
        return db.query (`
        SELECT chefs.*, files.path
            FROM chefs LEFT JOIN files
            ON chefs.file_id = files.id
        `)
    },
    findToEdit(id) {
        return db.query (`SELECT chefs.*, files.path
        FROM chefs LEFT JOIN files
        ON chefs.file_id = files.id
        WHERE chefs.id = $1`, [id])
    },
    update({name, fileId, id}) {
        const query =  `
            UPDATE chefs SET
            name = $1,
            file_id = $2
        WHERE id = $3
        `
        const values = [
            name,
            fileId,
            id
        ]

        return db.query(query, values)

    },
    updateFileNull(id) {
        return db.query(`
            UPDATE chefs 
            SET file_id = null
            WHERE chefs.id = $1
        `, [id])
    },
    updateNewAvatar(fileId, id) {
        return db.query(`
            UPDATE chefs
            SET file_id = $1
            WHERE id = $2
        `, [fileId, id])
    },
    delete(id) {
        return db.query(`DELETE FROM chefs WHERE id = $1`, [id])
    }
}