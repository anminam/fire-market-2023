import { User } from '@prisma/client';

export type IUser = Omit<User, 'firebaseUid' | 'createdAt' | 'updatedAt' | 'phone'>;
