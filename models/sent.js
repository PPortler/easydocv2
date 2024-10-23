import mongoose from 'mongoose';

const SentSchema = new mongoose.Schema({
    email: { type: String, required: true },
    header: { type: String },
    type: { type: String },
    status: { type: String },
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
},
    {
        timestamps: true
    }
);

const Sents = mongoose.models.Sents || mongoose.model('Sents', SentSchema);

export default Sents;
