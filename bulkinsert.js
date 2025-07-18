require('dotenv').config();

require('pg');
const Sequelize = require('sequelize');

// Create sequelize instance
let sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
  }
);

// Import existing data
const projectData = require("./data/projectData");
const sectorData = require("./data/sectorData");

// Define models (same as in projects.js)
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
  timestamps: false
});

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
  timestamps: false
});

Project.belongsTo(Sector, { foreignKey: 'sector_id' });

async function insertData() {
  try {
    // Sync database (create tables)
    await sequelize.sync({ force: true }); // force: true will drop existing tables
    
    console.log("Tables created successfully");

    // Insert sectors first
    await Sector.bulkCreate(sectorData);
    console.log("Sectors inserted successfully");

    // Insert projects
    await Project.bulkCreate(projectData);
    console.log("Projects inserted successfully");

    console.log("Data inserted successfully");
    
    // Close connection
    await sequelize.close();
    
  } catch (error) {
    console.error("Error inserting data:", error);
  }
}

insertData();