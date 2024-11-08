import Inventory from '../components/Inventory';
import Navbar from '../components/Navbar';

const Dashboard = () => (
  <div className="bg-black min-h-screen text-white">
    <Navbar />
    <Inventory/>
  </div>
);

export default Dashboard;
