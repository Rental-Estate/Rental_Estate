import express from 'express';
import authMiddleware from '../middleware/auth.js';
import Property from '../models/Property.js';

const router = express.Router();

/* ─────────────── SEARCH ─────────────── */
// GET /api/properties/search
router.get('/search', async (req, res) => {
  try {
    const { city, area, type } = req.query;
    const query = {};
    if (city) query.city = city;
    if (area) query.area = area;
    if (type) query.type = type;

    const results = await Property.find(query);
    res.json(results);
  } catch (err) {
    console.error('❌ Search error:', err);
    res.status(500).json({ message: 'Search failed' });
  }
});

/* ─────────────── OWNER COUNT ─────────────── */
// GET /api/properties/owner/count
// (⚠️  must be defined before '/:id')
router.get('/owner/count', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'owner') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const count = await Property.countDocuments({ 'owner.email': req.user.email });
    res.json({ count });
  } catch (err) {
    console.error('❌ Error fetching owner property count:', err);
    res.status(500).json({ message: 'Failed to fetch property count' });
  }
});

/* ─────────────── LIST WITH LIMIT ─────────────── */
// GET /api/properties?limit=3
router.get('/', async (req, res) => {
  try {
    const limit = Math.max(0, parseInt(req.query.limit) || 0); // never negative
    const properties = await Property.find().limit(limit);
    res.json(properties);
  } catch (err) {
    console.error('❌ Error fetching properties:', err);
    res.status(500).json({ message: 'Failed to fetch properties' });
  }
});

/* ─────────────── GET BY ID ─────────────── */
// GET /api/properties/:id
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(property);
  } catch (err) {
    console.error('❌ Error fetching property by ID:', err);
    res.status(500).json({ message: 'Failed to fetch property details' });
  }
});

export default router;
