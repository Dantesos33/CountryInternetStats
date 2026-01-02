import axios from "axios";

const BASE_URL = "https://api.worldbank.org/v2";

export const INDICATORS = {
  INTERNET_USERS: "IT.NET.USER.ZS", // Individuals using the Internet (% of population)
  MOBILE_SUBS: "IT.CEL.SETS.P2", // Mobile cellular subscriptions (per 100 people)
  BROADBAND_SUBS: "IT.NET.BBND.P2", // Fixed broadband subscriptions (per 100 people)
};

export const fetchCountriesList = async () => {
  const response = await axios.get(
    `${BASE_URL}/country?format=json&per_page=300`
  );
  return response.data[1].filter((country: any) => country.capitalCity !== "");
};

export const fetchIndicatorData = async (
  countryCode: string,
  indicator: string
) => {
  const response = await axios.get(
    `${BASE_URL}/country/${countryCode}/indicator/${indicator}?format=json&per_page=10`
  );
  return response.data[1];
};
