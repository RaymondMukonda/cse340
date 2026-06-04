import { 
    getAllCategories, 
    getCategoryById, 
    getProjectsByCategoryId, 
    getCategoriesByProjectId, 
    updateCategoryAssignments,
    createCategory,
    updateCategory
} from '../models/categories.js';

import { getProjectDetails } from '../models/projects.js';

// Show all categories
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';
    res.render('categories', { title, categories });
};

// Show category details page
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

// Show assign categories form
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

// Process assign categories form
const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categoryIds || [];

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

// NEW: Show create category form
const showNewCategoryForm = (req, res) => {
    const title = 'Create New Category';
    res.render('new-category', { title, messages: req.flash() });
};

// NEW: Process create category form
const processNewCategoryForm = async (req, res) => {
    const { name } = req.body;

    // Server-side validation
    if (!name || name.length < 3 || name.length > 100) {
        req.flash('error', 'Category name must be between 3 and 100 characters.');
        return res.redirect('/new-category');
    }

    try {
        await createCategory(name);
        req.flash('success', 'Category created successfully.');
        res.redirect('/categories');
    } catch (error) {
        console.error('Error creating category:', error);
        req.flash('error', 'There was an error creating the category.');
        res.redirect('/new-category');
    }
};

// NEW: Show edit category form
const showEditCategoryForm = async (req, res) => {
    const categoryId = req.params.id;
    const category = await getCategoryById(categoryId);

    if (!category) {
        req.flash('error', 'Category not found.');
        return res.redirect('/categories');
    }

    const title = 'Edit Category';
    res.render('edit-category', { title, category, messages: req.flash() });
};

// NEW: Process edit category form
const processEditCategoryForm = async (req, res) => {
    const categoryId = req.params.id;
    const { name } = req.body;

    // Server-side validation
    if (!name || name.length < 3 || name.length > 100) {
        req.flash('error', 'Category name must be between 3 and 100 characters.');
        return res.redirect(`/edit-category/${categoryId}`);
    }

    try {
        await updateCategory(categoryId, name);
        req.flash('success', 'Category updated successfully.');
        res.redirect(`/category/${categoryId}`);
    } catch (error) {
        console.error('Error updating category:', error);
        req.flash('error', 'There was an error updating the category.');
        res.redirect(`/edit-category/${categoryId}`);
    }
};

export { 
    showCategoriesPage, 
    showCategoryDetailsPage, 
    showAssignCategoriesForm, 
    processAssignCategoriesForm,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm
};
