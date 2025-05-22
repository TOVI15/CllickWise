import React from 'react';
import { Box, Typography, List, ListItem, Paper, Divider } from '@mui/material';
import { Recipe } from '../recipesSlice';

const RecipeDetail: React.FC<{ recipe: Recipe }> = ({ recipe }) => {
    if (recipe.authorId === 0) {
        return (
            <Box sx={{
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '34px',
            }}>
                <Paper sx={{ padding: 3, boxShadow: 3, width: '100%', maxWidth: 500 }}>
                    <Typography variant="h6" color="primary">
                        Please select a recipe from the sidebar to view its details.
                    </Typography>
                </Paper>
            </Box>
        );
    }

    return (
        <Box sx={{
            marginTop: '64px',
            padding: 2,
            minHeight: 'calc(100vh - 64px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
        }}>
            <Paper sx={{
                padding: 3,
                boxShadow: 3,
                width: '100%',
                maxWidth: 600,
            }}>
                <Typography variant="h4" sx={{ color: '#1976d2', marginBottom: 1, fontSize: '1.5rem' }}>
                    {recipe.title}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom sx={{ fontSize: '0.9rem' }}>
                    Author ID: {recipe.authorId}
                </Typography>

                <Typography variant="body2" paragraph sx={{ fontSize: '1rem', lineHeight: '1.5' }}>
                    {recipe.description}
                </Typography>

                <Typography variant="h6" sx={{ color: '#1976d2', marginY: 1, fontSize: '1.1rem' }}>
                    Ingredients:
                </Typography>
                <List>
                    {recipe.ingredients.map((ingredient, index) => (
                        <ListItem key={index} sx={{ paddingLeft: 0 }}>
                            <Typography variant="body2" sx={{ fontSize: '1rem' }}>
                                - {ingredient}
                            </Typography>
                        </ListItem>
                    ))}
                </List>

                <Divider sx={{ marginY: 1 }} />
                <Typography variant="h6" sx={{ color: '#1976d2', marginY: 1, fontSize: '1.1rem' }}>
                    Instructions:
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '1rem', lineHeight: '1.5' }}>
                    {recipe.instructions}
                </Typography>
            </Paper>
        </Box>
    );
};

export default RecipeDetail;