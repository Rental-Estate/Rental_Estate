import Property from '../models/Property.js';

export const getProperties = async (req, res) => {
  const { city, area, type, date } = req.query;

  const filters = {};

  if (city) filters.city = city;
  if (area) filters.area = area;
  if (type) filters.type = type;
  if (date) filters.availableFrom = { $lte: new Date(date) };

  try {
    const properties = await Property.find(filters);
    res.status(200).json(properties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};