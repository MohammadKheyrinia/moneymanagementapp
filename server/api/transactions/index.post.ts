import { connectDB } from '~/server/utils/db';
import { Transaction, User } from '~/server/models';
import { z } from 'zod';

export const transactionSchema = z.object({
  amount: z.number().positive('Amount must be a positive number'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
  type: z.enum(['INCOME', 'EXPENSE']),
  createdAt: z.string().optional(), // ISO date string if you want to accept it on input
});

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    const body = await readBody(event);

    const parsed = transactionSchema.safeParse(body);
    if (!parsed.success) {
      const errorMessages = parsed.error.issues.map(issue => issue.message).join(', ');
      throw createError({ statusCode: 400, statusMessage: `Validation error: ${errorMessages}` });
    }

    // Ensure the user is authenticated via the auth middleware
    if (!event.context.user || !event.context.user.userId) {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
    }
    const authenticatedUserId = event.context.user.userId;

    const transaction = new Transaction({
      ...parsed.data,
      userId: authenticatedUserId, // Use the authenticated user's ID
    });
    await transaction.save();

    // ✅ Update user's balance
    const user = await User.findById(authenticatedUserId);
    if (!user) {
      throw createError({ statusCode: 404, statusMessage: 'User not found' });
    }

    const amount = parsed.data.amount;
    const isIncome = parsed.data.type === 'INCOME';

    // Increase or decrease balance
    user.balance += isIncome ? amount : -amount;
    user.transactions.push(transaction._id); // Optional: track transaction IDs
    await user.save();

    return {
      message: 'Transaction saved and balance updated',
      transaction,
      balance: user.balance, // Optional: return updated balance
    };
  } catch (error: any) {
    console.error('Error saving transaction:', error);
    return sendError(event, createError({
      statusCode: error.statusCode || 500, // Use existing status code if available
      statusMessage: error.statusMessage || 'Failed to save transaction'
    }));
  }
});