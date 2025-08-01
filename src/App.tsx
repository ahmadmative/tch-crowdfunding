import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";

import DashboardLayout from './components/DashboardLayout';
import Dashboard from './components/Dashboard';
import UsersManagement from './components/UsersManagement';
import CampaignsManagement from './components/CampaignsManagement';
import DonationsManagement from './components/DonationsManagement';
import ReportsAnalytics from './components/ReportsAnalytics';
import NotificationsEmails from './components/NotificationsEmails';
import Settings from './components/Settings';
import CampaignDetails from './pages/CampaignDetails';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/userContext';
import AdminCampaigns from './components/AdminCampaigns';
import EditCampaign from './components/EditCampaign';
import AddUsers from './components/AddUsers';
import DonationDetail from './components/DonationDetail';
import ProtectedRoute from './protectedRoutes/ProtectedRoutes';
import Unauthorized from './pages/Unauthorized';
import AdminSignIn from './pages/AdminLogin';
import { TemplateProvider } from './context/TemplateContext';
import WithDrawRequests from './components/WithDrawRequests';
import FAQsUpdate from './components/FAQsSection';
import AboutUsSectionUpdate from './components/AboutUsSection';
import ChooseUsUpdate from './components/ChooseUsUpdate';
import FeatureSectionUpdate from './components/FeatureSectionUpdate';
import TestimonialUpdate from './components/TestimonialUpdate';
import PayoutUpdate from './components/PayoutSection';
import EmailBuilder from './components/testing-grapesjs/EmailBuilder';
import EditEmailTemplateEditor from './components/testing-grapesjs/EditEmailTemplate';
import CoreContent from './components/CoreContent';
import FaqsCategories from './components/FaqsCategories';
import SupportMails from './components/SupportMails';
import SupportDetails from './components/SupportDetails';
import SocialLinks from './components/settings/SocialLinks';
import WriteBlog from './components/Blogs/Write';
import Blogs from './components/Blogs/Blogs';
import Blog from './components/Blogs/Blog';
import GuideEditor from './components/helpGuides/GuideEditor';
import GuideCategory from './components/helpGuides/GuideCategory';
import GuideMain from './components/helpGuides/GuideMain';
import { useAppConfig } from './context/AppConfigContext';
import OrganizationManagement from './components/OrganizationManagement';
import OrganizationDetails from './components/organization/OrganizationDetails';
import EditBlog from './components/Blogs/Edit';
import EditGuide from './components/helpGuides/EditGuide';
import TermsCondition from './components/dynamicPages/TermsCondition';
import PrivacyPolicy from './components/dynamicPages/PrivacyPolicy';
import PaymentSettings from './pages/PaymentSettings';
import VerificationMain from './pages/organization/verification/VerificationMain';
import S18ADocumentMain from './pages/organization/s18aDocument/S18ADocumentMain';
import BankDetailsMain from './pages/organization/bankDetails/BankDetailsMain';
import WithDrawRequestsDetail from './components/WithDrawRequestsDetail';



function App() {

  const { config } = useAppConfig();

  useEffect(() => {
    if (config?.name) {
      document.title = config.name;
    }
  }, [config]);


  return (
    <AuthProvider>
      <TemplateProvider>
      <BrowserRouter>
      <ToastContainer 
        position="top-right" 
        autoClose={2000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover
        theme="light" 
      />

      <Routes>
        <Route path='/unauthorized' element={<Unauthorized />} />

        <Route path="/" element={<AdminSignIn />} />
         



        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/" element={<DashboardLayout />}>
            
            <Route path="/admin/campaigns">
              <Route index element={<AdminCampaigns />} />
              
              <Route path=":id" element={<CampaignDetails />} />
              <Route path=":id/edit" element={<EditCampaign />} />

            </Route>
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
              <Route path="add" element={<AddUsers />} />
              <Route path="edit/:id" element={<AddUsers />} />
            </Route>
            <Route path="campaigns">
              <Route index element={<CampaignsManagement />} />
              <Route path="manage/all" element={<CampaignsManagement />} />
              <Route path="manage/pending" element={<CampaignsManagement />} />
              <Route path="manage/active" element={<CampaignsManagement />} />
              <Route path="performance" element={<CampaignsManagement />} />
              
            </Route>

            <Route path="organizations">
              <Route index element={<OrganizationManagement />} />
              <Route path=":id" element={<OrganizationDetails/>} />
              <Route path="bank-details" element={<BankDetailsMain/>} />
              <Route path="s18a-document" element={<S18ADocumentMain/>} />
              <Route path="verification" element={<VerificationMain/>} />

            </Route>



            <Route path="donations">
              <Route index element={<DonationsManagement />} />
              <Route path="settings" element={<DonationsManagement />} />
              <Route path="settings/transactions" element={<DonationsManagement />} />
              <Route path="settings/payments" element={<DonationsManagement />} />
              <Route path="settings/logs" element={<DonationsManagement />} />
              <Route path=":id" element={<DonationDetail />} />
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
            <Route path="/requests" element={<WithDrawRequests />} />
            <Route path="/requests/:id" element={<WithDrawRequestsDetail />} />

            <Route path='/content'>
              <Route path="terms" element={<TermsCondition />} />
              <Route path="privacy" element={<PrivacyPolicy />} />
              <Route path="faqs" element={<FAQsUpdate />} />
              <Route path="faqs/categories" element={<FaqsCategories />} />
              <Route path="about" element={<AboutUsSectionUpdate />} />
              <Route path="choose-us" element={<ChooseUsUpdate />} />
              <Route path='features' element={<FeatureSectionUpdate/>} />
              <Route path='testimonial' element={<TestimonialUpdate/>} />
              <Route path="payouts" element={<PayoutUpdate/>} />
              <Route path="social" element={<SocialLinks/>} />
            </Route>


            <Route path={"/builder"} element={<EmailBuilder />} />
            <Route path={"/builder/:id"} element={<EditEmailTemplateEditor />} />
            <Route path={"/content" } element={<CoreContent />} />

            <Route path="/support" element={<SupportMails />} />
            <Route path="/support/:id" element={<SupportDetails />} />

            <Route path='/blog/write' element={<WriteBlog />} />
            <Route path='/blogs' element={<Blogs />} />
            <Route path='/blog/:id' element={<Blog />} />
            <Route path='/blog/edit/:id' element={<EditBlog />} />


            <Route path='/guide/write' element={<GuideEditor />} />
            {/* <Route path='/guide' element={<GuideCategory />} /> */}
            <Route path='/guide' element={<GuideMain />} />
            <Route path='/guide/edit/:id' element={<EditGuide />} /> 

            
            


            
            <Route path='/payment-settings' element={<PaymentSettings/>}/>
            

            {/* Catch all unmatched routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Route>


     


      </Routes>
    </BrowserRouter>
    </TemplateProvider>

    </AuthProvider>
    
  );
}

export default App;
