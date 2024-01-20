const { Menu } = require("../models");

const viewMenu = async (req, res) => {
    try {
        const menu = await Menu.findAll();
        res.send(menu);
    } catch (error) {
        res.status(500).send({ error: "Internal Server Error" });
    }
}

module.exports = { viewMenu } ;