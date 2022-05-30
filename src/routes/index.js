const Router = require('express');
const router = Router();


router.get('/status', async(req, res) => {
    try{
        await res.send({"Hola" : "chao"});
    }catch (error){
        console.log("error");
    }
});

module.exports = router;