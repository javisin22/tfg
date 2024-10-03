const express = require('express');

const app = express();


// Middleware
app.use(express.json()); // Parse incoming JSON data

// Routes
const usersRouter = require('./routes/users');

app.use('/users', usersRouter);

app.get('/', (req, res) => {
    res.send('Hello World');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
