const CategoryList = ({ categories, onDelete }) => {
  return (
    <div className="container mx-auto my-10">
      <h2 className="text-3xl font-semibold mb-6">Category List</h2>
      <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="text-white border-b">
              <th className="px-4 py-2 text-left">Category Name</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id} className="border-b text-white">
                <td className="px-4 py-2">{category.name}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => {
                      console.log(category); // Tambahkan log di sini
                      onDelete(category);
                    }}
                    className="bg-red-500 text-white p-2 rounded-md"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryList;
