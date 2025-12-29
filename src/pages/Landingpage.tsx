import { useState, useEffect } from 'react';
import Hero from './Hero';
import ReservationForm from './ReservationForm';
import TableAvailability from './TableAvailability';
import FlashSale from './FlashSale';
import VibeGallery from './VibeGallery';
import MenuSection from './MenuSection';
import OrderMode from './OrderMode';
import ReservationTracker from './ReservationTracker';
import Footer from './Footer';
import LocationHours from './LocationHours';
function LandingPage() {
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [tableId, setTableId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tableIdParam = params.get('tableId');
    if (tableIdParam) {
      setTableId(tableIdParam);
    }
  }, []);

  const scrollToMenu = () => {
    const menuSection = document.getElementById('menu');
    menuSection?.scrollIntoView({ behavior: 'smooth' });
  };

  if (tableId) {
    return <OrderMode tableId={tableId} onBack={() => setTableId(null)} />;
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Hero
        onReserveClick={() => setShowReservationForm(true)}
        onExploreMenuClick={scrollToMenu}
      />

      <TableAvailability />

      <FlashSale />

      <VibeGallery />

      <MenuSection />


      <LocationHours />

      <Footer />

      {showReservationForm && (
        <ReservationForm onClose={() => setShowReservationForm(false)} />
      )}

      <ReservationTracker />
    </div>
  );
}

export default LandingPage;
