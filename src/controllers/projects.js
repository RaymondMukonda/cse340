import { getAllProjects } from '../models/projects.js';

// Define controller function
const showProjectsPage = async (req, res) => {
  const projects = await getAllProjects();
  const title = 'Service Projects';
  res.render('projects', { title, projects });
};

// Export controller function
export { showProjectsPage };
