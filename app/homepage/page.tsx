import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Subcategory {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
  subcategories: Subcategory[];
}

const HomePage: React.FC = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSubcategories, setFilteredSubcategories] = useState<Subcategory[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories"); // Panggil API baru
        const data: Category[] = await response.json();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setSelectedCategory(value || null);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchClick = () => {
    if (selectedCategory) {
      const category = categories.find((cat) => cat.id === selectedCategory);
      if (category) {
        const filtered = category.subcategories.filter((subcat) =>
          subcat.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredSubcategories(filtered);
      }
    }
  };

  const handleSubcategoryClick = (subcategoryId: number, subcategoryName: string) => {
    router.push(`/subcategory?id=${subcategoryId}&name=${subcategoryName}`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="categoryDropdown">Kategori: </label>
        <select
          id="categoryDropdown"
          onChange={handleCategoryChange}
          value={selectedCategory || ""}
        >
          <option value="">Pilih Kategori</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="searchBox">Nama Subkategori: </label>
        <input
          id="searchBox"
          type="text"
          placeholder="Cari subkategori..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button onClick={handleSearchClick}>Cari</button>
      </div>

      <div>
        {selectedCategory && (
          <div>
            <h3>{categories.find((cat) => cat.id === selectedCategory)?.name}</h3>
            <ul>
              {filteredSubcategories.map((subcat) => (
                <li
                  key={subcat.id}
                  style={{
                    cursor: "pointer",
                    color: "blue",
                    textDecoration: "underline",
                  }}
                  onClick={() => handleSubcategoryClick(subcat.id, subcat.name)}
                >
                  {subcat.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
