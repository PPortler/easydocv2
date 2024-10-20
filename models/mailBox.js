import mongoose from 'mongoose';

const mailBoxSchema = new mongoose.Schema({
    idSent: { type: String, required: true },
    email: { type: String },
},
    {
        timestamps: true
    }
);

const mailBoxs = mongoose.models.mailBoxs || mongoose.model('mailBoxs', mailBoxSchema);

export default mailBoxs;
