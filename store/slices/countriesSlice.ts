import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface Country {
  id: string;
  name: string;
  region: { id: string; value: string };
  capitalCity: string;
}

interface Stat {
  country: { id: string; value: string };
  date: string;
  value: number | null;
  indicator: { id: string; value: string };
}

interface CountriesState {
  list: Country[];
  selectedCountryStats: { [indicator: string]: Stat[] };
  loading: boolean;
  error: string | null;
}

const initialState: CountriesState = {
  list: [],
  selectedCountryStats: {},
  loading: false,
  error: null,
};

export const fetchCountries = createAsyncThunk(
  "countries/fetchCountries",
  async () => {
    const response = await axios.get(
      "https://api.worldbank.org/v2/country?format=json&per_page=300"
    );
    return response.data[1] as Country[];
  }
);

export const fetchCountryStats = createAsyncThunk(
  "countries/fetchCountryStats",
  async ({
    countryCode,
    indicators,
  }: {
    countryCode: string;
    indicators: string[];
  }) => {
    const stats: { [indicator: string]: Stat[] } = {};
    for (const indicator of indicators) {
      const response = await axios.get(
        `https://api.worldbank.org/v2/country/${countryCode}/indicator/${indicator}?format=json&per_page=10`
      );
      stats[indicator] = response.data[1] || [];
    }
    return stats;
  }
);

const countriesSlice = createSlice({
  name: "countries",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountries.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchCountries.fulfilled,
        (state, action: PayloadAction<Country[]>) => {
          state.loading = false;
          state.list = action.payload.filter((c) => c.capitalCity !== ""); // Filter out regions/aggregates
        }
      )
      .addCase(fetchCountries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch countries";
      })
      .addCase(fetchCountryStats.fulfilled, (state, action) => {
        state.selectedCountryStats = action.payload;
      });
  },
});

export default countriesSlice.reducer;
