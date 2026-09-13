import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { BundlesPage } from './pages/BundlesPage';
import { BundleDetailsPage } from './pages/BundleDetailsPage';
import { DownloadPage } from './pages/DownloadPage';
import { PaymentFailedPage } from './pages/PaymentFailedPage';
import { SessionExpiredPage } from './pages/SessionExpiredPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-[#08090d] text-gray-100">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/bundles" element={<BundlesPage />} />
            <Route path="/bundles/:bundleId" element={<BundleDetailsPage />} />
            <Route path="/download" element={<DownloadPage />} />
            <Route path="/payment-failed" element={<PaymentFailedPage />} />
            <Route path="/session-expired" element={<SessionExpiredPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
