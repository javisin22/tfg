export type User = {
  id: string;
  username: string;
  email: string;
  password: string;
  profilePicture?: string;
  role: 'admin' | 'user';
  height?: number;
  weight?: number;
  biography?: string;
};

export type Post = {
  id: string;
  userId: string;
  postedAt: string;
  description: string;
  media: string;
  workoutId?: string;
//   comments: Comment[];
};

export type Comment = {
  id: string;
  postId: string;
  userId: string;
  content: string;
  postedAt?: string;
};

export type Like = {
    id: string;
    postId: string;
    userId: string;
}

// Complete with the rest of the tables from the DB
