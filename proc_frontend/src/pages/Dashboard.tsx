import { logout } from '../utils/auth';

const Dashboard = () => (
  <div className="h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500">
    <div className="text-center p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <p>Welcome to the Inventory Management Portal</p>
      <button className="btn btn-secondary mt-4" onClick={logout}>Logout</button>
    </div>
  </div>
);

export default Dashboard;
