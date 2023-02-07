const db = require('../database/db')

class Country {
    constructor(data) {
    this.id = data.id
    this.name = data.name
    this.capital = data.capital
    this.population = data.population
    this.languages = data.languages
    this.fun_fact = data.fun_fact
    this.map_image_url = data.map_image_url
    }

    static async getOneByName(countryName) {
        
        //ILIKE MAKES IT CASE INSENSITIVE
        const data = await db.query('SELECT * FROM countries WHERE name ILIKE $1', [countryName])
        
        if(data.rowCount === 0) {
            throw new Error("Country not found")
        }

        const country = data.rows[0]
        return country
    }

}

module.exports = Country;