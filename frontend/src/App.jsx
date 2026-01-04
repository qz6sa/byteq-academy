import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import LearningPaths from './pages/LearningPaths';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import NotFound from './pages/NotFound';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';

// Protected Route Component
import ProtectedRoute from './components/common/ProtectedRoute';

// Import Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import ManageCourses from './pages/admin/ManageCourses';
import CreateCourse from './pages/admin/CreateCourse';
import ManageCategories from './pages/admin/ManageCategories';
import ManageUsers from './pages/admin/ManageUsers';
import ManageReviews from './pages/admin/ManageReviews';
import Learning from './pages/Learning';
import Profile from './pages/Profile';

// Placeholder components
const MyCourses = () => <div className="container mx-auto px-4 py-20"><h1 className="text-4xl font-bold text-center">دوراتي - قيد الإنشاء</h1></div>;
const Certificates = () => <div className="container mx-auto px-4 py-20"><h1 className="text-4xl font-bold text-center">شهاداتي - قيد الإنشاء</h1></div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'rgba(26, 26, 46, 0.9)',
              color: '#fff',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '16px',
            },
            success: {
              iconTheme: {
                primary: '#06ffa5',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ff0054',
                secondary: '#fff',
              },
            },
          }}
        />

        <Routes>
          {/* Public Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/learning-paths" element={<LearningPaths />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:slug" element={<CourseDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected User Routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-courses"
              element={
                <ProtectedRoute>
                  <MyCourses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/certificates"
              element={
                <ProtectedRoute>
                  <Certificates />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Learning Page (Full Screen) */}
          <Route
            path="/learn/:courseId"
            element={
              <ProtectedRoute>
                <Learning />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="courses" element={<ManageCourses />} />
            <Route path="courses/create" element={<CreateCourse />} />
            <Route path="courses/edit/:id" element={<CreateCourse />} />
            <Route path="categories" element={<ManageCategories />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="reviews" element={<ManageReviews />} />
          </Route>

          {/* 404 - Catch all routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
