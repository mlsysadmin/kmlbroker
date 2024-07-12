import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import MainOutlet from '../pages/MainOutlet';
import NewPage from '../pages/New.page'
import Dashboard from '../pages/Dashboard.page';
import { 
    HouseForRentPage, 
    DiscoverHomePage, 
    BuyAHomePage, 
    RefinancePage, 
    InsuranceGuidePage, 
    ContactUsPage,
    RentPage,
    SellPage,
    LoanCalculatorPage,
    MortagagePage} from '../pages';
import Allpage from '../pages/Buyer.All.page';
import Featuredpage from '../pages/Buyer.Featured.page';
import SuccessModal from '../components/SuccessModal';
import SuccessfullySubmitted from '../components/SuccessfullySubmitted';
import ApplicationModal from '../components/ApplicationModal';
import OTPModal from '../components/OTPModal';
import ApplicationHistory from '../components/ApplicationHistory';
import CancelPage from '../components/CancelPage';

const Routes = [
    {
        path: "/",
        element: <MainOutlet/>,
        children: [
            {
                path: "/",
                element: <Dashboard/>
            },
            {
              path: "/new-page",
              element: <NewPage/>
            },
            {
                path: "/house-for-rent-page",
                element: <HouseForRentPage/>
            },
            {
                path: "/discover-home-page",
                element: <DiscoverHomePage/>
            },
            {
                path: "/buy-a-home-page",
                element: <BuyAHomePage/>
            },
            {
                path: "/refinance-page",
                element: <RefinancePage/>
            },
            {
                path: "/insurance-guide-page",
                element: <InsuranceGuidePage/>
            },
            {
                path: "/all",
                element: <Allpage/>
            },
            {
                path: "featured",
                element: <Featuredpage/>
            },
            {
                path: "/contact-us",
                element: <ContactUsPage/>
            },
            {
                path: "/rent-page",
                element: <RentPage/>
            },
            {
                path: "/sell-page",
                element: <SellPage/>
            },
            {
                path: "/loan-calculator",
                element: <LoanCalculatorPage/>
            },
            {
                path: "/mortgage-page",
                element: <MortagagePage/>
            },
            {
                path: "/modal",
                element: <SuccessModal/>
            },
            {
                path: "/modal2",
                element: <SuccessfullySubmitted/>
            },
            {
                path: "/modal3",
                element: <ApplicationModal/>
            },
            {
                path: "/modal4",
                element: <OTPModal/>
            },
            {
                path: "/application-history",
                element: <ApplicationHistory/>
            },
            {
                path: "/application-cancel",
                element: <CancelPage/>
            }
        ]
    }
]

const AppRouter = createBrowserRouter(Routes);

export default AppRouter
