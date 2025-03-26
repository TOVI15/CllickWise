import React, { useState } from 'react';
import { Recipe } from '../../moduls/recipesSlice';
import RecipeDetail from './DetailRecipet';
import Sidebar from './RecipesList';
import { Provider } from 'react-redux';
import store from './recipeStor';


const rec: Recipe = {
  id: 0,
  title: "",
  description: "",
  authorId: 0,
  ingredients: [],
  instructions: "",
};

const App: React.FC = () => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe>(rec);

  return (
    <div style={{ display: 'flex' }}>
      <Provider store={store}><Sidebar setSelectedRecipe={setSelectedRecipe} /></Provider>
      <RecipeDetail recipe={selectedRecipe} />
    </div>
  );
};

export default App;