import { IToken } from '../interfaces/interface';
import mongoose, { Schema, Document } from 'mongoose';


const tokenSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' }, // Corrected ref
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true },
  accessTokenExpiry: { type: Date, required: true },
  refreshTokenExpiry: { type: Date, required: true },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

const TokenModel = mongoose.model<IToken>('token', tokenSchema);

export default TokenModel;