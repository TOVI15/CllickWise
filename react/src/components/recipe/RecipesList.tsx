import React, { useEffect, useState } from 'react';
import { Paper, List, ListItem, ListItemButton, ListItemText, Divider, Toolbar, AlertColor } from '@mui/material';
import axios from 'axios';
import { Recipe } from '../../moduls/recipesSlice';
import ErrorAlert from '../main/ErrorAlart';


const Sidebar: React.FC<{ setSelectedRecipe: (recipe: Recipe) => void }> = ({ setSelectedRecipe }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [alertState, setAlertState] = useState({ open: false, message: "", severity: "success" as "success" | "error" as AlertColor })
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/recipes');
        setRecipes(response.data);
      } catch (error: any) {
        setAlertState({ open: true, message: "Something went wrong, Try again.", severity: "error" });

      }
    };
    fetchRecipes();
  }, []);

  return (
    <Paper
      sx={{
        position: 'fixed',
        right: 0,
        top: 0,
        width: 250,
        height: '100%',
        padding: 2,
        boxShadow: 3,
        zIndex: 0,
      }}
    >
      <Toolbar />
      <List>
        {alertState.open && (
          <ErrorAlert alertState={alertState} setAlertState={setAlertState} />)}
        {recipes.map((r) => (
          <ListItem key={r.id} disablePadding>
            <ListItemButton onClick={() => setSelectedRecipe(r)}>
              <ListItemText primary={r.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Paper>
  );
};

export default Sidebar;
