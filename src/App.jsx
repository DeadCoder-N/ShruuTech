import { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layout components
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoadingScreen from './components/ui/LoadingScreen';

// Public pages
import Home from './pages/Home';
import Services from './pages/Services';
import Courses from './pages/Courses';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Careers from './pages/Careers';
import About from './pages/About';
import NotFound from './pages/NotFound';
import Login from './pages/Login';

// Admin pages - lazy loaded
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminServices = lazy(() => import('./pages/admin/Services'));
const AdminCourses = lazy(() => import('./pages/admin/Courses'));
const AdminBlog = lazy(() => import('./pages/admin/Blog'));
const AdminCareers = lazy(() => import('./pages/admin/Careers'));

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="courses" element={<Courses />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:id" element={<BlogPost />} />
          <Route path="careers" element={<Careers />} />
          <Route path="about" element={<About />} />
          <Route path="login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route 
            index 
            element={
              <Suspense fallback={<LoadingScreen />}>
                <AdminDashboard />
              </Suspense>
            } 
          />
          <Route 
            path="services" 
            element={
              <Suspense fallback={<LoadingScreen />}>
                <AdminServices />
              </Suspense>
            } 
          />
          <Route 
            path="courses" 
            element={
              <Suspense fallback={<LoadingScreen />}>
                <AdminCourses />
              </Suspense>
            } 
          />
          <Route 
            path="blog" 
            element={
              <Suspense fallback={<LoadingScreen />}>
                <AdminBlog />
              </Suspense>
            } 
          />
          <Route 
            path="careers" 
            element={
              <Suspense fallback={<LoadingScreen />}>
                <AdminCareers />
              </Suspense>
            } 
          />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default App;