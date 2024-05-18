const { Schema, model } = require('mongoose');

// Define the schema for the installment object
const installmentSchema = new Schema({
    status: {
        type: Boolean,
        required: true,
    },
    due_date: {
        type: Date,
        required: true,
    },
}, { _id: false });



// Define the schema for the order list item
const orderItemSchema = new Schema({

    installment_0: {
        type: installmentSchema,
        required: true,
    },
    installment_1: {
        type: installmentSchema,
        required: true,
    },
    installment_2: {
        type: installmentSchema,
        required: true,
    },
    installment_3: {
        type: installmentSchema,
        required: true,
    },
    installment_4: {
        type: installmentSchema,
        required: true,
    },
}, { _id: false });


const singleHomeSchema = new Schema(
    {
        city: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        bathrooms: {
            type: Number,
            required: true,
        },
        bedrooms: {
            type: Number,
            required: true,
        },
        size: {
            type: Number,
            required: true,
        },
        fees: {
            type: Number,
            required: true,
        },
        owner_id: {
            type: String,
            required: true,
        },
        year: {
            type: Number,
            required: true,
        },
        image1: {
            type: String,
        },
        image2: {
            type: String,
        },
        image3: {
            type: String,
        },
        address: {
            type: String,
        },
        sell_rent:{
            type: String,
        },
        status: {
            available: {
                type: Boolean,
                default: true,
            },
            booked_by: {
                type: String,
                default: null,
            },
            sell_order:{
                type: orderItemSchema,
                defualt:null,
            },
            rent_order:{
                months_due:{
                    type:[Date],
                    default:[],
                },
                curr_month:{
                    type:Boolean,
                    default:false,
                }
            }

        },

    },
    {
        timestamps: true,
    }
);

const SingleHome = model('SingleHome', singleHomeSchema);

module.exports = SingleHome;
