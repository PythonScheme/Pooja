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
      ssl: { 
        require: true,
        rejectUnauthorized: false 
      }
    },
    query: { raw: true }
  }
);

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection successful!');
    console.log('Connected to:', process.env.PGDATABASE);
    console.log('Host:', process.env.PGHOST);
    console.log('User:', process.env.PGUSER);
    
    await sequelize.close();
    console.log('✅ Connection closed successfully');
    
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
}

testConnection();