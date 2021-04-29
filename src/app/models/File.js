const db = require('../../config/db')
const fs = require('fs')

module.exports = {
    all() {
        return db.query(`SELECT * FROM files`)
    },
    create({filename, path, recipe_files_id}) {
        const query = `
            INSERT INTO files (
                name,
                path,
                recipe_files_id
            ) VALUES ($1, $2, $3)
            RETURNING id
        `
        const values = [
            filename,
            path,
            recipe_files_id
        ]

        return db.query(query, values)
    },
    create_avatar({filename, path})  {
        const query = `
            INSERT INTO files (
                name,
                path
            ) VALUES ($1, $2)
            RETURNING id
        `

        const values = [
            filename,
            path
        ]

        return db.query(query, values)
    },
    find_avatar_chef(id) {
        return db.query(`SELECT * FROM files WHERE id = $1`, [id])
    },
    find(id) {
        return db.query(`SELECT * FROM files WHERE recipe_files_id = $1`, [id])
    },
    file(id) {
        return db.query(`SELECT id FROM files WHERE recipe_files_id = $1`, [id])
    },
    async delete(id) {
        return db.query(`DELETE FROM files WHERE id = $1`, [id])
    },
    delete_files_recipe(id) {
        return db.query(`DELETE FROM files WHERE recipe_files_id = $1`, [id])
    },
    delete_avatar(path) {
        return db.query(`DELETE FROM files WHERE path = $1`, [path])
    }
}