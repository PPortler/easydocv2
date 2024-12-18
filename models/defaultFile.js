import mongoose from 'mongoose';

const DefaultSchema = new mongoose.Schema({
    fileName: { type: String },
    fileURL: { type: String },
    fileType: { type: String },
});

// ใช้เงื่อนไขเพื่อตรวจสอบว่าโมเดลมีอยู่แล้วหรือไม่
const DefaultFiles = mongoose.models.DefaultFiles || mongoose.model('DefaultFiles', DefaultSchema);

export default DefaultFiles;
