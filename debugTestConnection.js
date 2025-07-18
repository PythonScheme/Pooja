// Debug version to check environment variables
const path = require('path');
const fs = require('fs');

console.log('Current working directory:', process.cwd());
console.log('__dirname:', __dirname);

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
console.log('Looking for .env at:', envPath);
console.log('.env file exists:', fs.existsSync(envPath));

if (fs.existsSync(envPath)) {
  console.log('.env file content:');
  console.log(fs.readFileSync(envPath, 'utf8'));
}

// Load dotenv
console.log('\nLoading dotenv...');
const result = require('dotenv').config();
console.log('Dotenv result:', result);

console.log('\nEnvironment variables:');
console.log('PGHOST:', process.env.PGHOST);
console.log('PGDATABASE:', process.env.PGDATABASE);
console.log('PGUSER:', process.env.PGUSER);
console.log('PGPASSWORD:', process.env.PGPASSWORD ? '[HIDDEN]' : 'undefined');

// Only test connection if we have the variables
if (process.env.PGHOST && process.env.PGDATABASE && process.env.PGUSER && process.env.PGPASSWORD) {
  console.log('\n✅ All environment variables found, testing connection...');
  
  require('pg');
  const Sequelize = require('sequelize');

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
} else {
  console.log('\n❌ Missing environment variables - cannot test connection');
}