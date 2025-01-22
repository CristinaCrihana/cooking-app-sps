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

const MyFridge = ({ fridgeItems, setFridgeItems }) => {
  const [newItem, setNewItem] = useState({ name: '', quantity: '', unit: '' });
  const [editingItem, setEditingItem] = useState(null);

  const handleAddItem = () => {
    if (newItem.name && newItem.quantity && newItem.unit) {
      setFridgeItems([...fridgeItems, { ...newItem, id: Date.now() }]);
      setNewItem({ name: '', quantity: '', unit: '' });
    }
  };

  const handleDeleteItem = (id) => {
    setFridgeItems(fridgeItems.filter(item => item.id !== id));
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setNewItem(item);
  };

  const handleUpdateItem = () => {
    setFridgeItems(fridgeItems.map(item => 
      item.id === editingItem.id ? { ...newItem, id: item.id } : item
    ));
    setNewItem({ name: '', quantity: '', unit: '' });
    setEditingItem(null);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        My Fridge
      </Typography>

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