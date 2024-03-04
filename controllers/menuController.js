const { Menu } = require("../models");

const viewMenu = async (req, res) => {
    try {
        const menu = await Menu.findAll();
        res.send(menu);
    } catch (error) {
        res.status(500).send({ error: "Internal Server Error" });
    }
}

const viewItem = async (req, res) => {
    try {
        const itemName = req.query.name
        const menu = await Menu.findOne({ where: {name: itemName} });
        res.send(menu);
    } catch (error) {
        res.status(500).send({ error: "Internal Server Error" });
    }
}

module.exports = { viewMenu, viewItem } ;