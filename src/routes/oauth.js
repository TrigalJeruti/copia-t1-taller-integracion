const Router = require('express');
const router = Router();
const Sequelize = require('sequelize');
const user = require('../models').user;
const http = require('http')



router.get('/request', async(req, res) => {
    try{
        let miURL = new URL(`http://${process.env.DB_HOST}${req.url}`);
        const obj = miURL.searchParams.toString();
        const user_id = miURL.searchParams.get('user_id');
        const scopes = miURL.searchParams.get('scopes');
        const app_id = miURL.searchParams.get('app_id');
        const usuario = await user.findByPk(user_id);
        if (!usuario) {
            return res
                .status(400)
                .json({"error": "user not found"});
        }
        res
            .status(202)
            .json({
                "message": `${app_id} está intentando accede a ${scopes}, ¿desea continuar?`,
                "grant_url": "hola",
                "expiration": 123455
            });
    }catch (error){
        throw new Error(error);
    }
});


/* ------------------------------------------------------------ */





module.exports = router;