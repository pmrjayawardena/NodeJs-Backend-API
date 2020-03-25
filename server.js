const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const users = require('./routes/users');
const reviews = require('./routes/reviews');
const auth = require('./routes/auth');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const hpp = require('hpp');

const cors = require('cors');
//Load env file
dotenv.config({ path: './config/config.env' });

//connect to database
connectDB();

//Route files

const app = express();

//Cookie parser

app.use(cookieParser());

//Body Parser

app.use(express.json());

//dev logging middleware

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//file uploading

app.use(fileupload());

//sanatize data

app.use(mongoSanitize());
//set security headers

app.use(helmet());

//prevent cross site scripting tags

app.use(xss());
//Set Static folder

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

//  apply to all requests
app.use(limiter);

app.use(hpp());

// enable cors
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));
//mount routers

app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`server running in ${PORT}`.yellow.bold)
);

//Handle unhandled promise rejections

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);

  server.close(() => {
    process.exit(1);
  });
});
