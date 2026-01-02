import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import axios from "axios";
import {
  Activity,
  ArrowLeftRight,
  CheckCircle,
  Circle,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import { useSelector } from "react-redux";
import { INDICATORS } from "../../services/api";
import { RootState } from "../../store";

const screenWidth = Dimensions.get("window").width;

export default function CompareScreen() {
  const { list } = useSelector((state: RootState) => state.countries);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [comparisonData, setComparisonData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedIds.length > 0) {
      fetchComparisonData();
    } else {
      setComparisonData([]);
    }
  }, [selectedIds]);

  const fetchComparisonData = async () => {
    setLoading(true);
    try {
      const results = await Promise.all(
        selectedIds.map(async (id) => {
          const response = await axios.get(
            `https://api.worldbank.org/v2/country/${id}/indicator/${INDICATORS.INTERNET_USERS}?format=json&per_page=1`
          );
          const countryName = list.find((c) => c.id === id)?.name || id;
          const value = response.data[1]?.[0]?.value || 0;
          return { name: countryName, value: parseFloat(value.toFixed(1)) };
        })
      );
      setComparisonData(results);
    } catch (error) {
      console.error("Failed to fetch comparison data", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else if (selectedIds.length < 3) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectedCountries = list.filter((c) => selectedIds.includes(c.id));

  const chartData = {
    labels: comparisonData.map((d) =>
      d.name.length > 8 ? d.name.slice(0, 8) + ".." : d.name
    ),
    datasets: [{ data: comparisonData.map((d) => d.value) }],
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Compare</ThemedText>
        <ThemedText style={styles.subtitle}>
          Select up to 3 countries to compare connectivity
        </ThemedText>
      </View>

      <View style={styles.selectionArea}>
        <FlatList
          data={list.slice(0, 50)}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isSelected = selectedIds.includes(item.id);
            return (
              <TouchableOpacity
                style={[styles.smallCard, isSelected && styles.selectedCard]}
                onPress={() => toggleSelection(item.id)}
              >
                {isSelected ? (
                  <CheckCircle size={16} color="#007AFF" />
                ) : (
                  <Circle size={16} color="#ccc" />
                )}
                <ThemedText style={styles.smallCardText}>
                  {item.name}
                </ThemedText>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {selectedIds.length > 0 ? (
        <ScrollView
          style={styles.comparisonArea}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.chartTitleContainer}>
            <Activity size={20} color="#007AFF" />
            <ThemedText type="subtitle" style={{ marginLeft: 8 }}>
              Internet Usage Comparison (%)
            </ThemedText>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <ThemedText style={{ marginTop: 10 }}>
                Fetching comparison data...
              </ThemedText>
            </View>
          ) : (
            <>
              {comparisonData.length > 0 && (
                <View style={styles.chartContainer}>
                  <BarChart
                    data={chartData}
                    width={screenWidth - 40}
                    height={220}
                    yAxisLabel=""
                    yAxisSuffix="%"
                    chartConfig={{
                      backgroundColor: "#ffffff",
                      backgroundGradientFrom: "#ffffff",
                      backgroundGradientTo: "#ffffff",
                      decimalPlaces: 1,
                      color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                      style: { borderRadius: 16 },
                    }}
                    verticalLabelRotation={0}
                    style={styles.chart}
                  />
                </View>
              )}

              <View style={styles.statsTable}>
                <View style={styles.tableRow}>
                  <ThemedText style={styles.tableHeader}>Country</ThemedText>
                  <ThemedText style={styles.tableHeader}>
                    Latest Internet %
                  </ThemedText>
                </View>
                {comparisonData.map((d, index) => (
                  <View key={index} style={styles.tableRow}>
                    <ThemedText style={styles.tableName}>{d.name}</ThemedText>
                    <ThemedText style={styles.tableValue}>
                      {d.value}%
                    </ThemedText>
                  </View>
                ))}
                {selectedCountries.length > comparisonData.length && (
                  <ThemedText style={styles.infoText}>
                    Loading more data...
                  </ThemedText>
                )}
              </View>
            </>
          )}
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <ArrowLeftRight size={64} color="#ccc" />
          <ThemedText style={styles.emptyText}>
            Select countries from the horizontal list above to start comparing
            their latest stats
          </ThemedText>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 20,
  },
  subtitle: {
    opacity: 0.6,
    marginTop: 4,
  },
  selectionArea: {
    marginBottom: 20,
    height: 60,
  },
  smallCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#eee",
    height: 40,
  },
  selectedCard: {
    borderColor: "#007AFF",
    backgroundColor: "#e5f1ff",
  },
  smallCardText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#000",
  },
  comparisonArea: {
    flex: 1,
  },
  chartTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  chartContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 10,
    marginBottom: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  chart: {
    borderRadius: 16,
  },
  loadingContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.5,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 16,
    paddingHorizontal: 40,
  },
  statsTable: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 40,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f7",
  },
  tableHeader: {
    fontWeight: "700",
    color: "#8e8e93",
  },
  tableName: {
    width: "60%",
    color: "#000",
  },
  tableValue: {
    width: "40%",
    textAlign: "right",
    color: "#34C759",
    fontWeight: "600",
  },
  infoText: {
    textAlign: "center",
    fontSize: 12,
    color: "#8e8e93",
    marginTop: 10,
  },
});
