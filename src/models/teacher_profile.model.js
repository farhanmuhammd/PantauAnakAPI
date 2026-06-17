import mongoose from 'mongoose';

const teacherProfileSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
        fullName: { type: String, required: true, trim: true },
        birthDate: { type: Date },
        birthPlace: { type: String, trim: true },
        gender: { type: String, enum: ['male', 'female'] },
        phone: { type: String, trim: true },
        address: { type: String, trim: true },
        employeeId: { type: String, trim: true }
    },
    { timestamps: true }
);

const TeacherProfile = mongoose.model('TeacherProfile', teacherProfileSchema);
export default TeacherProfile;