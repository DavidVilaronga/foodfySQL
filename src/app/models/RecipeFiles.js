const db = require('../../config/db')

module.exports = {
    all() {
        return db.query(`SELECT * FROM recipe_files`)
    },
    create(recipeId) {
        return db.query(`INSERT INTO recipe_files (recipe_id) VALUES ($1) RETURNING id`, [recipeId])
    },
    createFileId(file_id, id) {
        return db.query(`UPDATE recipe_files SET file_id=($1) WHERE id=($2)`, [file_id, id])
    },
    find(id) {
        return db.query(`SELECT id FROM recipe_files WHERE recipe_files.recipe_id = $1`, [id])
    },
    findPath() {
        return db.query(`
            SELECT recipe_files.recipe_id , files.path AS file_path
            FROM recipe_files
            LEFT JOIN files ON ( recipe_files.file_id = files.id )`)
    },
    findPathToChefShow(id) {
        return db.query(`
        SELECT files.path
        FROM files
        LEFT JOIN recipe_files ON ( recipe_files.id = files.recipe_files_id )
        WHERE recipe_files.recipe_id = $1`, [id])
    },
    delete(id) {
        return db.query(`DELETE FROM recipe_files WHERE recipe_id = $1`, [id])
    }
}