// /server/api/users/me.ts
import { getCookie } from 'h3';
import jwt from 'jsonwebtoken';
import { User } from '~/server/models';
import { connectDB } from '~/server/utils/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default defineEventHandler(async (event) => {
  await connectDB();

  const token = getCookie(event, 'auth_token');
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Not authenticated' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await User.findById(decoded.userId).select('_id name email');
    if (!user) throw createError({ statusCode: 404, statusMessage: 'User not found' });

    return { user };
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Invalid or expired token' });
  }
});