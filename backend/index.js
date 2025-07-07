import express from 'express';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import cors from 'cors';

// Use JSON file for storage
const file = 'db.json';
const adapter = new JSONFile(file);
const db = new Low(adapter, { stamps: [] });

// Read data from JSON file, this will set db.data content
await db.read();

// Set default data if db.data is null or undefined (e.g., first run)
db.data = db.data || { stamps: [], audit: [] };
if (!db.data.audit) {
  db.data.audit = [];
}

// Write the default data if it was just set (i.e., db.json was empty or didn't exist)
await db.write();

const app = express();
const port = 3000;

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Enable JSON body parser

// GET all stamps
app.get('/api/stamps', async (req, res) => {
  await db.read();
  res.json(db.data.stamps);
});

// GET a single stamp by ID
app.get('/api/stamps/:id', async (req, res) => {
  await db.read();
  const id = parseInt(req.params.id);
  const stamp = db.data.stamps.find(s => s.id === id);
  if (stamp) {
    res.json(stamp);
  } else {
    res.status(404).send('Stamp not found');
  }
});

// POST a new stamp
app.post('/api/stamps', async (req, res) => {
  await db.read();
  const newStamp = { id: Date.now(), ...req.body }; // Simple ID generation
  db.data.stamps.push(newStamp);
  await db.write();
  res.status(201).json(newStamp);
});

// PUT (update) an existing stamp
app.put('/api/stamps/:id', async (req, res) => {
  await db.read();
  const id = parseInt(req.params.id);
  const index = db.data.stamps.findIndex(s => s.id === id);
  if (index !== -1) {
    db.data.stamps[index] = { id, ...req.body };
    await db.write();
    res.json(db.data.stamps[index]);
  } else {
    res.status(404).send('Stamp not found');
  }
});

// DELETE a stamp
app.delete('/api/stamps/:id', async (req, res) => {
  await db.read();
  const id = parseInt(req.params.id);
  const initialLength = db.data.stamps.length;
  db.data.stamps = db.data.stamps.filter(s => s.id !== id);
  if (db.data.stamps.length < initialLength) {
    await db.write();
    res.status(204).send(); // No content
  } else {
    res.status(404).send('Stamp not found');
  }
});

// GET all audit logs
app.get('/api/audit', async (req, res) => {
  await db.read();
  res.json(db.data.audit);
});

// POST a new audit log
app.post('/api/audit', async (req, res) => {
  await db.read();
  const newLog = { id: Date.now(), timestamp: new Date(), ...req.body }; // Simple ID generation
  db.data.audit.push(newLog);
  await db.write();
  res.status(201).json(newLog);
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
