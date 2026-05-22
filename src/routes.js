import express from 'express';
import { showHomePage } from './controllers/index.js';
import { showOrganizationsPage, showOrganizationDetailsPage } from './controllers/organizations.js';
import { showProjectsPage, showProjectDetailsPage } from './controllers/projects.js';
import { showCategoriesPage, showCategoryDetailsPage } from './controllers/categories.js';
import { testErrorPage } from './controllers/errors.js';

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

export default router;

