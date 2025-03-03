import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './components/Dashboard';
import UsersManagement from './components/UsersManagement';
import CampaignsManagement from './components/CampaignsManagement';
import DonationsManagement from './components/DonationsManagement';
import ReportsAnalytics from './components/ReportsAnalytics';
import NotificationsEmails from './components/NotificationsEmails';
import Settings from './components/Settings';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import NavLayout from './layouts/NavLayout';
import Verification from './pages/Verification';
import ForgetPassword from './pages/ForgetPassword';
import NewPassword from './pages/NewPassword';
import Campaigns from './pages/Campaigns';
import CampaignDetails from './pages/CampaignDetails';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NavLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgetpassword" element={<ForgetPassword />} />
          <Route path="/verification" element={<Verification />} />
          <Route path="/newpassword" element={<NewPassword />} />
          <Route path="/home/campaigns" element={<Campaigns />} />
          <Route path="/home/campaigns/:id" element={<CampaignDetails />} />

        </Route>




        <Route path="/" element={<DashboardLayout />}>
          {/* <Route index element={<Dashboard />} /> */}
          <Route path="dashboard">
            <Route index element={<Dashboard />} />
            <Route path="overview" element={<Dashboard />} />
            <Route path="metrics" element={<Dashboard />} />
          </Route>
          <Route path="users">
            <Route index element={<UsersManagement />} />
            <Route path="manage/users" element={<UsersManagement />} />
            <Route path="manage/admins" element={<UsersManagement />} />
            <Route path="permissions" element={<UsersManagement />} />
          </Route>
          <Route path="campaigns">
            <Route index element={<CampaignsManagement />} />
            <Route path="manage/all" element={<CampaignsManagement />} />
            <Route path="manage/pending" element={<CampaignsManagement />} />
            <Route path="manage/active" element={<CampaignsManagement />} />
            <Route path="performance" element={<CampaignsManagement />} />
          </Route>
          <Route path="donations">
            <Route index element={<DonationsManagement />} />
            <Route path="settings" element={<DonationsManagement />} />
            <Route path="settings/transactions" element={<DonationsManagement />} />
            <Route path="settings/payments" element={<DonationsManagement />} />
            <Route path="settings/logs" element={<DonationsManagement />} />
          </Route>
          <Route path="reports">
            <Route index element={<ReportsAnalytics />} />
            <Route path="campaign" element={<ReportsAnalytics />} />
            <Route path="donor" element={<ReportsAnalytics />} />
            <Route path="custom" element={<ReportsAnalytics />} />
          </Route>
          <Route path="notifications">
            <Route index element={<NotificationsEmails />} />
            <Route path="center" element={<NotificationsEmails />} />
            <Route path="emails" element={<NotificationsEmails />} />
            <Route path="templates" element={<NotificationsEmails />} />
          </Route>
          <Route path="settings">
            <Route index element={<Settings />} />
            <Route path="general" element={<Settings />} />
            <Route path="security" element={<Settings />} />
            <Route path="integrations" element={<Settings />} />
          </Route>
          

          {/* Catch all unmatched routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
