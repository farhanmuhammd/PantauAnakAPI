import mongoose from 'mongoose';

const childSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true, trim: true },
        birthDate: { type: Date },
        birthPlace: { type: String, trim: true },
        gender: { type: String, enum: ['male', 'female'] },
        classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    },
    { _id: false }
);

const parentSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true, trim: true },
        birthDate: { type: Date },
        birthPlace: { type: String, trim: true },
        phone: { type: String, trim: true },
        gender: { type: String, enum: ['male', 'female'] },
    },
    { _id: false }
);

const parentProfileSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        children: { type: [childSchema], default: [] },
        parents: { type: [parentSchema], default: [] },
        address: { type: String, trim: true },
    },
    { timestamps: true }
);

const ParentProfile = mongoose.model('ParentProfile', parentProfileSchema);
export default ParentProfile;