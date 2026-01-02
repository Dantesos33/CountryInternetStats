import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Stack, useLocalSearchParams } from "expo-router";
import { Globe, Heart, Smartphone, Wifi } from "lucide-react-native";
import React, { useEffect } from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { INDICATORS } from "../../services/api";
import { AppDispatch, RootState } from "../../store";
import { fetchCountryStats } from "../../store/slices/countriesSlice";
import { addFavorite, removeFavorite } from "../../store/slices/favoritesSlice";

const screenWidth = Dimensions.get("window").width;

export default function CountryDetailScreen() {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const country = useSelector((state: RootState) =>
    state.countries.list.find((c) => c.id === id)
  );
  const stats = useSelector(
    (state: RootState) => state.countries.selectedCountryStats
  );
  const favorites = useSelector((state: RootState) => state.favorites.items);
  const isFavorite = favorites.some((f) => f.id === id);

  useEffect(() => {
    if (id) {
      dispatch(
        fetchCountryStats({
          countryCode: id as string,
          indicators: [
            INDICATORS.INTERNET_USERS,
            INDICATORS.MOBILE_SUBS,
            INDICATORS.BROADBAND_SUBS,
          ],
        })
      );
    }
  }, [id, dispatch]);

  const toggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFavorite(id as string));
    } else if (country) {
      dispatch(
        addFavorite({
          id: country.id,
          name: country.name,
          notes: "",
          addedAt: new Date().toISOString(),
        })
      );
    }
  };

  if (!country) return <ThemedText>Country not found</ThemedText>;

  const getChartData = (indicator: string) => {
    const data = stats[indicator] || [];
    const sortedData = [...data].sort(
      (a, b) => parseInt(a.date) - parseInt(b.date)
    );
    return {
      labels: sortedData.map((d) => d.date.slice(-2)),
      datasets: [{ data: sortedData.map((d) => d.value ?? 0) }],
    };
  };

  const renderChart = (
    title: string,
    indicator: string,
    color: string,
    icon: React.ReactNode
  ) => {
    const chartData = getChartData(indicator);
    if (chartData.labels.length === 0) return null;

    return (
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          {icon}
          <ThemedText type="defaultSemiBold" style={styles.chartTitle}>
            {title}
          </ThemedText>
        </View>
        <LineChart
          data={chartData}
          width={screenWidth - 60}
          height={180}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 1,
            color: (opacity = 1) => color,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: { r: "4", strokeWidth: "2", stroke: color },
          }}
          bezier
          style={styles.chart}
        />
        <ThemedText style={styles.latestValue}>
          Latest: {chartData.datasets[0].data.slice(-1)[0].toFixed(1)}%
        </ThemedText>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: country.name,
          headerRight: () => (
            <TouchableOpacity
              onPress={toggleFavorite}
              style={{ marginRight: 15 }}
            >
              <Heart
                size={24}
                color={isFavorite ? "#FF3B30" : "#8e8e93"}
                fill={isFavorite ? "#FF3B30" : "transparent"}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.infoSection}>
          <ThemedText type="subtitle">
            Region: {country.region.value}
          </ThemedText>
          <ThemedText>Capital: {country.capitalCity}</ThemedText>
        </View>

        {renderChart(
          "Internet Users (% of pop.)",
          INDICATORS.INTERNET_USERS,
          "#007AFF",
          <Wifi size={20} color="#007AFF" />
        )}
        {renderChart(
          "Mobile Subscriptions (per 100)",
          INDICATORS.MOBILE_SUBS,
          "#34C759",
          <Smartphone size={20} color="#34C759" />
        )}
        {renderChart(
          "Fixed Broadband (per 100)",
          INDICATORS.BROADBAND_SUBS,
          "#AF52DE",
          <Globe size={20} color="#AF52DE" />
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  infoSection: {
    marginBottom: 24,
  },
  chartCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  chartHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  chartTitle: {
    marginLeft: 8,
    fontSize: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  latestValue: {
    textAlign: "right",
    fontSize: 14,
    color: "#34C759",
    fontWeight: "600",
    marginTop: 4,
  },
});
