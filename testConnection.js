require('dotenv').config();

require('pg');
const Sequelize = require('sequelize');

console.log('Testing database connection...');
console.log('Host:', process.env.PGHOST);
console.log('Database:', process.env.PGDATABASE);
console.log('User:', process.env.PGUSER);

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
    
    await sequelize.close();
    console.log('✅ Connection closed successfully');
    
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
  }
}

testConnection();