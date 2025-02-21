export type User = {
  id: string;
  email: string;
  username: string;
  password: string;
  profilePicture?: string;
  role: 'admin' | 'user';
  height?: number;
  weight?: number;
  biography?: string;
};

export type Comment = {
  id: string;
  postId: string;
  userId: string;
  content: string;
  postedAt?: string;
};

export type Post = {
  id: string;
  userId: string;
  postedAt: string;
  description: string;
  media: string;
  workoutId?: string;
  comments?: Comment[];
  likes?: number;
};

export type Workout = {
  id: string;
  userId: string;
  name: string;
  description: string;
}

export type Exercise = {
  id: string;
  name: string;
  muscularGroup: string;
  description: string;
}

export type Chat = {
  id: string;
  name: string;
  isGroup: string;
  avatar?: string;
}

export type Message = {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  timeStamp: string;
}

export type Event = {
  id: string;
  name: string;
  description: string;
  organizerId: string;
  date: string;
  location: string;
  maxParticipants?: number;
  media?: string;
}
