import { Routes, Route } from 'react-router-dom';
import Premium from '../premium/PremiumSubscription';
import Footer from '../Footer';
// other imports...

function MainRoute() {
  return (
    <Routes>
      {/* your other routes */}
      <Route path="../premium/PremiumSubscription" element={<Premium />} />
    </Routes>
  );
}

export default MainRoute;
