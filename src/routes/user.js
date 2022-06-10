require('dotenv').config();
const njwt = require('njwt');
const Router = require('express');
const router = Router();
const user = require('../models').user;
const usertoken = require('../models').usertoken;
const jwtgenerator = require('jsonwebtoken');
const jwt = require('express-jwt');
const apiKeyAuth = require('api-key-auth');

const parametros = ['username', 'password', 'name', 'age', 'psu_score', 'university', 'gpa_score', 'job', 'salary', 'promotion', 'hospital', 'operations', 'medical_debt'];

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
    if (typeof(bearer) !== 'undefined'){
        const bearerToken = bearer;
        req.token = bearerToken;
        next();
    }else{
        res
            .status(401)
            .json({ "error": "invalid token" });
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


        var valido = true;

        for (let i = 0; i < ((Object.keys(req.body)).length); i++) {
            if (parametros.includes(((Object.keys(req.body))[i]))) {
                continue;
            }else{
                valido = false;
                break;
            }
        }

        if (valido == false) {
            return res
                .status(400)
                .json({"error": "invalid attributes"});
        }else if (valido == true){
            if ( (Object.keys(req.body)).includes('username') == false || (Object.keys(req.body)).includes('password') == false || (Object.keys(req.body)).includes('age') == false){
                return res
                    .status(400)
                    .json({"error": "invalid attributes"});
            } else if (
                typeof(username) !== 'string' ||
                typeof(password) !== 'string' ||
                typeof(age) !== 'number' ||
                (typeof(name) !== 'string' && typeof(name) !== 'undefined')||
                (typeof(psu_score) !== 'number' && typeof(psu_score) !== 'undefined')||
                (typeof(university) !== 'string' && typeof(university) !== 'undefined') ||
                (typeof(gpa_score) !== 'number' && typeof(gpa_score) !== 'undefined') ||
                (typeof(job) !== 'string' && typeof(job) !== 'undefined') ||
                (typeof(salary) !== 'number' && typeof(salary) !== 'undefined') ||
                (typeof(promotion) !== 'boolean' && typeof(promotion) !== 'undefined') ||
                (typeof(hospital)  !== 'string' && typeof(hospital) !== 'undefined') ||
                (typeof(operations)  !== 'object' && typeof(operations) !== 'undefined') ||
                (Array.isArray(operations) !== true) ||
                (typeof(medical_debt) !== 'number' && typeof(medical_debt) !== 'undefined')
            ){
                return res
                    .status(400)
                    .json({"error": "invalid attributes"});
            }

        }


        const exist_u = await user.findOne({ where: {'username': username} });

        if (exist_u) {
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
                "token": token
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

            const info = { usuario };
            const user_id = info.usuario.id;
            const username = info.usuario.username;
            const name = info.usuario.name;
            const age = info.usuario.age;
            const psu_score = info.usuario.psu_score;
            const university = info.usuario.university;
            const gpa_score = info.usuario.gpa_score;
            const job = info.usuario.job;
            const salary = info.usuario.salary;
            const promotion = info.usuario.promotion;
            const hospital = info.usuario.hospital;
            const operations = info.usuario.operations;
            const medical_debt = info.usuario.medical_debt;
            const info_2= { 'id': user_id, username, name, age, psu_score, university, gpa_score, job, salary, promotion, hospital, operations, medical_debt};

            res
                .status(200)
                .json(info_2);
        }
    }catch (error){
        throw new Error(error);
    }
});


/* ------------------------------------------------------------ */

router.patch('/:id', verifytoken, async(req, res) => {
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
            const { username, password, name, age, psu_score, university, gpa_score, job, salary, promotion, hospital, operations, medical_debt } = req.body;
            const usuario = await user.findByPk(id);
            var valido = true;

            for (let i = 0; i < ((Object.keys(req.body)).length); i++) {
                if (parametros.includes(((Object.keys(req.body))[i]))) {
                    continue;
                }else{
                    valido = false;
                    break;
                }
            }

            if (!usuario) {
                return res
                    .status(400)
                    .json({"error": "User not exist"});
            } else if (username) {
                const exist_u = await user.findOne({ where: {'username': username} });
                if (exist_u){
                    return res
                        .status(409)
                        .json({"error": "user already exists"});
                }

            }else if (valido == false) {
                return res
                    .status(400)
                    .json({"error": "invalid attributes"});
            }else if (valido == true){

                if (
                    (typeof(username) !== 'string' && typeof(username) !== 'undefined') ||
                    (typeof(password) !== 'string' && typeof(password) !== 'undefined') ||
                    (typeof(age) !== 'number' && typeof(age) !== 'undefined') ||
                    (typeof(name) !== 'string' && typeof(name) !== 'undefined')||
                    (typeof(psu_score) !== 'number' && typeof(psu_score) !== 'undefined')||
                    (typeof(university) !== 'string' && typeof(university) !== 'undefined') ||
                    (typeof(gpa_score) !== 'number' && typeof(gpa_score) !== 'undefined') ||
                    (typeof(job) !== 'string' && typeof(job) !== 'undefined') ||
                    (typeof(salary) !== 'number' && typeof(salary) !== 'undefined') ||
                    (typeof(promotion) !== 'boolean' && typeof(promotion) !== 'undefined') ||
                    (typeof(hospital)  !== 'string' && typeof(hospital) !== 'undefined') ||
                    (typeof(operations)  !== 'object' && typeof(operations) !== 'undefined') ||
                    (Array.isArray(operations) !== true && typeof(operations) !== 'undefined') ||
                    (typeof(medical_debt) !== 'number' && typeof(medical_debt) !== 'undefined')
                ){
                    return res
                        .status(400)
                        .json({"error": "invalid attributes"});
                }
            } 
                    
            usuario.update({'username': username});
            if (password){
                usuario.update({'password': password});
            } if (name){
                usuario.update({'name': name});
            } if (age){
                usuario.update({'age': age});
            } if (university){
                usuario.update({'university': university});
            } if (gpa_score){
                usuario.update({'gpa_score': gpa_score});
            } if (job){
                usuario.update({'job': job});
            } if (salary){
                usuario.update({'salary': salary});
            } if (promotion){
                usuario.update({'promotion': promotion});
            } if (hospital){
                usuario.update({'hospital': hospital});
            } if (operations){
                usuario.update({'operations': operations});
            } if (medical_debt){
                usuario.update({'medical_debt': medical_debt});
            } 
            
            await usuario.save();
            const info = { usuario };
            const user_id_ = info.usuario.id;
            const username_ = info.usuario.username;
            const name_ = info.usuario.name;
            const age_ = info.usuario.age;
            const psu_score_ = info.usuario.psu_score;
            const university_ = info.usuario.university;
            const gpa_score_ = info.usuario.gpa_score;
            const job_ = info.usuario.job;
            const salary_ = info.usuario.salary;
            const promotion_ = info.usuario.promotion;
            const hospital_ = info.usuario.hospital;
            const operations_ = info.usuario.operations;
            const medical_debt_ = info.usuario.medical_debt;
            const info_2 = { 'id': user_id_, 'username': username_, 'name': name_, 'age': age_, 'psu_score': psu_score_, 'university': university_, 'gpa_score': gpa_score_, 'job': job_, 'salary': salary_, 'promotion': promotion_, 'hospital': hospital_, 'operations': operations_, 'medical_debt': medical_debt_};
            res.json(info_2).status(200);
        }
    }catch (error){
        throw new Error(error);
    }
});


/* ------------------------------------------------------------ */

router.delete('/:id',verifytoken, async(req, res) => {
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
            if (!usuario) {
                return res
                    .status(409)
                    .json({"error": "User not exist"});
            }
        
            await usuario.destroy();
            res.status(204).send("");
        }
    }catch (error){
        throw new Error(error);
    }
});



/* ------------------------------------------------------------ */

router.get('/:id/:scope', verifytoken, async(req, res) => {
    try{
        const { id, scope } = req.params;
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
            if (!usuario) {
                return res
                    .status(409)
                    .json({"error": "User not exist"});
            } if (String(scope) == 'basic') {
                res
                    .status(200)
                    .json({ 
                        "id": usuario.id,
                        "username": usuario.username,
                        "name": usuario.name,
                        "age": usuario.age
                    });
            } if (String(scope) == 'education') {
                res
                    .status(200)
                    .json({ 
                        "id": usuario.id,
                        "psu_score": usuario.psu_score,
                        "university": usuario.university,
                        "gpa_score": usuario.gpa_score
                    });
            } if (String(scope) == 'work') {
                res
                    .status(200)
                    .json({ 
                        "id": usuario.id,
                        "job": usuario.job,
                        "salary": usuario.salary,
                        "promotion": usuario.promotion
                    });
            } if (String(scope) == 'medical') {
                res
                    .status(200)
                    .json({
                        "id": usuario.id, 
                        "hospital": usuario.hospital,
                        "operations": usuario.operations,
                        "medical_debt": usuario.medical_debt
                    });
            }
        }
    }catch (error){
        throw new Error(error);
    }
});




module.exports = router;