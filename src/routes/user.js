require('dotenv').config();
const njwt = require('njwt');
const Router = require('express');
const router = Router();
const user = require('../models').user;
const usertoken = require('../models').usertoken;
const jwtgenerator = require('jsonwebtoken');
const jwt = require('express-jwt');


function generateToken(user) {
    return new Promise((resolve, reject) => {
        jwtgenerator.sign(
            {sub: user.id},
            process.env.JWT_SECRET,
            (err, tokenResult) => (err ? reject(err) : resolve(tokenResult)),
        );
    });
};

function verifytoken(req, res, next){
    const bearer = req.headers['authorization'];
    if (typeof bearer !== 'undefined'){
        const bearerToken = bearer.split(" ")[1];
        req.token = bearerToken;
        next();
    }else{
        res.sendStatus(403);
    }
}


/* ------------------------------------------------------------ */

router.get('/', async(req, res) => {
    try{
        const hola = ['true', 'hola'];
        console.log(typeof(hola));
        const hola_ = hola.toString();
        if (typeof(hola) == 'number' && hola.toString().includes('.')){
            console.log("Holiwiss");
        }
        const usuarios = await user.findAll();
        res.json({ usuarios }).status(200);
        if (!user) {
            return res.json({ error: 'User not found' }).status(404);
        }
    }catch (error){
        throw new Error(error);
    }
});
