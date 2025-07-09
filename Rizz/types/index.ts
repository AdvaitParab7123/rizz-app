import { User } from 'firebase/auth';

export interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
}

export interface NavigationProps {
  navigation: any;
  route?: any;
}

export interface ReplyScreenProps extends NavigationProps {
  route: {
    params: {
      text: string;
    };
  };
}

export interface MatrixRainProps {
  columns?: number;
  characters?: number;
}

export interface BackgroundGradientProps {
  duration?: number;
} 