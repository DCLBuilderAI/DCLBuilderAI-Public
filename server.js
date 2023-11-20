const dotenv = require('dotenv');
const app = require('./app');
const connectDB = require('./db');

dotenv.config({ path: './config.env' });

connectDB();

const port = process.env.PORT || 8000

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
