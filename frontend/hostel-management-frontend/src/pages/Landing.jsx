import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ROUTES } from '../constants/index.js';
import { FiShield, FiHome, FiBell, FiUsers, FiArrowRight, FiCheckCircle } from 'react-icons/fi';

const features = [
  { icon: FiHome,     title: 'Room Browsing',       desc: 'View all available hostel rooms with real-time occupancy status.' },
  { icon: FiUsers,    title: 'Easy Applications',   desc: 'Apply for a room in seconds. Track your application live.' },
  { icon: FiBell,     title: 'Instant Notifications', desc: 'Get notified the moment your application is approved or rejected.' },
  { icon: FiShield,   title: 'Admin Control',       desc: 'Powerful admin dashboard to manage hostels, rooms and students.' },
];

const benefits = [
  'No paperwork — fully digital',
  'Transparent allocation process',
  'Role-based secure access',
  'Real-time room availability',
  'Automated notifications',
  'Mobile-friendly interface',
];

const Landing = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-primary-700">HostelMS</span>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to={isAdmin ? ROUTES.ADMIN_DASHBOARD : ROUTES.STUDENT_DASHBOARD}
                className="btn-primary"
              >
                Go to Dashboard <FiArrowRight />
              </Link>
            ) : (
              <>
                <Link to={ROUTES.LOGIN}    className="btn-secondary">Sign In</Link>
                <Link to={ROUTES.REGISTER} className="btn-primary">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
        <span className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-primary-100">
          <FiShield className="w-3.5 h-3.5" />
          College Hostel Management — Digitised
        </span>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
          Hostel Room Allocation
          <span className="block text-primary-600 mt-1">Made Simple</span>
        </h1>

        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          A web-based platform that automates hostel room allocation for educational institutions.
          Students apply online, admins approve in one click.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to={ROUTES.REGISTER} className="btn-primary btn-lg w-full sm:w-auto">
            Register as Student <FiArrowRight />
          </Link>
          <Link to={ROUTES.LOGIN} className="btn-secondary btn-lg w-full sm:w-auto">
            Admin / Student Login
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Everything you need</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card text-center">
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-10">Why HostelMS?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {benefits.map((b) => (
              <div key={b} className="flex items-center gap-3 bg-gray-50 rounded-xl px-5 py-3.5">
                <FiCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-sm text-gray-700 font-medium">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-600 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to get started?</h2>
          <p className="text-primary-100 mb-8 text-sm">
            Register now and apply for your hostel room in under 2 minutes.
          </p>
          <Link to={ROUTES.REGISTER} className="btn bg-white text-primary-700 hover:bg-primary-50 btn-lg">
            Create Free Account <FiArrowRight />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} HostelMS — Hostel Room Allocation & Management System
        </div>
      </footer>
    </div>
  );
};

export default Landing;