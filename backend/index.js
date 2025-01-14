import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import testCaseRoutes from './routes/testcases.routes.js';
import userRoutes from './routes/user.routes.js';
import problemRoutes from './routes/problem.routes.js';
import runcodeRoutes from './routes/runcode.routes.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();

// Enable CORS for all origins with credentials
app.use(cors({
    origin: 'http://localhost:5173', // Frontend URL
    credentials: true, // Allow cookies to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
}));

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.URI).then(() => {
    console.log("Connected successfully");

    // Session middleware setup
    app.use(session({
        secret: process.env.SESSION_SECRET || 'your-secret-key', // Secret key for session encryption
        resave: false, // Avoid resaving unchanged sessions
        saveUninitialized: false, // Do not save empty sessions
        store: MongoStore.create({
            mongoUrl: process.env.URI, // Your MongoDB connection string
            collectionName: 'sessions', // Optional: specify a collection name
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, // 1 day (in milliseconds)
            httpOnly: true, // Prevent client-side access to cookies
            secure: process.env.NODE_ENV === 'production', // Only use secure cookies in production
            sameSite: 'Lax', // Allow cookies across domains
        },
    }));

    // Register routes
    app.use('/testcases', testCaseRoutes);
    app.use('/user', userRoutes);
    app.use('/problems', problemRoutes);
    app.use('/runcode', runcodeRoutes);

    // Start the server
    app.listen(process.env.PORT || 8000, (error) => {
        if (error) console.log(error);
        console.log("Running Successfully at: http://localhost:5000");
    });

    // Test session route
    app.get('/', (req, res) => {
        console.log(req.session);
        console.log(req.session.id);
        req.session.visited = true;
        res.status(201).send({ msg: "hello", sessionId: req.session.id });
    });
})
.catch((error) => {
    console.log("Error occurred: ", error);
});