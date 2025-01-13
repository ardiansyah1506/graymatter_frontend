import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductList from '../components/ProductList';
import { API_URL } from '../config';
import Modal from '../components/Modal';
import Notification from '../components/Notification';

const Dashboard = ({ setIsAuthenticated }) => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch(`${API_URL}/categories`);
      const data = await res.json();
      setCategories(data);
    };

    const fetchProducts = async () => {
      const res = await fetch(`${API_URL}/products`);
      const data = await res.json();
      setProducts(data);
    };

    fetchCategories();
    fetchProducts();
  }, []);

  const handleCategoryChange = async (categoryId) => {
    setSelectedCategory(categoryId);
    const res = await fetch(`${API_URL}/products?category_id=${categoryId}`);
    const data = await res.json();
    setProducts(data);
  };

  const handleAddProduct = async (newProduct) => {
    const res = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(newProduct),
    });

    if (res.status === 201) {
      setNotification('Product added successfully');
      setShowAddModal(false);
      // Refresh products after adding
      const updatedProducts = await fetch(`${API_URL}/products`);
      const data = await updatedProducts.json();
      setProducts(data);
    } else {
      setNotification('Failed to add product');
    }
  };

  const handleEditProduct = async (product) => {
    setEditProduct(product);
    setShowEditModal(true);
  };

  const handleUpdateProduct = async (updatedProduct) => {
    const res = await fetch(`${API_URL}/products/${updatedProduct._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(updatedProduct),
    });

    if (res.status === 200) {
      setNotification('Product updated successfully');
      setShowEditModal(false);
      // Update the product in the state
      setProducts(products.map((product) =>
        product._id === updatedProduct._id ? updatedProduct : product
      ));
    } else {
      setNotification('Failed to update product');
    }
  };

  const handleDeleteProduct = async () => {
    const res = await fetch(`${API_URL}/products/${deleteProduct._id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (res.status === 200) {
      setNotification('Product deleted successfully');
      setShowDeleteModal(false);
      // Remove the deleted product from the state
      setProducts(products.filter((product) => product._id !== deleteProduct._id));
    } else {
      setNotification('Failed to delete product');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    setIsAuthenticated(false);
    navigate('/login'); // Navigate to login page
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {notification && <Notification message={notification} />}
      <div className="container mx-auto py-10">
        <h1 className="text-4xl font-bold mb-10 text-center">Dashboard</h1>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white p-2 rounded-md absolute top-4 right-4"
        >
          Logout
        </button>

        <div className="mt-6">
          <ProductList
            products={products}
            onEdit={handleEditProduct}
            onDelete={(product) => {
              setDeleteProduct(product);
              setShowDeleteModal(true);
            }}
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-6 bg-blue-500 text-white p-2 rounded-md"
        >
          Add Product
        </button>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <Modal
          title="Add Product"
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddProduct}
        />
      )}

      {/* Edit Product Modal */}
      {showEditModal && (
        <Modal
          title="Edit Product"
          onClose={() => setShowEditModal(false)}
          onSubmit={handleUpdateProduct}
          initialValues={editProduct}
        />
      )}

      {/* Delete Product Confirmation */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-medium mb-4">Are you sure you want to delete this product?</h3>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-500 text-white p-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                className="bg-red-500 text-white p-2 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
