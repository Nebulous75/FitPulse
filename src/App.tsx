import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import FloatingMentalHealthChat from './components/FloatingMentalHealthChat';
import DarkModeToggle from './components/DarkModeToggle';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import HomeScreen from './screens/HomeScreen';
import BMIResultsScreen from './screens/BMIResultsScreen';
import MoodScreen from './screens/MoodScreen';
import MealPlannerScreen from './screens/MealPlannerScreen';
import RecipeScreen from './screens/RecipeScreen';
import SummaryScreen from './screens/SummaryScreen';
import MealPlanChatScreen from './screens/MealPlanChatScreen';
import BadgesScreen from './screens/BadgesScreen';
import ScannerScreen from './screens/ScannerScreen';
import HeartRateMonitorScreen from './screens/HeartRateMonitorScreen';
import WorkoutScreen from './screens/WorkoutScreen';
import BodyScanScreen from './screens/BodyScanScreen';
import ProfileUpdateScreen from './screens/ProfileUpdateScreen';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <Router>
          <Routes>
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/signup" element={<SignUpScreen />} />

            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <HomeScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mood"
              element={
                <ProtectedRoute>
                  <MoodScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/meal-planner"
              element={
                <ProtectedRoute>
                  <MealPlannerScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recipe"
              element={
                <ProtectedRoute>
                  <RecipeScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/summary"
              element={
                <ProtectedRoute>
                  <SummaryScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/meal-plan-chat"
              element={
                <ProtectedRoute>
                  <MealPlanChatScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/badges"
              element={
                <ProtectedRoute>
                  <BadgesScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/scanner"
              element={
                <ProtectedRoute>
                  <ScannerScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/heart-rate"
              element={
                <ProtectedRoute>
                  <HeartRateMonitorScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/workout"
              element={
                <ProtectedRoute>
                  <WorkoutScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/body-scan"
              element={
                <ProtectedRoute>
                  <BodyScanScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile-update"
              element={
                <ProtectedRoute>
                  <ProfileUpdateScreen />
                </ProtectedRoute>
              }
            />

            <Route
              path="/bmi-results"
              element={
                <ProtectedRoute>
                  <BMIResultsScreen />
                </ProtectedRoute>
              }
            />

            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
          <FloatingMentalHealthChat />
          <DarkModeToggle />
        </Router>
      </AppProvider>
    </AuthProvider>
  </ThemeProvider>
  );
}

export default App;
