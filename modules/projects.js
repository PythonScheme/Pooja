const projectData = require("../data/projectData");
const sectorData = require("../data/sectorData");
let projects = [];
function initialize() {
  return new Promise((resolve, reject) => {
    try {
      projects = [];

      projectData.forEach(project => {
        const sector = sectorData.find(sec => sec.id === project.sector_id);
        const projectWithSector = {
          ...project,
          sector: sector ? sector.sector_name : "Unknown"
        };

        projects.push(projectWithSector);
      });

      console.log("Sectors found in projects:", [...new Set(projects.map(p => p.sector))]); // <--- add this

      resolve();
    } catch (err) {
      reject("Failed to initialize project data.");
    }
  });
}


function getAllProjects() {
  return new Promise((resolve, reject) => {
    if (projects.length > 0) {
      resolve(projects);
    } else {
      reject("No projects available.");
    }
  });
}

function getProjectById(projectId) {
  return new Promise((resolve, reject) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      resolve(project);
    } else {
      reject(`Project with ID ${projectId} not found.`);
    }
  });
}

function getProjectsBySector(sector) {
  return new Promise((resolve, reject) => {
    const matchedProjects = projects.filter(p =>
      p.sector.toLowerCase().includes(sector.toLowerCase())
    );

    if (matchedProjects.length > 0) {
      resolve(matchedProjects);
    } else {
      reject(`No projects found in sector: ${sector}`);
    }
  });
}

module.exports = {
  initialize,
  getAllProjects,
  getProjectById,
  getProjectsBySector
};

