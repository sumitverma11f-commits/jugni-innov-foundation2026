const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'https://jugninnovfoundation.netlify.app/',
    'https://jugninnovadmin.netlify.app/'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const contactRoutes = require('./routes/contactRoutes');
const volunteerRoutes = require('./routes/volunteerRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');


dotenv.config();
connectDB();

app.use(cors({
  origin: [
    'http://localhost:5500',
    'https://jugninnovfoundation.netlify.app/',
    ''
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: true, limit: '20kb' }));

const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many submissions. Please try again later.' }
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Jugni backend is running' });
});

app.use('/api/contact', formLimiter, contactRoutes);
app.use('/api/volunteer', formLimiter, volunteerRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
