import { 
    getAllCategories, 
    getCategoryById, 
    getProjectsByCategoryId, 
    getCategoriesByProjectId, 
    updateCategoryAssignments 
} from '../models/categories.js';

import { getProjectDetails } from '../models/projects.js';


const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';
    res.render('categories', { title, categories });
};

// Controller for category details page
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

// NEW: Show assign categories form
const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;

    const projectDetails = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByProjectId(projectId);

    const title = 'Assign Categories to Project';

    res.render('assign-categories', { 
        title, 
        projectId, 
        projectDetails, 
        categories, 
        assignedCategories, 
        messages: req.flash() 
    });
};

// NEW: Process assign categories form
const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categoryIds || [];

    // Ensure selectedCategoryIds is an array
    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];

    try {
        await updateCategoryAssignments(projectId, categoryIdsArray);
        req.flash('success', 'Categories updated successfully.');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error updating categories:', error);
        req.flash('error', 'There was an error updating categories.');
        res.redirect(`/project/${projectId}/assign-categories`);
    }
};

export { 
    showCategoriesPage, 
    showCategoryDetailsPage, 
    showAssignCategoriesForm, 
    processAssignCategoriesForm 
};
