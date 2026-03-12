import { createBrowserRouter } from 'react-router';
import { Header } from './components/header';
import { Footer } from './components/footer';
import { AdminLayout } from './components/admin-layout';

// Public Pages
import Home from './pages/home';
import Destinations from './pages/destinations';
import Visas from './pages/visas';
import PackageDetails from './pages/package-details';
import Contact from './pages/contact';
import Careers from './pages/careers';
import About from './pages/about';
import PrivacyPolicy from './pages/legal/privacy-policy';
import TermsOfService from './pages/legal/terms-of-service';
import CookiePolicy from './pages/legal/cookie-policy';
import RefundPolicy from './pages/legal/refund-policy';
import Blogs from './pages/blogs';
import BlogDetail from './pages/blog-detail';

// Admin Pages
import AdminLogin from './pages/admin/login';
import AdminDashboard from './pages/admin/dashboard';
import ManageDestinations from './pages/admin/manage-destinations';
import ManageVisas from './pages/admin/manage-visas';
import ManageBookings from './pages/admin/manage-bookings';
import ManageMessages from './pages/admin/manage-messages';
import ManagePackages from './pages/admin/manage-packages';
import ManageTestimonials from './pages/admin/manage-testimonials';
import ManageCareers from './pages/admin/manage-careers';
import ManageFeatures from './pages/admin/manage-features';
import AdminSettings from './pages/admin/settings';
import ClosedLeads from './pages/admin/closed-leads';
import ManageAbout from './pages/admin/manage-about';
import ManageBlogs from './pages/admin/manage-blogs';
function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: () => (
      <PublicLayout>
        <Home />
      </PublicLayout>
    )
  },
  {
    path: '/destinations',
    Component: () => (
      <PublicLayout>
        <Destinations />
      </PublicLayout>
    )
  },
  {
    path: '/visas',
    Component: () => (
      <PublicLayout>
        <Visas />
      </PublicLayout>
    )
  },
  {
    path: '/package/:id',
    Component: () => (
      <PublicLayout>
        <PackageDetails />
      </PublicLayout>
    )
  },
  {
    path: '/contact',
    Component: () => (
      <PublicLayout>
        <Contact />
      </PublicLayout>
    )
  },
  {
    path: '/careers',
    Component: () => (
      <PublicLayout>
        <Careers />
      </PublicLayout>
    )
  },
  {
    path: '/about',
    Component: () => (
      <PublicLayout>
        <About />
      </PublicLayout>
    )
  },
  {
    path: '/legal/privacy',
    Component: () => (
      <PublicLayout>
        <PrivacyPolicy />
      </PublicLayout>
    )
  },
  {
    path: '/legal/terms',
    Component: () => (
      <PublicLayout>
        <TermsOfService />
      </PublicLayout>
    )
  },
  {
    path: '/legal/cookies',
    Component: () => (
      <PublicLayout>
        <CookiePolicy />
      </PublicLayout>
    )
  },
  {
    path: '/legal/refund',
    Component: () => (
      <PublicLayout>
        <RefundPolicy />
      </PublicLayout>
    )
  },
  {
    path: '/blog',
    Component: () => (
      <PublicLayout>
        <Blogs />
      </PublicLayout>
    )
  },
  {
    path: '/blog/:slug',
    Component: () => (
      <PublicLayout>
        <BlogDetail />
      </PublicLayout>
    )
  },
  {
    path: '/admin/login',
    Component: AdminLogin
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        Component: AdminDashboard
      },
      {
        path: 'destinations',
        Component: ManageDestinations
      },
      {
        path: 'visas',
        Component: ManageVisas
      },
      {
        path: 'bookings',
        Component: ManageBookings
      },
      {
        path: 'messages',
        Component: ManageMessages
      },
      {
        path: 'packages',
        Component: ManagePackages
      },
      {
        path: 'testimonials',
        Component: ManageTestimonials
      },
      {
        path: 'careers',
        Component: ManageCareers
      },
      {
        path: 'features',
        Component: ManageFeatures
      },
      {
        path: 'settings',
        Component: AdminSettings
      },
      {
        path: 'closed-leads',
        Component: ClosedLeads
      },
      {
        path: 'about',
        Component: ManageAbout
      },
      {
        path: 'blogs',
        Component: ManageBlogs
      }
    ]
  }
]);