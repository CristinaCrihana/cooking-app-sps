const express = require('express');
const router = express.Router();
const USDA_API_KEY = 'bjFuZ1yzDC1U55SZQsLegcgElYHXdlcIRzROWE8b';
const USDA_BASE_URL = 'https://api.nal.usda.gov/fdc/v1';
const { processUsdaResults } = require('../utils/usdaProcessor');
const redisClient = require('../utils/redis');

const CACHE_EXPIRATION = 60 * 60 * 24; // 24 hours in seconds

router.get('/search', async (req, res) => {
  const { query } = req.query;
  
  if (!query || query.length < 2) {
    return res.json([]);
  }

  try {
    // Check cache first
    const cacheKey = `usda:search:${query.toLowerCase()}`;
    const cachedResults = await redisClient.get(cacheKey);
    
    if (cachedResults) {
      return res.json(JSON.parse(cachedResults));
    }

    // If not in cache, fetch from USDA API
    const response = await fetch(
      `${USDA_BASE_URL}/foods/search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(query)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('USDA API Error:', errorData);
      throw new Error(errorData.message || 'Failed to fetch ingredients');
    }

    const data = await response.json();
    const processedResults = processUsdaResults(data, query);
    
    // Store in cache
    await redisClient.setEx(cacheKey, CACHE_EXPIRATION, JSON.stringify(processedResults));
    
    res.json(processedResults);
  } catch (error) {
    console.error('Error fetching USDA data:', error);
    res.status(500).json({ error: 'Failed to fetch ingredients' });
  }
});

module.exports = router; 