import { Answer, Post, User } from '@prisma/client';
import { ProductStatus } from './ProductKind';

export interface CommunityState extends Post {
  user: User;
  _count: {
    Answers: number;
    Interests: number;
  };
}

export interface AnswerWithUser extends Answer {
  user: User;
}

export interface PostWithUser extends Post {
  user: User;
  _count: {
    Answers: number;
    Interests: number;
  };
  Answers: AnswerWithUser[];
  statusCd: ProductStatus;
}
