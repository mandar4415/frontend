import React, { useEffect, useState } from 'react';

interface InventoryItem {
  _id: string;
  name: string;
  category: string;
  purchaseDate: string;
  serialNumber: string;
}

interface MaintenanceRecord {
  serviceType: string;
  dateOfService: string;
  cost: number;
}

const Inventory: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [maintenanceHistory, setMaintenanceHistory] = useState<MaintenanceRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isMaintenanceTabVisible, setMaintenanceTabVisible] = useState(false);

  // Fetch items from the API
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Unauthorized access. Please log in again.');
        return;
      }

      const response = await fetch('https://inventory-backend-2z0a.onrender.com/api/items/view', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }

      const data = await response.json();
      console.log('Fetched items:', data); // Log the entire response

      if (Array.isArray(data.items)) {
        setItems(data.items); // Use `data.items` instead of `data` directly
      } else {
        console.error('Expected an array inside "items", but got:', data.items);
        setItems([]);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      setError('An error occurred while fetching items.');
    }
  };

  const fetchMaintenanceHistory = async (itemId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch(`https://inventory-backend-2z0a.onrender.com/api/maintenance/view?itemId=${itemId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch maintenance history');
      }

      const data = await response.json();
      setMaintenanceHistory(data); // assuming data is an array of maintenance records for the selected item
    } catch (error) {
      console.error('Error fetching maintenance history:', error);
      setError('An error occurred while fetching maintenance history.');
    }
  };

  const handleViewMaintenance = (itemId: string) => {
    setSelectedItemId(itemId);
    setMaintenanceTabVisible(true);
    fetchMaintenanceHistory(itemId); // Fetch the maintenance history for the selected item
  };

  const handleCloseTab = () => {
    setMaintenanceTabVisible(false);
    setSelectedItemId(null);
  };

  const handleSubmitMaintenance = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const serviceType = (form.elements.namedItem('serviceType') as HTMLInputElement).value;
    const dateOfService = new Date((form.elements.namedItem('dateOfService') as HTMLInputElement).value).toISOString();
    const cost = parseFloat((form.elements.namedItem('cost') as HTMLInputElement).value);

    addMaintenanceRecord({ serviceType, dateOfService, cost });
    form.reset();
  };

  const addMaintenanceRecord = async (newMaintenance: Omit<MaintenanceRecord, 'itemId'>) => {
    if (!selectedItemId) return;

    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const response = await fetch('https://inventory-backend-2z0a.onrender.com/api/maintenance/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newMaintenance,
          itemId: selectedItemId, // Include selected item ID
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add maintenance record');
      }

      fetchMaintenanceHistory(selectedItemId); // Refresh maintenance history after adding new record
    } catch (error) {
      console.error('Error adding maintenance record:', error);
      setError('An error occurred while adding maintenance record.');
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    const newItem: Omit<InventoryItem, '_id'> = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      category: (form.elements.namedItem('category') as HTMLSelectElement).value,
      purchaseDate: new Date((form.elements.namedItem('purchaseDate') as HTMLInputElement).value).toISOString(),
      serialNumber: (form.elements.namedItem('serialNumber') as HTMLInputElement).value,
    };

    addItem(newItem);
    form.reset(); // Reset the form after submission
  };

  const addItem = async (newItem: Omit<InventoryItem, '_id'>) => {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    try {
      const response = await fetch('https://inventory-backend-2z0a.onrender.com/api/items/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });

      if (!response.ok) {
        throw new Error('Failed to add item');
      }

      const addedItem = await response.json();
      console.log('Added item:', addedItem);
      fetchItems(); // Refresh the item list after adding a new item
    } catch (error) {
      console.error('Error adding item:', error);
      setError('An error occurred while adding the item.');
    }
  };

  const deleteItem = async (itemId: string) => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const response = await fetch(`https://inventory-backend-2z0a.onrender.com/api/items/delete/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      fetchItems(); // Refresh the item list after deleting
    } catch (error) {
      console.error('Error deleting item:', error);
      setError('An error occurred while deleting the item.');
    }
  };

  return (
    <div className="bg-black text-white p-8 min-h-screen">
      {error && <p className="text-red-500">{error}</p>}

      <div className="text-center">
        <h1 className="text-4xl font-semibold text-blue-400 mb-8">Inventory Items</h1>
      </div>

      {/* Loading state or empty state message */}
      {items.length === 0 ? (
        <p className="text-gray-400 text-center">No items found. Please add some items.</p>
      ) : (
        <div className="w-[600px] mx-auto space-y-6">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-gray-700 bg-opacity-45 text-white p-6 rounded-lg shadow-lg border-4 border-gradient-to-r from-blue-500 to-blue-700 hover:border-blue-600 transition-all"
            >
              <h2 className="text-xl font-semibold text-white mb-2">{item.name}</h2>
              <p className="text-gray-300">Category: {item.category}</p>
              <p className="text-gray-300">Purchase Date: {new Date(item.purchaseDate).toLocaleDateString()}</p>
              <p className="text-gray-300">Serial Number: {item.serialNumber}</p>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => handleViewMaintenance(item._id)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                >
                  View Maintenance
                </button>
                <button
                  onClick={() => deleteItem(item._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                >
                  Delete Item
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Maintenance Tab (dark gray) */}
      {isMaintenanceTabVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center">
          <div className="bg-gray-800 text-white p-8 rounded-lg w-[600px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Maintenance History</h2>
              <button
                onClick={handleCloseTab}
                className="text-red-500 text-xl"
              >
                &#x2716; {/* Close icon */}
              </button>
            </div>
            <table className="min-w-full mb-4">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">Service Type</th>
                  <th className="px-4 py-2 border">Date of Service</th>
                  <th className="px-4 py-2 border">Cost</th>
                </tr>
              </thead>
              <tbody>
                {maintenanceHistory.map((record, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 border">{record.serviceType}</td>
                    <td className="px-4 py-2 border">{new Date(record.dateOfService).toLocaleDateString()}</td>
                    <td className="px-4 py-2 border">${record.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <form onSubmit={handleSubmitMaintenance} className="space-y-4">
              <input
                type="text"
                name="serviceType"
                placeholder="Service Type"
                required
                className="bg-gray-800 border border-gray-700 p-3 rounded w-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                name="dateOfService"
                required
                className="bg-gray-800 border border-gray-700 p-3 rounded w-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                name="cost"
                placeholder="Cost"
                required
                className="bg-gray-800 border border-gray-700 p-3 rounded w-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white p-3 rounded w-full hover:bg-blue-600 transition-colors"
              >
                Add Maintenance
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add New Item Form */}
      <div className="bg-gray-700 bg-opacity-45 p-6 rounded-lg shadow-lg mt-8 w-[600px] mx-auto">
        <h3 className="text-2xl font-semibold text-white mb-4 text-center">Add New Item</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Item Name"
            required
            className="bg-gray-800 border border-gray-700 p-3 rounded w-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="category"
            required
            className="bg-gray-800 border border-gray-700 p-3 rounded w-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Category</option>
            <option value="Furniture">Furniture</option>
            <option value="Electronics">Electronics</option>
            <option value="Books">Books</option>
          </select>
          <input
            type="date"
            name="purchaseDate"
            required
            className="bg-gray-800 border border-gray-700 p-3 rounded w-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="serialNumber"
            placeholder="Serial Number"
            required
            className="bg-gray-800 border border-gray-700 p-3 rounded w-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-3 rounded w-full hover:bg-blue-600 transition-colors"
          >
            Add Item
          </button>
        </form>
      </div>
    </div>
  );
};

export default Inventory;