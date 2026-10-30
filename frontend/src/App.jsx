// App.jsx - the list of all pages and their addresses.
// To add a new page: make a file in /pages, import it here, add one <Route> line.
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './UserContext.jsx';
import Header from './components/Header.jsx';

import Home from './pages/Home.jsx';
import Search from './pages/Search.jsx';
import Opportunity from './pages/Opportunity.jsx';
import Verify from './pages/Verify.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';

import Dashboard from './pages/Dashboard.jsx';
import Applications from './pages/Applications.jsx';
import Hours from './pages/Hours.jsx';
import Certificates from './pages/Certificates.jsx';
import Reviews from './pages/Reviews.jsx';
import Profile from './pages/Profile.jsx';
import Calendar from './pages/Calendar.jsx';
import Notifications from './pages/Notifications.jsx';

import SettingsNotifications from './pages/SettingsNotifications.jsx';
import Account from './pages/Account.jsx';
import Privacy from './pages/Privacy.jsx';
import Appearance from './pages/Appearance.jsx';
import Security from './pages/Security.jsx';
import Logout from './pages/Logout.jsx';

import OrgDashboard from './pages/OrgDashboard.jsx';
import Applicants from './pages/Applicants.jsx';
import ApproveHours from './pages/ApproveHours.jsx';
import IssueCertificates from './pages/IssueCertificates.jsx';
import ManageListings from './pages/ManageListings.jsx';
import CreateOpportunity from './pages/CreateOpportunity.jsx';
import OrgProfile from './pages/OrgProfile.jsx';

// Pages inside <Private> need a logged-in user. Otherwise we go to the login page.
function Private({ children }) {
  const { user } = useUser();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
}

export default function App() {
  return (
    <UserProvider>
      <HashRouter>
        <Header />
        <main>
          <Routes>
            {/* Pages for everyone */}
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/opp/:id" element={<Opportunity />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signup/org" element={<Signup isOrg />} />

            {/* Volunteer pages */}
            <Route path="/dash" element={<Private><Dashboard /></Private>} />
            <Route path="/apps" element={<Private><Applications /></Private>} />
            <Route path="/hours" element={<Private><Hours /></Private>} />
            <Route path="/certs" element={<Private><Certificates /></Private>} />
            <Route path="/reviews" element={<Private><Reviews /></Private>} />
            <Route path="/profile" element={<Private><Profile /></Private>} />
            <Route path="/calendar" element={<Private><Calendar /></Private>} />
            <Route path="/notif" element={<Private><Notifications /></Private>} />

            {/* Settings pages */}
            <Route path="/settings" element={<Private><SettingsNotifications /></Private>} />
            <Route path="/account" element={<Private><Account /></Private>} />
            <Route path="/privacy" element={<Private><Privacy /></Private>} />
            <Route path="/appearance" element={<Private><Appearance /></Private>} />
            <Route path="/security" element={<Private><Security /></Private>} />
            <Route path="/logout" element={<Private><Logout /></Private>} />

            {/* Organization pages */}
            <Route path="/org" element={<Private><OrgDashboard /></Private>} />
            <Route path="/apply" element={<Private><Applicants /></Private>} />
            <Route path="/approve" element={<Private><ApproveHours /></Private>} />
            <Route path="/issue" element={<Private><IssueCertificates /></Private>} />
            <Route path="/manage" element={<Private><ManageListings /></Private>} />
            <Route path="/create" element={<Private><CreateOpportunity /></Private>} />
            <Route path="/orgprof" element={<Private><OrgProfile /></Private>} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </HashRouter>
    </UserProvider>
  );
}
