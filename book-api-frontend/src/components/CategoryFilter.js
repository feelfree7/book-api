import React from 'react';

const CategoryFilter = ({ selectedCategory, onSelectCategory }) => {
    const categories = ['Visos kategorijos', 'Klasika', 'Poezija', 'Asmenybės tobulėjimas', 'Verslas', 'Biografija'];

    return (
    <div className="category-filter">
    <label htmlFor="category">Kategorija:</label>
        <select
             id="category"
                value={selectedCategory}
                 onChange={(e) => onSelectCategory(e.target.value)}
            >
            {categories.map((category) => (
                   <option key={category} value={category}>
                        {category}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default CategoryFilter;