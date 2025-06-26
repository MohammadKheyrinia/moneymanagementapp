// /server/api/users/login.ts
import { User } from '~/server/models';
import { connectDB } from '~/server/utils/db';
import { generateToken } from '~/server/utils/jwt';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { setCookie } from 'h3';

export default defineEventHandler(async (event) => {
  await connectDB();

  const body = await readBody(event);

  const schema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  const result = schema.safeParse(body);
  if (!result.success) {
    // Return a generic error message for invalid format to avoid leaking info
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid email or password format',
      // data: result.error.flatten(), // Avoid sending detailed internal errors to client
    });
  }

  const { email, password } = result.data;

  const user = await User.findOne({ email });
  if (!user) {
    // Generic message for security
    throw createError({ statusCode: 401, statusMessage: 'Invalid email or password' });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    // Generic message for security
    throw createError({ statusCode: 401, statusMessage: 'Invalid email or password' });
  }

  const token = generateToken(user._id.toString());

  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return {
    message: 'Login successful',
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
  };
});