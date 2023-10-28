import { Post, User } from '@prisma/client';

export interface CommunityState extends Post {
  user: User;
  _count: {
    Answers: number;
    Interests: number;
  };
}
