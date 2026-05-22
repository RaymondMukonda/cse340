import db from './db.js'

const getAllCategories = async () => {
    const query = `
        SELECT category_id, name
        FROM public.category
        ORDER BY name;
    `;
    const result = await db.query(query);
    return result.rows;
}

//  Get single category by ID
const getCategoryById = async (categoryId) => {
    const query = `
        SELECT category_id, name
        FROM public.category
        WHERE category_id = $1;
    `;
    const result = await db.query(query, [categoryId]);
    return result.rows.length > 0 ? result.rows[0] : null;
}

//  Get categories for a given project
const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT c.category_id, c.name
        FROM public.project_category pc
        JOIN public.category c
        ON pc.category_id = c.category_id
        WHERE pc.project_id = $1;
    `;
    const result = await db.query(query, [projectId]);
    return result.rows;
}

// : Get projects for a given category
const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT p.project_id, p.title, p.date, p.location,
               o.name AS organization_name
        FROM public.project p
        JOIN public.organization o
        ON p.organization_id = o.organization_id
        JOIN public.project_category pc
        ON p.project_id = pc.project_id
        WHERE pc.category_id = $1
        ORDER BY p.date;
    `;
    const result = await db.query(query, [categoryId]);
    return result.rows;
}

export { 
    getAllCategories, 
    getCategoryById, 
    getCategoriesByProjectId, 
    getProjectsByCategoryId 
}

