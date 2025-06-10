// lib/db.js
import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: 'localhost',
  user: 'root', 
  password: 'P@ssw0rd1704', 
  database: 'halcones' 
});

export default db;
