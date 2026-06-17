import mongoose from 'mongoose';

const statusHistorySchema = new mongoose.Schema(
    {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
    },
    { _id: false }
);

const trackingSchema = new mongoose.Schema(
    {
        parentProfileId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ParentProfile',
            required: true,
        },
        classId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Class',
            required: true,
        },
        date: { type: String, required: true }, // format "YYYY-MM-DD"
        status: {
            type: String,
            enum: ['waiting_pickup', 'on_the_way', 'arrived_home'],
            default: 'waiting_pickup',
        },
        statusHistory: { type: [statusHistorySchema], default: [] },
        waitingPickupAt: { type: Date },
        onTheWayAt: { type: Date },
        arrivedHomeAt: { type: Date },
    },
    { timestamps: true }
);

trackingSchema.index({ parentProfileId: 1, date: 1 }, { unique: true });

const Tracking = mongoose.model('Tracking', trackingSchema);
export default Tracking;