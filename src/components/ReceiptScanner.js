import React, { useState } from 'react';
import { Box, Typography, LinearProgress, Alert, List, ListItem, ListItemText, Paper, Tabs, Tab } from '@mui/material';
import ImageUpload from './ImageUpload';

const ReceiptScanner = ({ onIngredientsDetected }) => {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);
  const [scannedItems, setScannedItems] = useState([]);
  const [rawText, setRawText] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  const handleImageUpload = async (imageUrl) => {
    try {
      setScanning(true);
      setError(null);
      
      const response = await fetch('http://localhost:5000/api/vision/analyze-receipt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error scanning receipt');
      }
      
      if (data.ingredients && data.ingredients.length > 0) {
        setScannedItems(data.ingredients);
        setRawText(data.rawText);
        onIngredientsDetected(data.ingredients);
      } else {
        setError('No ingredients detected in the receipt');
      }
    } catch (error) {
      console.error('Error scanning receipt:', error);
      setError(error.message);
    } finally {
      setScanning(false);
    }
  };

  const formatIngredient = (item) => {
    if (item.unit === 'kg') {
      return `${item.name} - ${item.quantity} ${item.unit}`;
    } else {
      return `${item.name} - 1 piece`;
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Scan Receipt
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Upload a picture of your receipt to automatically add ingredients to your fridge
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <ImageUpload onImageUpload={handleImageUpload} />
      </Box>
      
      {scanning && (
        <Box sx={{ width: '100%', mt: 2 }}>
          <LinearProgress />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Analyzing receipt...
          </Typography>
        </Box>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {(scannedItems.length > 0 || rawText) && (
        <Paper sx={{ mt: 2 }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab label="Raw Text" />
            <Tab label="Processed Items" />
          </Tabs>
          
          <Box sx={{ p: 2 }}>
            {activeTab === 0 && (
              <pre style={{ 
                fontFamily: 'monospace', 
                whiteSpace: 'pre-wrap',
                margin: 0
              }}>
                {rawText}
              </pre>
            )}
            
            {activeTab === 1 && (
              <List dense>
                {scannedItems.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={formatIngredient(item)}
                      sx={{
                        '& .MuiListItemText-primary': {
                          fontFamily: 'monospace',
                          fontSize: '1rem'
                        }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default ReceiptScanner;
