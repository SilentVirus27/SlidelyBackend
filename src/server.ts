import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';

const app = express();
const PORT = 3000;
const dbFilePath = 'db.json';

interface Submission {
    name: string;
    email: string;
    phone: string;
    github_link: string;
    stopwatch_time: string;
}

// Middleware
app.use(bodyParser.json());

// Ensure db.json file exists
if (!fs.existsSync(dbFilePath)) {
    fs.writeFileSync(dbFilePath, '[]', 'utf8');
    console.log(`Created empty db.json at ${dbFilePath}`);
}

// Routes
app.get('/ping', (req: Request, res: Response) => {
    res.json(true);
});

app.post('/submit', (req: Request, res: Response) => {
    const { name, email, phone, github_link, stopwatch_time } = req.body;
    const submission: Submission = { name, email, phone, github_link, stopwatch_time };

    // Load existing submissions from JSON file
    let submissions: Submission[] = [];
    try {
        const data = fs.readFileSync(dbFilePath, 'utf8');
        submissions = JSON.parse(data);
    } catch (error) {
        console.error('Error reading db.json:', error);
    }

    // Add new submission
    submissions.push(submission);

    // Write updated submissions back to JSON file
    fs.writeFile(dbFilePath, JSON.stringify(submissions), (err) => {
        if (err) {
            console.error('Error writing to db.json:', err);
            res.status(500).json({ message: 'Error saving submission.' });
        } else {
            res.json({ message: 'Submission successful!' });
        }
    });
});

app.get('/read', (req: Request, res: Response) => {
    const index = Number(req.query.index);
    let submissions: Submission[] = [];
    
    try {
        const data = fs.readFileSync(dbFilePath, 'utf8');
        submissions = JSON.parse(data);
    } catch (error) {
        console.error('Error reading db.json:', error);
        res.status(500).json({ message: 'Error retrieving submissions.' });
        return;
    }

    if (index < 0 || index >= submissions.length) {
        res.status(404).json({ message: 'Submission not found.' });
    } else {
        res.json(submissions[index]);
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
