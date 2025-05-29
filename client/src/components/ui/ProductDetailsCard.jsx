import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Divider,
  IconButton,
  useTheme,
  Tab,
  Tabs,
} from '@mui/material';
import { motion } from 'framer-motion';
import { RiCloseLine, RiImageAddLine } from 'react-icons/ri';

const ProductDetailsCard = ({ product, onClose }) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getChipColor = (status) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Inactive':
        return 'error';
      case 'Featured':
        return 'primary';
      case 'COD Available':
        return 'success';
      case 'COD Not Available':
        return 'default';
      case 'Customizable':
        return 'info';
      default:
        return 'default';
    }
  };

  const getChipStyles = (color) => {
    const defaultStyles = {
      backgroundColor: '#e0e0e0',
      color: '#757575',
      fontWeight: 500,
      '& .MuiChip-label': {
        px: 2,
      },
    };

    if (!theme || !theme.palette || !theme.palette[color]) {
      return defaultStyles;
    }

    return {
      backgroundColor: theme.palette[color].light || defaultStyles.backgroundColor,
      color: theme.palette[color].main || defaultStyles.color,
      fontWeight: 500,
      '& .MuiChip-label': {
        px: 2,
      },
    };
  };

  const StatusChip = ({ label }) => {
    const color = getChipColor(label);
    const styles = getChipStyles(color);
    
    return (
      <Chip
        label={label}
        sx={styles}
      />
    );
  };

  const MediaGallery = () => {
    if (!product.media || product.media.length === 0) {
      return (
        <Box
          sx={{
            width: '100%',
            height: 400,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.palette.grey[100],
            borderRadius: '8px',
          }}
        >
          <RiImageAddLine size={48} color={theme.palette.grey[400]} />
        </Box>
      );
    }

    const currentMedia = product.media[selectedMediaIndex];

    return (
      <Box sx={{ position: 'relative', width: '100%', height: 400 }}>
        {currentMedia?.type === 'video' ? (
          <video
            src={currentMedia.url}
            controls
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '8px',
            }}
          />
        ) : (
          <img
            src={currentMedia?.url}
            alt={product.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '8px',
            }}
          />
        )}
        {product.media.length > 1 && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              padding: 1,
              borderRadius: '20px',
            }}
          >
            {product.media.map((media, index) => (
              <Box
                key={index}
                onClick={() => setSelectedMediaIndex(index)}
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '4px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: `2px solid ${
                    selectedMediaIndex === index
                      ? theme.palette.primary.main
                      : 'transparent'
                  }`,
                }}
              >
                {media.type === 'video' ? (
                  <video
                    src={media.url}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <img
                    src={media.url}
                    alt={`Thumbnail ${index}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                )}
              </Box>
            ))}
          </Box>
        )}
      </Box>
    );
  };

  const VariantsList = () => {
    if (!product.variants || product.variants.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="text.secondary">No variants available</Typography>
        </Box>
      );
    }

    return (
      <Grid container spacing={2}>
        {product.variants.map((variant, index) => (
          <Grid key={index} xs={12} sm={6}>
            <Card
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: '8px',
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {variant.name}
                </Typography>
                <Grid container spacing={1}>
                  <Grid xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Size
                    </Typography>
                    <Typography variant="body1">{variant.size}</Typography>
                  </Grid>
                  <Grid xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Color
                    </Typography>
                    <Typography variant="body1">{variant.color}</Typography>
                  </Grid>
                  <Grid xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Material
                    </Typography>
                    <Typography variant="body1">{variant.material}</Typography>
                  </Grid>
                  <Grid xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Price
                    </Typography>
                    <Typography variant="body1">₹{variant.price}</Typography>
                  </Grid>
                  <Grid xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Stock
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color:
                          variant.stock > 10
                            ? 'success.main'
                            : variant.stock > 0
                            ? 'warning.main'
                            : 'error.main',
                      }}
                    >
                      {variant.stock} units
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        sx={{
          maxWidth: 1200,
          width: '100%',
          mx: 'auto',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >
        <Box sx={{ position: 'relative', p: 2 }}>
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              zIndex: 1,
            }}
          >
            <RiCloseLine />
          </IconButton>
          <Typography variant="h5" component="h2" gutterBottom>
            {product.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            <StatusChip label={product.isActive ? 'Active' : 'Inactive'} />
            {product.isFeatured && <StatusChip label="Featured" />}
            <StatusChip label={product.codAvailable ? 'COD Available' : 'COD Not Available'} />
            {product.customizable && <StatusChip label="Customizable" />}
          </Box>
        </Box>

        <Divider />

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            px: 2,
          }}
        >
          <Tab label="Overview" />
          <Tab label="Variants" />
          <Tab label="Media" />
        </Tabs>

        <CardContent>
          {activeTab === 0 && (
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Description
                  </Typography>
                  <Typography variant="body1">{product.description}</Typography>
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Category
                  </Typography>
                  <Typography variant="body1">{product.category}</Typography>
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Base Price
                  </Typography>
                  <Typography variant="body1">₹{product.basePrice}</Typography>
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Production Time
                  </Typography>
                  <Typography variant="body1">{product.productionTime} days</Typography>
                </Box>
                {product.customizable && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Personalization Instructions
                    </Typography>
                    <Typography variant="body1">
                      {product.personalizationInstructions}
                    </Typography>
                  </Box>
                )}
              </Grid>
              <Grid xs={12} md={6}>
                <MediaGallery />
              </Grid>
            </Grid>
          )}

          {activeTab === 1 && <VariantsList />}

          {activeTab === 2 && (
            <Box sx={{ p: 2 }}>
              <MediaGallery />
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductDetailsCard; 