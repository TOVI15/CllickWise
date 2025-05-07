import { TextField, Button, Box, Typography, Stack, AlertColor } from "@mui/material";
import { ReceiptLong } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./recipeStor";
import { addRecipe } from "../../moduls/recipesSlice";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useContext, useState } from "react";
import ErrorAlert from "../main/ErrorAlart";
import { UserContext } from "../main/contexUser";

const validationSchema = yup.object({
  title: yup.string().required("Recipe Title is required"),
  description: yup.string().required("Description is required"),
  ingredients: yup.string().required("Ingredients are required"),
  instructions: yup.string().required("Instructions are required"),
});

type RecipeFormData = {
  title: string;
  description: string;
  ingredients: string;
  instructions: string;
};

const AddRecipeForm = () => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<RecipeFormData>({
    resolver: yupResolver(validationSchema),
  });
  const [alertState, setAlertState] = useState({ open: false, message: "", severity: "success" as "success" | "error" as AlertColor })
  const dispatch = useDispatch<AppDispatch>();
  const contex = useContext(UserContext);
  const authorId = contex?.state.id
  const fields = [
    { name: "title", label: "Recipe Title", multiline: false },
    { name: "description", label: "Description", multiline: true, rows: 4 },
    { name: "ingredients", label: "Ingredients (Press Enter to Add)", multiline: true, rows: 4 },
    { name: "instructions", label: "Instructions", multiline: true, rows: 6 },
  ];

  const onSubmit = (data: RecipeFormData) => {
    if (authorId) {
      try {
        const newRecipe = {
          ...data,
          ingredients: data.ingredients.split("\n").map((i: string) => i.trim()).filter(Boolean),
          authorId: authorId,
        };
        dispatch(addRecipe(newRecipe));
        setAlertState({ open: true, message: "Recipe add success", severity: "success" });
        reset();
      } catch (error) {
        setAlertState({ open: true, message: "Something went wrong, Try again.", severity: "error" });
      }

    }

  };

  return (
    <Box sx={{ mt: 5, maxWidth: 600, p: 2 }}>
      <Typography variant="h4" gutterBottom>Add New Recipe</Typography>
      {alertState.open && (
        <ErrorAlert alertState={alertState} setAlertState={setAlertState} />)}
      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map(({ name, label, multiline, rows }, idx) => (
          <Box sx={{ mb: 2 }} key={idx}>
            <Controller
              name={name as keyof RecipeFormData}
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label={label}
                  variant="outlined"
                  fullWidth
                  multiline={multiline}
                  rows={rows}
                  helperText={errors[name as keyof RecipeFormData]?.message}
                  error={!!errors[name as keyof RecipeFormData]}
                />
              )}
            />
          </Box>
        ))}
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="contained" type="submit" endIcon={<ReceiptLong />}>
            Add Recipe
          </Button>
          <Button variant="outlined" onClick={() => reset()}>
            Clear
          </Button>
        </Stack>
      </form>
    </Box>
  );
};
export default AddRecipeForm;