import crypto from "crypto";
import mongoose from "mongoose";

export type CarDocument = mongoose.Document & {
    model: string;
    manufactured: string;
    availableFromDate: string;
    cost: number;

    gravatar: (size: number) => string;
};


const userSchema = new mongoose.Schema<CarDocument>(
    {
        model: String,
        manufactured: String,
        availableFromDate: String,
        cost: Number
    },
    { timestamps: true },
);


/**
 * Helper method for getting cars's gravatar.
 */
userSchema.methods.gravatar = function (size: number = 200) {
    if (!this.model) {
        return `https://gravatar.com/avatar/?s=${size}&d=retro`;
    }
    const md5 = crypto.createHash("md5").update(this.model).digest("hex");
    return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

export const User = mongoose.model<CarDocument>("Car", userSchema);
