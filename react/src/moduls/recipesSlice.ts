import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootStore } from "../components/recipe/recipeStor";

export type Recipe = {
    id?: number;
    title: string;
    description: string;
    authorId: number;
    ingredients: string[];
    instructions: string;
};

export const fetchRecipes = createAsyncThunk('recipes/fetch', async (_, thunkAPI) => {
    try {
        const response = await axios.get('http://localhost:3000/api/recipes');
        return response.data as Recipe[];
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

export const addRecipe = createAsyncThunk('recipes/add', async (newRecipe: Recipe, thunkAPI) => {
    try {

        const response = await axios.post('http://localhost:3000/api/recipes', newRecipe, {
            headers: {
                'user-id': newRecipe.authorId
            }
        });
        return response.data.recipe;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

const recipesSlice = createSlice({
    name: 'recipes',
    initialState: {
        recipes: [] as Recipe[],
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRecipes.fulfilled, (state, action: PayloadAction<Recipe[]>) => {
                state.recipes = action.payload;
            })
            .addCase(addRecipe.fulfilled, (state, action: PayloadAction<Recipe>) => {
                state.recipes.push(action.payload);
            })
    },
});

export const selectRecipes = (state: RootStore) => state.recipes;
export default recipesSlice.reducer;