import { configureStore } from "@reduxjs/toolkit";
import recipesSlice from "../../moduls/recipesSlice";

const store = configureStore({
    reducer: {
        recipes: recipesSlice,
    },
    
})
export type RootStore = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;


