import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['user', 'admin', 'teacher'], default: 'user' },
    refreshToken: { type: String, select: false },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.pre('findOneAndDelete', async function (next) {
  const user = await this.model.findOne(this.getFilter());
  if (!user) return next();

  const [{ default: TeacherProfile }, { default: ParentProfile }] = await Promise.all([
    import('./teacher_profile.model.js'),
    import('./parent_profile.model.js'),
  ]);

  await Promise.all([
    TeacherProfile.findOneAndDelete({ userId: user._id }),
    ParentProfile.findOneAndDelete({ userId: user._id }),
  ]);

  next();
});

const User = mongoose.model('User', userSchema);
export default User;