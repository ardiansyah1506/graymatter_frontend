// Category.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Notification from '../components/Notification';
import CategoryList from '../components/CategoryList';
import { API_URL } from '../config';
import ModalCategory from '../components/ModalCategory';
import Navbar from '../components/Navbar';

const Category = ({ setIsAuthenticated }) => {
  const [categories, setCategories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCategory, setDeleteCategory] = useState(null);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/categories`);
        const data = await res.json();
        console.log(data)
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleAddCategory = async (newCategory) => {
    try {
        console.log('New category:', newCategory);

        const res = await fetch(`${API_URL}/categories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
                name: newCategory.name, // Kirimkan hanya nama
            }),
        });

        if (res.status === 201) {
            const updatedCategory = await res.json();
            setCategories((prev) => [...prev, updatedCategory]);
            setNotification('Category added successfully');
            setShowAddModal(false);
        } else {
            const errorResponse = await res.json();
            setNotification(`Failed to add category: ${errorResponse.message}`);
        }
    } catch (error) {
        console.error('Error adding category:', error);
    }
};


  const handleDeleteCategory = async () => {
    console.log(deleteCategory); // Pastikan deleteCategory memiliki id
    if (!deleteCategory || !deleteCategory._id) {
      setNotification('Invalid category to delete');
      return;
    }
  
    try {
      const res = await fetch(`${API_URL}/categories/${deleteCategory._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      if (res.status === 200) {
        setCategories((prev) =>
          prev.filter((category) => category.id !== deleteCategory.id)
        );
        setNotification('Category deleted successfully');
        setShowDeleteModal(false);
      } else {
        setNotification('Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
            <Navbar handleLogout={handleLogout} />
            {notification && <Notification message={notification} />}
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center">

        <h1 className="text-4xl font-bold mb-10 text-center">Manage Categories</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-6 bg-blue-500 text-white p-2 rounded-md"
        >
          Add Category
        </button>
        </div>
        <CategoryList
          categories={categories}
          onDelete={(category) => {
            setDeleteCategory(category);
            setShowDeleteModal(true);
          }}
        />
       
      </div>

      {showAddModal && (
        <ModalCategory
          title="Add Category"
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddCategory}
        />
      )}

      {showEditModal && (
        <ModalCategory
          title="Edit Category"
          onClose={() => setShowEditModal(false)}
          onSubmit={() => {}}
          initialValues={editCategory}
        />
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-medium mb-4">
              Are you sure you want to delete this category?
            </h3>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-500 text-white p-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCategory}
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

export default Category;
