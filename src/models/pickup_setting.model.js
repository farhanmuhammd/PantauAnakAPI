import mongoose from 'mongoose';

const pickupSettingSchema = new mongoose.Schema(
    {
        pickupTime: { type: String, required: true }, // format "HH:mm"
        setBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

const PickupSetting = mongoose.model('PickupSetting', pickupSettingSchema);
export default PickupSetting;