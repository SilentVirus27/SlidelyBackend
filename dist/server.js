"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
const PORT = 3000;
const dbFilePath = 'db.json';
// Middleware
app.use(body_parser_1.default.json());
// Ensure db.json file exists
if (!fs_1.default.existsSync(dbFilePath)) {
    fs_1.default.writeFileSync(dbFilePath, '[]', 'utf8');
    console.log(`Created empty db.json at ${dbFilePath}`);
}
// Routes
app.get('/ping', (req, res) => {
    res.json(true);
});
app.post('/submit', (req, res) => {
    const { name, email, phone, github_link, stopwatch_time } = req.body;
    const submission = { name, email, phone, github_link, stopwatch_time };
    // Load existing submissions from JSON file
    let submissions = [];
    try {
        const data = fs_1.default.readFileSync(dbFilePath, 'utf8');
        submissions = JSON.parse(data);
    }
    catch (error) {
        console.error('Error reading db.json:', error);
    }
    // Add new submission
    submissions.push(submission);
    // Write updated submissions back to JSON file
    fs_1.default.writeFile(dbFilePath, JSON.stringify(submissions), (err) => {
        if (err) {
            console.error('Error writing to db.json:', err);
            res.status(500).json({ message: 'Error saving submission.' });
        }
        else {
            res.json({ message: 'Submission successful!' });
        }
    });
});
app.get('/read', (req, res) => {
    const index = Number(req.query.index);
    let submissions = [];
    try {
        const data = fs_1.default.readFileSync(dbFilePath, 'utf8');
        submissions = JSON.parse(data);
    }
    catch (error) {
        console.error('Error reading db.json:', error);
        res.status(500).json({ message: 'Error retrieving submissions.' });
        return;
    }
    if (index < 0 || index >= submissions.length) {
        res.status(404).json({ message: 'Submission not found.' });
    }
    else {
        res.json(submissions[index]);
    }
});
// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
