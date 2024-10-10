import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
    id: { type: String, required: true },
    email: { type: String, required: true },
    files: [
        {
            fileName: { type: String, required: true },
            fileURL: { type: String, required: true },
            fileType: { type: String, required: true },
        }
    ]
});

// ใช้เงื่อนไขเพื่อตรวจสอบว่าโมเดลมีอยู่แล้วหรือไม่
const Files = mongoose.models.Files || mongoose.model('Files', fileSchema);

export default Files;
