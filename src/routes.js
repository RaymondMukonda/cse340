import express from 'express';
import { showHomePage } from './controllers/index.js';

import { showProjectsPage, showProjectDetailsPage } from './controllers/projects.js';

import { showCategoriesPage, showCategoryDetailsPage } from './controllers/categories.js';

import { testErrorPage } from './controllers/errors.js';

import { 
    showNewOrganizationForm, 
    processNewOrganizationForm, 
    organizationValidation,
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showEditOrganizationForm,
    processEditOrganizationForm } from './controllers/organizations.js';





const router = express.Router();

// Main routes
router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);

// Error test route
router.get('/test-error', testErrorPage);

// Organization details
router.get('/organization/:id', showOrganizationDetailsPage);

// Project details
router.get('/project/:id', showProjectDetailsPage);

// NEW: Category details
router.get('/category/:id', showCategoryDetailsPage);

// Route for new organization page
router.get('/new-organization', showNewOrganizationForm);

// Route to handle new organization form submission
router.post('/new-organization', organizationValidation , processNewOrganizationForm);

// Route to display the edit organization form
router.get('/edit-organization/:id', showEditOrganizationForm);

// Route to handle the edit organization form submission
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);

export default router;

