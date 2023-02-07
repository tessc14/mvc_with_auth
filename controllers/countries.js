const Country = require('../models/Country')


const show = async (req, res) => {
    
    try {
        const country = req.params.name;

        if (!country) {
        res.status(400).json({ error: "please type a country" })
        }   

        const foundCountry = await Country.getOneByName(country)
        res.json(foundCountry)

    } catch (error) {
        res.status(404).json({ error: "country not found" })
    }
} 

module.exports = { show }