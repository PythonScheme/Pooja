// Manual test without .env file
require('pg');
const Sequelize = require('sequelize');

// Manually set the database credentials
const dbConfig = {
  host: 'ep-weathered-tooth-aehtw7la-pooler.c-2.us-east-2.aws.neon.tech',
  database: 'neondb',
  user: 'neondb_owner',
  password: 'npg_Hy5vDVATwx8Q'
};

console.log('Testing database connection with manual credentials...');
console.log('Host:', dbConfig.host);
console.log('Database:', dbConfig.database);
console.log('User:', dbConfig.user);

let sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.user,
  dbConfig.password,
  {
    host: dbConfig.host,
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