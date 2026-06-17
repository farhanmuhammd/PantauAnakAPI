import mongoose from 'mongoose';

const classSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true, unique: true },
    },
    { timestamps: true }
);

const Class = mongoose.model('Class', classSchema);
export default Class;