require('dotenv').config();

require('pg');
const Sequelize = require('sequelize');

// Create sequelize instance with updated SSL configuration
let sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
      ssl: { 
        require: true,
        rejectUnauthorized: false 
      }
    },
    query: { raw: true }
  }
);

// Define Sector model
const Sector = sequelize.define('Sector', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  sector_name: {
    type: Sequelize.STRING
  }
}, {
  timestamps: false // Disable createdAt and updatedAt
});

// Define Project model
const Project = sequelize.define('Project', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: Sequelize.STRING
  },
  feature_img_url: {
    type: Sequelize.STRING
  },
  summary_short: {
    type: Sequelize.TEXT
  },
  intro_short: {
    type: Sequelize.TEXT
  },
  impact: {
    type: Sequelize.TEXT
  },
  original_source_url: {
    type: Sequelize.STRING
  }
}, {
  timestamps: false // Disable createdAt and updatedAt
});

// Create association
Project.belongsTo(Sector, { foreignKey: 'sector_id' });

function initialize() {
  return new Promise((resolve, reject) => {
    sequelize.sync()
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function getAllProjects() {
  return new Promise((resolve, reject) => {
    Project.findAll({
      include: [Sector]
    })
      .then((projects) => {
        resolve(projects);
      })
      .catch((err) => {
        reject("Unable to retrieve projects");
      });
  });
}

function getProjectById(projectId) {
  return new Promise((resolve, reject) => {
    Project.findAll({
      include: [Sector],
      where: { id: projectId }
    })
      .then((projects) => {
        if (projects.length > 0) {
          resolve(projects[0]); // Return the first element
        } else {
          reject("Unable to find requested project");
        }
      })
      .catch((err) => {
        reject("Unable to find requested project");
      });
  });
}

function getProjectsBySector(sector) {
  return new Promise((resolve, reject) => {
    Project.findAll({
      include: [Sector],
      where: {
        '$Sector.sector_name$': {
          [Sequelize.Op.iLike]: `%${sector}%`
        }
      }
    })
      .then((projects) => {
        if (projects.length > 0) {
          resolve(projects);
        } else {
          reject("Unable to find requested projects");
        }
      })
      .catch((err) => {
        reject("Unable to find requested projects");
      });
  });
}

function addProject(projectData) {
  return new Promise((resolve, reject) => {
    Project.create(projectData)
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err.errors[0].message);
      });
  });
}

function getAllSectors() {
  return new Promise((resolve, reject) => {
    Sector.findAll()
      .then((sectors) => {
        resolve(sectors);
      })
      .catch((err) => {
        reject("Unable to retrieve sectors");
      });
  });
}

function editProject(id, projectData) {
  return new Promise((resolve, reject) => {
    Project.update(projectData, {
      where: { id: id }
    })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err.errors[0].message);
      });
  });
}

function deleteProject(id) {
  return new Promise((resolve, reject) => {
    Project.destroy({
      where: { id: id }
    })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err.errors[0].message);
      });
  });
}

module.exports = {
  initialize,
  getAllProjects,
  getProjectById,
  getProjectsBySector,
  addProject,
  getAllSectors,
  editProject,
  deleteProject
};
