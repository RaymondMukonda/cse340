import { 
    getAllCategories, 
    getCategoryById, 
    getProjectsByCategoryId 
} from '../models/categories.js';

// Existing controller
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';
    res.render('categories', { title, categories });
};

// NEW: Controller for category details page
const showCategoryDetailsPage = async (req, res) => {
    const categoryId = req.params.id;
    const category = await getCategoryById(categoryId);
    const projects = await getProjectsByCategoryId(categoryId);

    if (!category) {
        return res.status(404).send('Category not found');
    }

    const title = category.name;
    res.render('category', { title, category, projects });
};

export { showCategoriesPage, showCategoryDetailsPage };
