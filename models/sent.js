import mongoose from 'mongoose';

const SentSchema = new mongoose.Schema({
    email: { type: String, required: true },
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
    from: { type: [String] },
},
    {
        timestamps: true
    }
);

const Sents = mongoose.models.Sents || mongoose.model('Sents', SentSchema);

export default Sents;
