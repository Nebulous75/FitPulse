import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

interface UserProfile {
  goals: string[];
  lifestyle: string;
  region: string;
  age: number | null;
  sex: string;
  weight: number | null;
  weightUnit: string;
  height: number | null;
  heightUnit: string;
  bmi: number | null;
  dailyCalorieLimit: number | null;
}

interface Meal {
  id?: string;
  name: string;
  calories: number;
  ingredients: Array<{ name: string; amount: string; calories: number }>;
  recipe: string;
  cuisine: string;
  mood: string;
  videoUrl?: string;
}

interface Badge {
  id?: string;
  name: string;
  description: string;
  xpPoints: number;
  earnedAt?: Date;
}

interface AppContextType {
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;

  currentMood: string;
  setCurrentMood: (mood: string) => void;

  currentMeal: Meal | null;
  setCurrentMeal: (meal: Meal | null) => void;

  mealHistory: Meal[];
  addMealToHistory: (meal: Meal) => void;

  badges: Badge[];
  addBadge: (badge: Badge) => void;

  totalXP: number;

  mentalHealthMessages: Message[];
  addMentalHealthMessage: (sender: 'user' | 'ai', text: string) => void;

  mealPlanMessages: Message[];
  addMealPlanMessage: (sender: 'user' | 'ai', text: string) => void;

  availableIngredients: string;
  setAvailableIngredients: (ingredients: string) => void;

  preferredCuisine: string;
  setPreferredCuisine: (cuisine: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    goals: [],
    lifestyle: '',
    region: '',
    age: null,
    sex: '',
    weight: null,
    weightUnit: 'kg',
    height: null,
    heightUnit: 'cm',
    bmi: null,
    dailyCalorieLimit: null,
  });

  const [currentMood, setCurrentMood] = useState('');
  const [currentMeal, setCurrentMeal] = useState<Meal | null>(null);
  const [mealHistory, setMealHistory] = useState<Meal[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [mentalHealthMessages, setMentalHealthMessages] = useState<Message[]>([]);
  const [mealPlanMessages, setMealPlanMessages] = useState<Message[]>([]);
  const [availableIngredients, setAvailableIngredients] = useState('');
  const [preferredCuisine, setPreferredCuisine] = useState('');

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updates }));
  };

  const addMealToHistory = (meal: Meal) => {
    setMealHistory((prev) => [...prev, meal]);
  };

  const addBadge = (badge: Badge) => {
    setBadges((prev) => [...prev, badge]);
  };

  const totalXP = badges.reduce((sum, badge) => sum + badge.xpPoints, 0);

  const addMentalHealthMessage = (sender: 'user' | 'ai', text: string) => {
    setMentalHealthMessages((prev) => [...prev, { sender, text }]);
  };

  const addMealPlanMessage = (sender: 'user' | 'ai', text: string) => {
    setMealPlanMessages((prev) => [...prev, { sender, text }]);
  };

  return (
    <AppContext.Provider
      value={{
        userProfile,
        setUserProfile,
        updateUserProfile,
        currentMood,
        setCurrentMood,
        currentMeal,
        setCurrentMeal,
        mealHistory,
        addMealToHistory,
        badges,
        addBadge,
        totalXP,
        mentalHealthMessages,
        addMentalHealthMessage,
        mealPlanMessages,
        addMealPlanMessage,
        availableIngredients,
        setAvailableIngredients,
        preferredCuisine,
        setPreferredCuisine,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
