const Router = require('express');
const router = Router();
const Sequelize = require('sequelize');
const user = require('../models').user;
const nonce = require('../models').nonce;
const usertoken = require('../models').usertoken;
const http = require('http');

const list_scopes = ['basic', 'education', 'work', 'medical'];

function cadenaAleatoria(longitud) {
    // Nota: no uses esta función para cosas criptográficamente seguras. 
    const banco = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let aleatoria = "";
    for (let i = 0; i < longitud; i++) {
        aleatoria += banco.charAt(Math.floor(Math.random() * banco.length));
    }
    return aleatoria;
}

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
        console.log('Perdi aqui el token en verificar');
        res
            .status(401)
            .json({ "error": "invalid token" });
    }
}


router.get('/request', async(req, res) => {
    try{
        let miURL = new URL(`http://${process.env.DB_HOST}${req.url}`);
        const obj = miURL.searchParams.toString();
        var user_id = miURL.searchParams.get('user_id');
        const scopes = miURL.searchParams.get('scopes');
        const app_id = miURL.searchParams.get('app_id');

        if (isNaN(user_id) == true && typeof(user_id) !== 'object'){
            return res
                .status(404)
                .json({"error": "user not found"});
        }

        const usuario = await user.findByPk(user_id);

        var valido = true;
        parts = scopes.split(",");
        console.log(parts);

        for (let i = 0; i < (parts.length); i++) {
            if (list_scopes.includes((parts)[i])) {
                continue;
            }else{
                valido = false;
                break;
            }
        }
        console.log(valido);

        if (!usuario) {
            return res
                .status(404)
                .json({"error": "user not found"});
        } else if (valido == false || typeof(user_id) == 'object' || typeof(scopes) == 'object' || typeof(app_id) == 'object'){
            return res
                .status(400)
                .json({"error": "invalid oauth request"});
        }
        const key = cadenaAleatoria(20);
        const unixTime = Math.floor(Date.now() / 1000);
        const expiration = unixTime + 10;
        const nonce_ = await nonce.create({ key, expiration });
        res
            .status(202)
            .json({
                "message": `${app_id} está intentando accede a ${scopes}, ¿desea continuar?`,
                "grant_url": `/oauth/grant?user_id=${user_id}&scopes=${scopes}&app_id=${app_id}&nonce=${key}`,
                "expiration": expiration
            });
    }catch (error){
        throw new Error(error);
    }
});


/* ------------------------------------------------------------ */

router.get('/grant', verifytoken, async(req, res) => {
    try{

        let miURL = new URL(`http://${process.env.DB_HOST}${req.url}`);
        const obj = miURL.searchParams.toString();
        const user_id = miURL.searchParams.get('user_id');
        const scopes = miURL.searchParams.get('scopes');
        const app_id = miURL.searchParams.get('app_id');
        const nonce_ = miURL.searchParams.get('nonce');
        console.log(req.token);

        const token_client = await usertoken.findOne({ where: { 'token': req.token } });
        if (!token_client){
            res
                .status(401)
                .json({ "error": "invalid token" });
        }else{
            if (isNaN(user_id) == true && typeof(user_id) !== 'object'){

                return res
                    .status(403)
                    .json({"error": "user not found"});
            }else{
                const token_user = await usertoken.findOne({ where: { 'userid': user_id } });
                if (!token_client){

                    res
                        .status(401)
                        .json({ "error": "invalid token" });
    
                }else if (token_client && token_client['token'] !== token_user['token'] ){
                    console.log('2');
                    res
                        .status(403)
                        .json({ "error": "you don't have access to this resource" });
    
                }else if (typeof(user_id) == 'object' || typeof(scopes) == 'object' || typeof(app_id) == 'object' || typeof(nonce_) == 'object'){
                    return res
                            .status(400)
                            .json({"error": "invalid oauth grant"});
                }else{

                    const usuario = await user.findByPk(user_id);
    
                    var valido = true;
                    parts = scopes.split(",");
                    console.log(parts);
    
                    for (let i = 0; i < (parts.length); i++) {
                        if (list_scopes.includes((parts)[i])) {
                            continue;
                        }else{
                            valido = false;
                            break;
                        }
                    }
                    console.log(valido);
    
                    if (!usuario) {

                        return res
                            .status(404)
                            .json({"error": "user not found"});
                    } else if (valido == false ){
                        return res
                            .status(400)
                            .json({"error": "invalid oauth grant"});
                    }else{
    
                        const nonce_1 = await nonce.findOne({ where: { 'key': nonce_ } });
                        const time = Math.floor(Date.now() / 1000);
    

                        if (!nonce_1 || (time - nonce_1['expiration']) > 11 || typeof(nonce_) !== 'string'){
                            console.log('Perdi aqui 406');
                            return res
                                .status(406)
                                .json({"error": "invalid authorization grant"});
                        }else{
                            res
                                .status(200)
                                .json({
                                    "access_token": "PAtFBEJBevHDjJhkRgJP5C5sN3D9n4DY4m8v3zxytbXucE9Q8",
                                    "expiration": 1647398475
                                });
                        }
    
                    }
                 
                }

            }

        }
        
    }catch (error){
        throw new Error(error);
    }
});




module.exports = router;