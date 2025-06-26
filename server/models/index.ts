import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  // balance: { type: Number, required: true, default: 0 }, // inline balance
  balance: { type: Number, default: 0 }, // inline balance
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],
}, { timestamps: true });

const TransactionSchema = new Schema({
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ["INCOME", "EXPENSE"], required: true },
  date: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // now refers to user instead of account
});


export const User = model("User", UserSchema);
// export const Account = model("Account", AccountSchema);
export const Transaction = model("Transaction", TransactionSchema);