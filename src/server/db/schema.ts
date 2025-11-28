import mongoose from 'mongoose';

const MonthlyExpenseSchema = new mongoose.Schema({
    id: { type: String, required: true },
    amount: { type: Number, required: true },
    description: { type: String },
}, { _id: false });

const MonthlyIncomeSchema = new mongoose.Schema({
    id: { type: String, required: true },
    amount: { type: Number, required: true },
    description: { type: String },
}, { _id: false });

const MonthlyRetirementSchema = new mongoose.Schema({
    id: { type: String, required: true },
    amount: { type: Number, required: true },
    description: { type: String },
}, { _id: false });

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    authId: { type: String, required: true, unique: true },
    active: { type: Boolean, default: true },
    expenses: { type: [MonthlyExpenseSchema], default: [] },
    income: { type: [MonthlyIncomeSchema], default: [] },
    retirement: { type: [MonthlyRetirementSchema], default: [] },
    withdrawalRate: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});

export const UserModel = mongoose.models.users || mongoose.model('users', UserSchema);

const AccountSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});

export const AccountModel = mongoose.models.accounts || mongoose.model('accounts', AccountSchema);

const InvestmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'accounts', required: false },
    description: { type: String, required: true },
    type: { type: String, required: true },
    accountType: { type: String, required: true },
    costBasis: { type: Number, required: true },
    currentDebt: { type: Number, required: true },
    currentValue: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});

export const InvestmentModel = mongoose.models.investments || mongoose.model('investments', InvestmentSchema);

const TransactionSchema = new mongoose.Schema({
    investmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'investments', required: true },
    type: { type: String, required: true },
    transactionDate: { type: Date, required: true },
    amount: { type: Number, required: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});

export const TransactionModel = mongoose.models.transactions || mongoose.model('transactions', TransactionSchema);