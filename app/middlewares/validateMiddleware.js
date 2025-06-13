//資料驗證中介
//schemas 來自 /validations/authValidation.js
//module.exports 匯出單一函式

module.exports = (schema) => { 
    return (req, res, next) => {
        const {error} = schema.validate(req.body); 
        if(error){
            return res.status(400).json({error: error.details[0].message});
        }
        next();
    }
}