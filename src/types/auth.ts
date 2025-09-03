export interface User {
  id: number;
  supabase_uid: string;
  username: string;
  email: string;
  bio?: string;
  avatar_url?: string;
}

export interface RegisterData{
    username: string;
    email: string;
    password: string;
}

export interface LoginData{
    email: string;
    password: string;
}

