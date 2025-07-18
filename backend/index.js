// ... existing code ...
const cors = require('cors');
const express = require('express');
const app = express();
const PORT = 3001;

app.use(cors());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

