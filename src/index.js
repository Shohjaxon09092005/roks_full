import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from './pages/ErrorPage';
import Home from './pages/Home';
import Yangiliklar from './pages/Yangiliklar';
import Contact from './pages/Contact';
import NewsAbout from './components/NewsAbout';
import Xizmatlar from './pages/Xizmatlar';
import DoctorsPage from './pages/DoctorsPage';
// import Kirish from './pages/Kirish';
// import SignUp from './pages/SignUp';
import Online from './pages/Online';
import ServicesAbout from './pages/ServicesAbout';
import DoctorsAbout from './pages/DoctorsAbout';
import DiseasesPage from './pages/DiseasesPage';
import DiseaseDetails from './components/DiseaseDetails';
// import User from './pages/User';
// import Appointments from './pages/Appointments';
// import MedicalHistory from './pages/MedicalHistory';
import Chat from './pages/Chat';
import Login from './Admin/Pages/Login';
import AdminPanel from './Admin/Pages/AdminPanel';
import HomeAdmin from './Admin/Pages/HomeAdmin';
import ServiceAdmin from './Admin/Pages/ServiceAdmin';
import DoctorAdmin from './Admin/Pages/DoctorAdmin';
import NewsAdmin from './Admin/Pages/NewsAdmin';
import KasallikAdmin from './Admin/Pages/KasallikAdmin';
import ContactAdmin from './Admin/Pages/ContactAdmin';
import QabulAdmin from './Admin/Pages/QabulAdmin';
import ServiceDoctor from './Admin/Pages/ServiceDoctor';
import KasallikFeed from './Admin/Pages/KasallikFeed';
import ServiceFeed from './Admin/Pages/ServiceFeed';
import DoctorFeed from './Admin/Pages/DoctorFeed';
import NewsFeed from './Admin/Pages/NewsFeed';
import FeedbackHome from './Admin/Pages/FeedbackHome';
import ContactAdminFeed from './Admin/Pages/ContactAdminFeed';
import ProtectedRoute from './Admin/Utils/ProtectedRoute';
const appRouter = createBrowserRouter([{
  element: <App />,
  path: "/",
  errorElement: <ErrorPage />,
  children: [{
    path: "/",
    element: <Home />

  },
  {
    path: "/Xizmatlar",
    element: <Xizmatlar />
  },
  {
    path: "/doctors",
    element: <DoctorsPage />
  },

  {
    path: "/yangiliklar",
    element: <Yangiliklar />
  },
  {
    path: "/contact",
    element: <Contact />
  },
  // {
  //   path: "/kirish",
  //   element: <Kirish />
  // },
  // {
  //   path: "/user",
  //   element: <User />
  // },
  // {
  //   path: "/qabulUser",
  //   element: <Appointments />
  // },
  // {
  //   path: "/medHistory",
  //   element: <MedicalHistory />
  // },
  {
    path: "/chat",
    element: <Chat />
  },
  // {
  //   path: "/ro'yxatdan_o'tish",
  //   element: <SignUp />
  // },
  {
    path: "/qabul",
    element: <Online />
  },
  {
    path: "/kasalliklar",
    element: <DiseasesPage />
  },

  {
    path: "/newsAbout/:id",
    element: <NewsAbout />
  },
  {
    path: "/ServicesAbout/:id",
    element: <ServicesAbout />
  },
  {
    path: "/DoctorsAbout/:id",
    element: <DoctorsAbout />
  },
  {
    path: "/diseases/:id",
    element: <DiseaseDetails />
  },

  ]
},
{
  path: "/admin",
  element: <Login />
},
{
  path: "/admin-panel",
  element: <ProtectedRoute element={<AdminPanel />} />,
},
{
  path: "/home_admin",
  element: <HomeAdmin />
},
{
  path: "/service_admin",
  element: <ServiceAdmin />
},
{
  path: "/serviceFeed_admin",
  element: <ServiceFeed />
},
{
  path: "/doctor_admin",
  element: <DoctorAdmin/>
},
{
  path: "/doctorFeed_admin",
  element: <DoctorFeed/>
},
{
  path: "/service_doctor",
  element: <ServiceDoctor/>
},
{
  path: "/news_admin",
  element: <NewsAdmin/>
},
{
  path: "/newsFeed_admin",
  element: <NewsFeed/>
},
{
  path: "/kasallik_admin",
  element: <KasallikAdmin/>
},
{
  path: "/kasallikFeed_admin",
  element: <KasallikFeed/>
},
{
  path: "/social_admin",
  element: <ContactAdmin/>
},
{
  path: "/qabul_admin",
  element: <QabulAdmin/>
},
{
  path: "/feedback_admin",
  element: <FeedbackHome/>
},
{
  path: "/contactFeed_admin",
  element: <ContactAdminFeed/>
},
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={appRouter} />
  </React.StrictMode>
);

