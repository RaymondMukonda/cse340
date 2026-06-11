import { 
  getUpcomingProjects, 
  getProjectDetails, 
  createProject, 
  updateProject,
  addVolunteer,
  removeVolunteer,
  getUserVolunteers
} from '../models/projects.js';

import { getCategoriesByProjectId } from '../models/categories.js';
import { getAllOrganizations } from '../models/organizations.js';
import { body, validationResult } from 'express-validator';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Projects page
const showProjectsPage = async (req, res) => {
  const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
  const title = 'Upcoming Service Projects';
  res.render('projects', { title, projects });
};

// Project details page
const showProjectDetailsPage = async (req, res) => {
  const projectId = req.params.id;
  const project = await getProjectDetails(projectId);
  const categories = await getCategoriesByProjectId(projectId);

  if (!project) {
    return res.status(404).send('Project not found');
  }

  let isVolunteering = false;
  if (req.session.user) {
    const volunteers = await getUserVolunteers(req.session.user.user_id);
    isVolunteering = volunteers.some(v => v.project_id == projectId);
  }

  const title = project.title;
  res.render('project', { 
    title, 
    project, 
    categories, 
    isVolunteering, 
    user: req.session.user 
  });
};

// Show new project form
const showNewProjectForm = async (req, res) => {
  const organizations = await getAllOrganizations();
  const title = 'Add New Service Project';
  res.render('new-project', { title, organizations, messages: req.flash() });
};

// Validation rules
const projectValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  body('location')
    .trim()
    .notEmpty().withMessage('Location is required')
    .isLength({ max: 200 }).withMessage('Location must be less than 200 characters'),
  body('date')
    .notEmpty().withMessage('Date is required')
    .isISO8601().withMessage('Date must be a valid date format'),
  body('organizationId')
    .notEmpty().withMessage('Organization is required')
    .isInt().withMessage('Organization must be a valid integer')
];

// Process new project form
const processNewProjectForm = async (req, res) => {
  const { title, description, location, date, organizationId } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.array().forEach((error) => {
      req.flash('error', error.msg);
    });
    return res.redirect('/new-project');
  }

  try {
    const newProjectId = await createProject(title, description, location, date, organizationId);
    req.flash('success', 'New service project created successfully!');
    res.redirect(`/project/${newProjectId}`);
  } catch (error) {
    console.error('Error creating new project:', error);
    req.flash('error', 'There was an error creating the service project.');
    res.redirect('/new-project');
  }
};

// Show edit project form
const showEditProjectForm = async (req, res) => {
  const projectId = req.params.id;
  const project = await getProjectDetails(projectId);
  const organizations = await getAllOrganizations();

  if (!project) {
    return res.status(404).send('Project not found');
  }

  const title = 'Edit Service Project';
  res.render('edit-project', { title, project, organizations, messages: req.flash() });
};

// Process edit project form
const processEditProjectForm = async (req, res) => {
  const projectId = req.params.id;
  const { title, description, location, date, organizationId } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.array().forEach((error) => {
      req.flash('error', error.msg);
    });
    return res.redirect(`/edit-project/${projectId}`);
  }

  try {
    await updateProject(projectId, title, description, location, date, organizationId);
    req.flash('success', 'Project updated successfully!');
    res.redirect(`/project/${projectId}`);
  } catch (error) {
    console.error('Error updating project:', error);
    req.flash('error', 'There was an error updating the project.');
    res.redirect(`/edit-project/${projectId}`);
  }
};


  //  Volunteer Controllers


// Add volunteer
const volunteerForProject = async (req, res) => {
  if (!req.session.user) {
    req.flash('error', 'You must be logged in to volunteer.');
    return res.redirect(`/project/${req.params.id}`);
  }

  try {
    await addVolunteer(req.params.id, req.session.user.user_id);
    req.flash('success', 'You are now volunteering for this project!');
    res.redirect(`/project/${req.params.id}`);
  } catch (error) {
    console.error('Error volunteering:', error);
    req.flash('error', 'Could not volunteer for project.');
    res.redirect(`/project/${req.params.id}`);
  }
};

// Remove volunteer
const removeVolunteerFromProject = async (req, res) => {
  if (!req.session.user) {
    req.flash('error', 'You must be logged in to remove volunteering.');
    return res.redirect(`/project/${req.params.id}`);
  }

  try {
    await removeVolunteer(req.params.id, req.session.user.user_id);
    req.flash('success', 'You are no longer volunteering for this project.');
    res.redirect(`/project/${req.params.id}`);
  } catch (error) {
    console.error('Error removing volunteer:', error);
    req.flash('error', 'Could not remove volunteering.');
    res.redirect(`/project/${req.params.id}`);
  }
};

// Show dashboard with volunteered projects
const showDashboard = async (req, res) => {
  if (!req.session.user) {
    req.flash('error', 'You must be logged in to view your dashboard.');
    return res.redirect('/login');
  }

  try {
    const projects = await getUserVolunteers(req.session.user.user_id);
    const title = 'My Dashboard';
    res.render('dashboard', { 
      title, 
      projects, 
      user: req.session.user,   // <-- pass user object
      name: req.session.user.name,  // <-- pass name
      email: req.session.user.email, // <-- pass email
      messages: req.flash() 
    });
  } catch (error) {
    console.error('Error loading dashboard:', error);
    req.flash('error', 'Could not load dashboard.');
    res.redirect('/');
  }
};

export { 
  showProjectsPage, 
  showProjectDetailsPage, 
  showNewProjectForm, 
  processNewProjectForm, 
  projectValidation,
  showEditProjectForm,
  processEditProjectForm,
  volunteerForProject,
  removeVolunteerFromProject,
  showDashboard
};
