import db from './db.js'

// Existing functions
const getAllProjects = async () => {
    const query = `
        SELECT p.project_id, p.title, p.description, p.location, p.date,
            o.name AS organization_name
        FROM public.project p
        JOIN public.organization o
        ON p.organization_id = o.organization_id
        ORDER BY p.date;
    `;
    const result = await db.query(query);
    return result.rows;
}

const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT
            project_id,
            organization_id,
            title,
            description,
            location,
            date
        FROM public.project
        WHERE organization_id = $1
        ORDER BY date;
    `;
    const queryParams = [organizationId];
    const result = await db.query(query, queryParams);

    return result.rows;
}

//  Get upcoming projects (limit by number_of_projects)
const getUpcomingProjects = async (number_of_projects) => {
    const query = `
        SELECT p.project_id, p.title, p.description, p.location, p.date,
               p.organization_id, o.name AS organization_name
        FROM public.project p
        JOIN public.organization o
        ON p.organization_id = o.organization_id
        WHERE p.date >= CURRENT_DATE
        ORDER BY p.date ASC
        LIMIT $1;
    `;
    const queryParams = [number_of_projects];
    const result = await db.query(query, queryParams);
    return result.rows;
}

//  Get details for a single project
const getProjectDetails = async (projectId) => {
    const query = `
        SELECT p.project_id, p.title, p.description, p.location, p.date,
               p.organization_id, o.name AS organization_name
        FROM public.project p
        JOIN public.organization o
        ON p.organization_id = o.organization_id
        WHERE p.project_id = $1;
    `;
    const queryParams = [projectId];
    const result = await db.query(query, queryParams);
    return result.rows.length > 0 ? result.rows[0] : null;
}

// Export all functions
export { 
    getAllProjects, 
    getProjectsByOrganizationId, 
    getUpcomingProjects, 
    getProjectDetails 
}

