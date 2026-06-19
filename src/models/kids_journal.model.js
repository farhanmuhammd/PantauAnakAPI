import mongoose from 'mongoose';

const kidsJournalSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        caption: { type: String, trim: true },
        image: { type: String, required: true },
        childs: [
            {
                type: mongoose.Schema.Types.ObjectId,
                required: false,
            },
        ],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);

const KidsJournal = mongoose.model('KidsJournal', kidsJournalSchema);
export default KidsJournal;