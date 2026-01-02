import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Favorite {
  id: string;
  name: string;
  notes: string;
  addedAt: string;
}

interface FavoritesState {
  items: Favorite[];
}

const initialState: FavoritesState = {
  items: [],
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<Favorite>) => {
      if (!state.items.find((f) => f.id === action.payload.id)) {
        state.items.push(action.payload);
      }
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((f) => f.id !== action.payload);
    },
    updateFavoriteNote: (
      state,
      action: PayloadAction<{ id: string; notes: string }>
    ) => {
      const fav = state.items.find((f) => f.id === action.payload.id);
      if (fav) {
        fav.notes = action.payload.notes;
      }
    },
  },
});

export const { addFavorite, removeFavorite, updateFavoriteNote } =
  favoritesSlice.actions;
export default favoritesSlice.reducer;
