const { Schema, model } = require('mongoose');

const installmentSchema = new Schema(
    {
        user_id: {
            type: String,
            required: true,
            
        },
        house_id: {
            type: String,
            required: true,
        },
        order_id:{
            type: String,
            required: true,

        },
        payment_id:{
            type: String,
            required: true,

        },
        payment_amount:{
            type: String,
            required: true,
        },
        installment_number:{
            type:String,
            required:true
        },
        signature:{
            type:String,
            required:true,
        },
        rent_sell:{
            type:String,
            required:true,
        }
    },
    {
        timestamps: true,
    }
);

const Installment = model('Installment', installmentSchema);

module.exports = Installment;