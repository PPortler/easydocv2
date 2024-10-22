import mongoose from 'mongoose';

const mailBoxSchema = new mongoose.Schema({
    idSent: { type: String, required: true },
    email: { type: String },
    files: [
        {
            fileName: { type: String, required: true },
            fileURL: { type: String, required: true },
            fileType: { type: String, required: true },
        }
    ],
    header: { type: String },
    type: { type: String },
    detail: { type: String },
    date: { type: String },
    time: { type: String },
    status: { type: Boolean },
    from: { type: String },
},
    {
        timestamps: true
    }
);

const mailBoxs = mongoose.models.mailBoxs || mongoose.model('mailBoxs', mailBoxSchema);

export default mailBoxs;
