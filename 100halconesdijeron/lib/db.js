// lib/db.js
import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: 'localhost',
  user: 'root', 
  password: '1234567890', 
  database: 'halcones' 
});

export default db;
