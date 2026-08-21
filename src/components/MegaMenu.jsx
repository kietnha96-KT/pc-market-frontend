import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCategoryStore } from '../store/useCategoryStore';

const MegaMenu = () => {
    
    const categories = useCategoryStore((state) => state.categories);
    const fetchCategories = useCategoryStore((state) => state.fetchCategories);

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <ul className="menu-doc">
            {categories.map((category) => (
                <li key={category.id}>
                    <Link to={`/products?category=${category.slug}`}>
                        <i className={`fa-solid ${category.icon || ''}`}></i> {category.name}
                    </Link>

                    <div className="menu-ngang">
                        <div className="box-menu">
                            <ul className="box-item">
                                <li>
                                    <p>{category.name}</p>
                                </li>

                                {/* Danh mục con */}
                                {category.children?.map((child) => (
                                    <li key={child.id}>
                                        <Link to={`/products?category=${child.slug}`}>
                                            {child.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                </li>
            ))}
        </ul>
    );
};

export default MegaMenu;