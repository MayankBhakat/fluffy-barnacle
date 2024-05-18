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
    house_id: {
        type: String,
        required: true,
    },
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



const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        phoneNumber: {
            type: String,
        },
        address: {
            type: String,
        },
        country: {
            type: String,
        },
        zipCode: {
            type: String,
        },
        city: {
            type: String,
        },
        state: {
            type: String,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            default: "user",
            enum: ["user", "admin"],
        },
        verification: {
            type: Boolean,
            default: false,
        },
        wishlist: {
            type: [String],
        },
        orderlist: {
            type: [orderItemSchema],
            default: [],
        },
        rent_order:{
            type:Boolean,
            default: false,
        },
        rent_home_id:{
            type:String,
            default:null
        }
    },
    {
        timestamps: true,
    }
);

const User = model('User', userSchema);

module.exports = User;
