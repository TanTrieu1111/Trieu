import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Helper to read/write db.json
  const dbPath = path.join(__dirname, 'db.json');
  const getDb = () => JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  const saveDb = (data: any) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

  // --- RESTful API Routes ---

  // GET /api/products - List all products
  app.get('/api/products', (req, res) => {
    const db = getDb();
    res.json(db.products);
  });

  // GET /api/products/:id - Get a single product
  app.get('/api/products/:id', (req, res) => {
    const db = getDb();
    const product = db.products.find((p: any) => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  });

  // POST /api/products - Create a new product
  app.post('/api/products', (req, res) => {
    const db = getDb();
    const newProduct = {
      ...req.body,
      id: Date.now(),
    };
    db.products.push(newProduct);
    saveDb(db);
    res.status(201).json(newProduct);
  });

  // PUT /api/products/:id - Update an existing product
  app.put('/api/products/:id', (req, res) => {
    const db = getDb();
    const index = db.products.findIndex((p: any) => p.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: 'Product not found' });
    
    db.products[index] = { ...db.products[index], ...req.body, id: parseInt(req.params.id) };
    saveDb(db);
    res.json(db.products[index]);
  });

  // DELETE /api/products/:id - Delete a product
  app.delete('/api/products/:id', (req, res) => {
    const db = getDb();
    const initialLength = db.products.length;
    db.products = db.products.filter((p: any) => p.id !== parseInt(req.params.id));
    
    if (db.products.length === initialLength) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    saveDb(db);
    res.status(204).send();
  });

  // --- Orders API ---
  app.get('/api/orders', (req, res) => {
    const db = getDb();
    res.json(db.orders);
  });

  app.post('/api/orders', (req, res) => {
    const db = getDb();
    const newOrder = {
      ...req.body,
      id: Date.now(),
    };
    db.orders.push(newOrder);
    saveDb(db);
    res.status(201).json(newOrder);
  });

  app.put('/api/orders/:id', (req, res) => {
    const db = getDb();
    const index = db.orders.findIndex((o: any) => o.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: 'Order not found' });
    
    db.orders[index] = { ...db.orders[index], ...req.body };
    saveDb(db);
    res.json(db.orders[index]);
  });

  // --- Categories API ---
  app.get('/api/categories', (req, res) => {
    const db = getDb();
    res.json(db.categories);
  });

  app.post('/api/categories', (req, res) => {
    const db = getDb();
    const newCategory = { ...req.body, id: Date.now() };
    db.categories.push(newCategory);
    saveDb(db);
    res.status(201).json(newCategory);
  });

  app.delete('/api/categories/:id', (req, res) => {
    const db = getDb();
    db.categories = db.categories.filter((c: any) => c.id !== parseInt(req.params.id));
    saveDb(db);
    res.status(204).send();
  });

  // --- Banners API ---
  app.get('/api/banners', (req, res) => {
    const db = getDb();
    res.json(db.banners);
  });

  app.post('/api/banners', (req, res) => {
    const db = getDb();
    const newBanner = { ...req.body, id: Date.now() };
    db.banners.push(newBanner);
    saveDb(db);
    res.status(201).json(newBanner);
  });

  app.delete('/api/banners/:id', (req, res) => {
    const db = getDb();
    db.banners = db.banners.filter((b: any) => b.id !== parseInt(req.params.id));
    saveDb(db);
    res.status(204).send();
  });

  // --- Reviews API ---
  app.get('/api/reviews', (req, res) => {
    const db = getDb();
    res.json(db.reviews);
  });

  app.delete('/api/reviews/:id', (req, res) => {
    const db = getDb();
    db.reviews = db.reviews.filter((r: any) => r.id !== parseInt(req.params.id));
    saveDb(db);
    res.status(204).send();
  });

  // GET /api/users - List all users
  app.get('/api/users', (req, res) => {
    const db = getDb();
    res.json(db.users);
  });

  app.put('/api/users/:id', (req, res) => {
    const db = getDb();
    const index = db.users.findIndex((u: any) => u.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: 'User not found' });
    
    db.users[index] = { ...db.users[index], ...req.body };
    saveDb(db);
    res.json(db.users[index]);
  });

  // POST /api/auth/login - Standard login endpoint
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const db = getDb();
    const user = db.users.find((u: any) => (u.email === email || u.username === email) && u.password === password);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      fullName: user.fullName
    });
  });

  // --- Vite Integration ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
