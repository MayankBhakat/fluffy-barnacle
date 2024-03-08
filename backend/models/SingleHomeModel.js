const { Schema, model } = require('mongoose');

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
        }
    },
    {
        timestamps: true,
    }
);

const SingleHome = model('SingleHome', singleHomeSchema);

module.exports = SingleHome;
