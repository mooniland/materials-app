const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const AT_TOKEN = process.env.AT_TOKEN || 'patW7CJgDuJu26bwP.c6c8b77227abbfbd2fc79175d9c0528bd2a4ffa3358505083e63c582037db52d';
const AT_BASE = process.env.AT_BASE || 'appHMqS5cdHFyBr0X';
const AT_TABLE = process.env.AT_TABLE || 'tblBIkcQyE2CznT6O';
const AT_URL = `https://api.airtable.com/v0/${AT_BASE}/${AT_TABLE}`;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Get all records
app.get('/api/items', async (req, res) => {
  try {
    let all = [];
    let offset = '';
    do {
      const url = AT_URL + '?pageSize=100' + (offset ? '&offset=' + offset : '');
      const r = await fetch(url, {
        headers: { 'Authorization': `Bearer ${AT_TOKEN}` }
      });
      const d = await r.json();
      if (d.error) throw new Error(d.error.message);
      all = [...all, ...(d.records || [])];
      offset = d.offset || '';
    } while (offset);
    res.json(all);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Create a record
app.post('/api/items', async (req, res) => {
  try {
    const r = await fetch(AT_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AT_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fields: req.body })
    });
    const d = await r.json();
    if (d.error) throw new Error(d.error.message);
    res.json(d);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Update a record
app.patch('/api/items/:id', async (req, res) => {
  try {
    const r = await fetch(AT_URL + '/' + req.params.id, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${AT_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fields: req.body })
    });
    const d = await r.json();
    if (d.error) throw new Error(d.error.message);
    res.json(d);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`Materials Tracker server running on port ${PORT}`);
});
