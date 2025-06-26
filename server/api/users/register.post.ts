import { User } from '~/server/models';
import { connectDB } from '~/server/utils/db';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  // balance: z.number().nonnegative("Balance must be a non-negative number").default(0), // Added default for safety
});

export default defineEventHandler(async (event) => {
  await connectDB();
  const body = await readBody(event);

  const parseResult = userSchema.safeParse(body);

  if (!parseResult.success) {
    const errorMessages = parseResult.error.issues.map((issue) => issue.message).join(', ');
    throw createError({
      statusCode: 400,
      statusMessage: `Validation error: ${errorMessages}`,
    });
  }

  // const { name, email, password, balance } = parseResult.data;
  const { name, email, password } = parseResult.data;

  try {
    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Email already exists',
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 = salt rounds

    // Create the user with hashed password
    // const user = new User({ name, email, password: hashedPassword, balance });
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    return {
      message: 'User created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        // balance: user.balance,
      },
    };
  } catch (err: any) {
    console.error(err);
    throw createError({
      statusCode: 500,
      statusMessage: err.statusMessage || 'Failed to create user', // Use existing statusMessage if available
    });
  }
});