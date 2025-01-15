import React, { useState } from 'react';
import { Button, Box, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const ImageUpload = ({ onImageUpload }) => {
  const [loading, setLoading] = useState(false);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'CookingPreset');
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dlyz3eqds/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      onImageUpload(data.secure_url);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Button
        variant="contained"
        component="label"
        startIcon={loading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
        disabled={loading}
      >
        Upload Image
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={handleImageChange}
        />
      </Button>
    </Box>
  );
};

export default ImageUpload; 