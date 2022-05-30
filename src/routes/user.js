const Router = require('express');
const router = Router();
const user = require('../models').user;

router.get('/si', async(req, res) => {
    try{
        await res.send({"hi" : "bye"});
    }catch (error){
        console.log("error");
    }
});


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



module.exports = router;