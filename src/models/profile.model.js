import mongoose from 'mongoose';

const childSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true, trim: true },
        birthDate: { type: Date, required: true },
        birthPlace: { type: String, trim: true, required: true },
        gender: { type: String, enum: ['male', 'female'] },
    },
    { _id: false }
);

const parentSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true, trim: true },
        birthDate: { type: Date, required: true },
        birthPlace: { type: String, trim: true, required: true },
        phone: { type: String, trim: true, required: true },
        gender: { type: String, enum: ['male', 'female'] },
        address: { type: String, trim: true, required: true }
    },
    { _id: false }
);

const profileSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        children: { type: [childSchema], default: [] },
        parents: { type: [parentSchema], default: [] },
    },
    { timestamps: true }
);

const Profile = mongoose.model('Profile', profileSchema);
export default Profile;