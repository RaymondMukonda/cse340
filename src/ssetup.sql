CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');


Select * From organization;


CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL REFERENCES organization(organization_id),
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL
);


INSERT INTO project (organization_id, title, description, location, date)
VALUES
(1, 'Park Cleanup', 'Join us to clean up local parks and make them beautiful!', 'Central Park', '2026-06-01'),
(1, 'Community Tutoring', 'Volunteer to tutor students in various subjects.', 'Community Center', '2026-06-10'),
(2, 'Food Drive', 'Help collect and distribute food to those in need.', 'Town Hall', '2026-06-05'),
(2, 'Urban Garden Build', 'Assist in building sustainable gardens.', 'GreenHarvest Plot', '2026-06-12'),
(3, 'Charity Run', 'Support local charities with a fundraising run.', 'City Stadium', '2026-06-20');

Select * From project;


CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL
);


CREATE TABLE project_category (
    project_id INT NOT NULL REFERENCES project(project_id),
    category_id INT NOT NULL REFERENCES category(category_id),
    PRIMARY KEY (project_id, category_id)
);


INSERT INTO category (name)
VALUES
('Environmental'),
('Educational'),
('Community Service'),
('Health and Wellness');


INSERT INTO project_category (project_id, category_id)
VALUES --rember the pais as you made this 
(1, 1), -- Park Cleanup → Environmental
(2, 2), -- Community Tutoring → Educational
(3, 3), -- Food Drive → Community Service
(4, 1), -- Urban Garden Build → Environmental
(5, 4); -- Charity Run → Health and Wellness

Select * From category;