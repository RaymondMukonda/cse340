import express from 'express';
import { showHomePage } from './controllers/index.js';

import { 
    showProjectsPage, 
    showProjectDetailsPage, 
    showNewProjectForm, 
    processNewProjectForm, 
    projectValidation,
    showEditProjectForm,
    processEditProjectForm
} from './controllers/projects.js';

import { 
    showCategoriesPage, 
    showCategoryDetailsPage, 
    showAssignCategoriesForm, 
    processAssignCategoriesForm,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm
} from './controllers/categories.js';

import { testErrorPage } from './controllers/errors.js';

import { 
    showNewOrganizationForm, 
    processNewOrganizationForm, 
    organizationValidation,
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showEditOrganizationForm,
    processEditOrganizationForm 
} from './controllers/organizations.js';

import {
  showUserRegistrationForm,
  processUserRegistrationForm,
  showLoginForm,
  processLoginForm,
  processLogout,
  requireLogin,
  requireRole,
  showDashboard,
  showUsersPage
} from './controllers/users.js';

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

// Category details
router.get('/category/:id', showCategoryDetailsPage);

// NEW: Routes for new category
router.get('/new-category', showNewCategoryForm);
router.post('/new-category', processNewCategoryForm);

// NEW: Routes for edit category
router.get('/edit-category/:id', showEditCategoryForm);
router.post('/edit-category/:id', processEditCategoryForm);

// Routes for new organization
router.get('/new-organization', showNewOrganizationForm);
router.post('/new-organization', organizationValidation , processNewOrganizationForm);

// Routes for edit organization
router.get('/edit-organization/:id', showEditOrganizationForm);
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);

// Routes for new project
router.get('/new-project', showNewProjectForm);
router.post('/new-project', projectValidation, processNewProjectForm);

// Routes to assign categories to a project
router.get('/project/:projectId/assign-categories', showAssignCategoriesForm);
router.post('/project/:projectId/assign-categories', processAssignCategoriesForm);

// Routes to edit a project
router.get('/edit-project/:id', showEditProjectForm);
router.post('/edit-project/:id', projectValidation, processEditProjectForm);

// User registration routes
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);

// User login routes
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);

// Protected dashboard route
router.get('/dashboard', requireLogin, showDashboard);

// NEW: Protected users page (admin only)
router.get('/users', requireRole('admin'), showUsersPage);

export default router;
