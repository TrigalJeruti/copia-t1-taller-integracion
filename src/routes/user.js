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


/* ------------------------------------------------------------ */

router.post('/', async(req, res) => {
    try{
        const { username, password, name, age, psu_score, university, gpa_score, job, salary, promotion, hospital, operations, medical_debt } = req.body;

        if (
            typeof(username) !== 'string' ||
            typeof(password) !== 'string' ||
            typeof(name) !== 'string' ||
            typeof(age) !== 'number' ||
            age.toString().includes('.') ||
            typeof(psu_score) !== 'number' ||
            psu_score.toString().includes('.') ||
            typeof(university) !== 'string' ||
            typeof(gpa_score) !== 'number' ||
            typeof(job) !== 'string' ||
            typeof(salary) !== 'number' ||
            typeof(promotion) !== 'boolean' ||
            typeof(hospital)  !== 'string' ||
            typeof(operations)  !== 'object' ||
            Array.isArray(operations) !== true ||
            typeof(medical_debt) !== 'number'
        ){
            return res
                .status(400)
                .json({"error": "invalid attributes"});
        }

        const exist_u = await user.findOne({ where: {'username': username} });
        const exist_p = await user.findOne({ where: {'password': password} });

        if (exist_u || exist_p) {
            return res
                .status(409)
                .json({"error": "user already exists"});
        }
    
        const usuario = await user.create({ username,password,name,age,psu_score,university,gpa_score,job,salary,promotion,hospital,operations,medical_debt });
        const token = await generateToken(usuario);
        await usertoken.create({ "userid": usuario.id, "token": token});

        res
            .status(201)
            .json({
                "id": usuario.id,
                "toke": token
            });

    }catch (error){
        throw new Error(error);
    }
});


/* ------------------------------------------------------------ */

router.get('/:id', verifytoken, async(req, res) => {
    try{
        const { id } = req.params;
        const token_client = await usertoken.findOne({ where: { 'token': req.token } });
        const token_user = await usertoken.findOne({ where: { 'userid': id } });
        if (!token_client){
            res
                .status(401)
                .json({ "error": "invalid token" });
        }else if (token_client && token_client['token'] !== token_user['token'] ){
            res
                .status(403)
                .json({ "error": "you don't have access to this resource" });
        }else {
            const usuario = await user.findByPk(id);
            res
                .status(200)
                .json({ usuario });
        }
/*         jwtgenerator.verify(req.token, process.env.JWT_SECRET, (error, authData) => {
            console.log(authData);
            if(error){
                res.sendStatus(403).json({ 'mensaje' : "Funciono", 'authData': authData});
            }else{
                console.log(authData);
                res.json({ 'mensaje' : "Funciono", 'authData': authData});
            }
        }); */
    }catch (error){
        throw new Error(error);
    }
});


module.exports = router;