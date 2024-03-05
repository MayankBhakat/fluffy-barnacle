import { Schema, model, Document } from 'mongoose';

type SingleHomeDocument = Document & {
    image1:string;
    image2:string;
    image3:string;
    city: string;
    type: string;
    bathrooms: number;
    bedrooms: number;
    size:number;
    fees:number;
    owner_id:string;
    year:number;
    address:string
}

const singleHomeSchema = new Schema<SingleHomeDocument>(
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
        year:{
            type:Number,
            required:true,
        },
        image1:{
            type:String,
           
        },
        image2:{
            type:String,
           
        },
        image3:{
            type:String,
            
        },
        address:{
            type:String,
        }
       
    },
    {
        timestamps: true,
    }
);

const SingleHome = model<SingleHomeDocument>('SingleHome', singleHomeSchema);

export default SingleHome;
