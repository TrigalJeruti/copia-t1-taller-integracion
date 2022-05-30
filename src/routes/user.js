const Router = require('express');
const router = Router();


router.get('/', async(req, res) => {
    try{
        await res.send({"hi" : "bye"});
    }catch (error){
        console.log("error");
    }
});

module.exports = router;