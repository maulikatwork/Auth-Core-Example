import mongoose, { Schema, Document } from 'mongoose';

export interface IBase extends Document {
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const baseSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

// This is just a template model, not intended for actual use
// Uncomment if you need to create a real model
// const Base = mongoose.model<IBase>('Base', baseSchema);
// export default Base;
