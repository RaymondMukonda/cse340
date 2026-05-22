import { getUpcomingProjects, getProjectDetails } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';

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

  const title = project.title;
  res.render('project', { title, project, categories });
};

export { showProjectsPage, showProjectDetailsPage };

