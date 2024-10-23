import mongoose from 'mongoose';

const mailBoxSchema = new mongoose.Schema({
    idSent: { type: String, required: true },
    email: { type: String },
    header: { type: String },
    type: { type: String },
    fromSent: [
        {
            email: {type: String, require: true},
            time: {type: String, require: true},
            date: {type: String, require: true},
            files: [
                {
                    fileName: { type: String, required: true },
                    fileURL: { type: String, required: true },
                    fileType: { type: String, required: true },
                }
            ],
            detail: { type: String },
        }
    ],
    status: { type: Boolean },
},
    {
        timestamps: true
    }
);

const mailBoxs = mongoose.models.mailBoxs || mongoose.model('mailBoxs', mailBoxSchema);

export default mailBoxs;
