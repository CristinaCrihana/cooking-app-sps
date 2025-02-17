import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  List, 
  ListItem, 
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  InputAdornment,
  Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { convert, standardizeUnit } from '../../utils/unitConverter';
import IngredientScanner from '../../components/IngredientScanner';
import ReceiptScanner from '../ReceiptScanner';

const MyFridge = ({ fridgeItems, setFridgeItems }) => {
  const [newItem, setNewItem] = useState({ name: '', quantity: '', unit: '' });
  const [editingItem, setEditingItem] = useState(null);


  const handleAddItem = async () => {
    if (newItem.name && newItem.quantity && newItem.unit) {
      // Check if item already exists (case-insensitive)
      const existingItem = fridgeItems.find(
        item => item.name.toLowerCase() === newItem.name.toLowerCase()
      );

      if (existingItem) {
        try {
          const convertedQuantity = convert(
            parseFloat(newItem.quantity),
            standardizeUnit(newItem.unit),
            standardizeUnit(existingItem.unit)
          );
          const updatedItems = fridgeItems.map(item =>
            item.id === existingItem.id && item.name.toLowerCase() === newItem.name.toLowerCase()
              ? {
                  ...item,
                  quantity: (parseFloat(item.quantity) + convertedQuantity).toString()
                }
              : item
          );

          await setFridgeItems(updatedItems);
          setNewItem({ name: '', quantity: '', unit: '' });
        } catch (error) {
          console.error('Unit conversion error:', error);
          alert('Cannot combine items with incompatible units. Please use the same type of measurement (weight or volume).');
        }
      } else {
        const updatedItems = [...fridgeItems, { ...newItem, id: Date.now() }];
        await setFridgeItems(updatedItems);
        setNewItem({ name: '', quantity: '', unit: '' });
      }
    }
  };

  const handleDeleteItem = (id) => {
    const updatedItems = fridgeItems.filter(item => item.id !== id);
    setFridgeItems(updatedItems);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setNewItem(item);
  };

  const handleUpdateItem = () => {
    const updatedItems = fridgeItems.map(item => 
      item.id === editingItem.id ? { ...newItem, id: item.id } : item
    );
    setFridgeItems(updatedItems);
    setNewItem({ name: '', quantity: '', unit: '' });
    setEditingItem(null);
  };

  const handleIngredientsDetected = (detectedIngredients) => {
    const newItems = detectedIngredients.map(ingredient => ({
      id: Date.now() + Math.random(),
      name: ingredient.name,
      quantity: ingredient.quantity || '1',
      unit: ingredient.unit || 'piece'
    }));

    setFridgeItems([...fridgeItems, ...newItems]);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        My Fridge
      </Typography>

      <IngredientScanner onIngredientsDetected={handleIngredientsDetected} />
      
      <ReceiptScanner onIngredientsDetected={handleIngredientsDetected} />
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Ingredient"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          size="small"
        />
        <TextField
          label="Quantity"
          type="number"
          value={newItem.quantity}
          onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
          size="small"
          sx={{ width: '100px' }}
        />
        <TextField
          label="Unit"
          value={newItem.unit}
          onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
          size="small"
          sx={{ width: '100px' }}
        />
        <Button 
          variant="contained" 
          onClick={editingItem ? handleUpdateItem : handleAddItem}
        >
          {editingItem ? 'Update' : 'Add'}
        </Button>
      </Box>

      <List>
        {fridgeItems.map((item) => (
          <ListItem key={item.id} divider>
            <ListItemText 
              primary={item.name}
              secondary={`${item.quantity} ${item.unit}`}
            />
            <ListItemSecondaryAction>
              <IconButton 
                edge="end" 
                onClick={() => handleEditItem(item)}
                sx={{ mr: 1 }}
              >
                <EditIcon />
              </IconButton>
              <IconButton 
                edge="end" 
                onClick={() => handleDeleteItem(item.id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default MyFridge; 