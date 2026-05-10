import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext.jsx';
import { PrivateRoute, AdminRoute, StudentRoute, GuestRoute } from './routes/ProtectedRoutes.jsx';
import { ROUTES } from './constants/index.js';

// Layouts
import StudentLayout from './layouts/StudentLayout.jsx';
import AdminLayout   from './layouts/AdminLayout.jsx';

// Public pages
import Landing  from './pages/Landing.jsx';
import Login    from './pages/Login.jsx';
import Register from './pages/Register.jsx';

// Student pages
import StudentDashboard from './pages/student/StudentDashboard.jsx';
import Hostels          from './pages/student/Hostels.jsx';
import Rooms            from './pages/student/Rooms.jsx';
import MyApplications   from './pages/student/MyApplications.jsx';
import Notifications    from './pages/student/Notifications.jsx';

// Admin pages
import AdminDashboard    from './pages/admin/AdminDashboard.jsx';
import AdminHostels      from './pages/admin/AdminHostels.jsx';
import AdminRooms        from './pages/admin/AdminRooms.jsx';
import AdminApplications from './pages/admin/AdminApplications.jsx';
import AdminStudents     from './pages/admin/AdminStudents.jsx';

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: { borderRadius: '12px', fontSize: '14px', fontWeight: 500 },
          success: { style: { background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' } },
          error:   { style: { background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' } },
        }}
      />

      <Routes>
        {/* Public */}
        <Route path={ROUTES.HOME}     element={<Landing />} />
        <Route path={ROUTES.LOGIN}    element={<GuestRoute><Login /></GuestRoute>} />
        <Route path={ROUTES.REGISTER} element={<GuestRoute><Register /></GuestRoute>} />

        {/* Student — protected */}
        <Route element={<StudentRoute><StudentLayout /></StudentRoute>}>
          <Route path={ROUTES.STUDENT_DASHBOARD} element={<StudentDashboard />} />
          <Route path={ROUTES.HOSTELS}            element={<Hostels />} />
          <Route path={ROUTES.ROOMS}              element={<Rooms />} />
          <Route path={ROUTES.MY_APPLICATIONS}    element={<MyApplications />} />
          <Route path={ROUTES.NOTIFICATIONS}      element={<Notifications />} />
        </Route>

        {/* Admin — protected */}
        <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route path={ROUTES.ADMIN_DASHBOARD}    element={<AdminDashboard />} />
          <Route path={ROUTES.ADMIN_HOSTELS}      element={<AdminHostels />} />
          <Route path={ROUTES.ADMIN_ROOMS}        element={<AdminRooms />} />
          <Route path={ROUTES.ADMIN_APPLICATIONS} element={<AdminApplications />} />
          <Route path={ROUTES.ADMIN_STUDENTS}     element={<AdminStudents />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

export default App;