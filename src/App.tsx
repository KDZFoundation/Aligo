/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import CompleteProfile from './pages/CompleteProfile';
import CreateProject from './pages/CreateProject';
import EditProject from './pages/EditProject';
import ProjectMarketplace from './pages/ProjectMarketplace';
import Profile from './pages/Profile';
import AboutPlatform from './pages/AboutPlatform';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="auth" element={<Auth />} />
              <Route path="complete-profile" element={<CompleteProfile />} />
              <Route path="profile" element={<Profile />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="create-project" element={<CreateProject />} />
              <Route path="edit-project/:id" element={<EditProject />} />
              <Route path="projects" element={<ProjectMarketplace />} />
              <Route path="about-platform" element={<AboutPlatform />} />
              <Route path="about-us" element={<AboutUs />} />
              <Route path="contact" element={<Contact />} />
              {/* Other routes will be added here */}
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}
