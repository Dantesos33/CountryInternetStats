import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useRouter } from "expo-router";
import {
  ChevronRight,
  Globe,
  Heart,
  Search,
  TrendingUp,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchCountries } from "../../store/slices/countriesSlice";

const REGIONS = ["All", "Africa", "Americas", "Asia", "Europe", "Oceania"];

export default function HomeScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { list, loading, error } = useSelector(
    (state: RootState) => state.countries
  );
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");

  useEffect(() => {
    dispatch(fetchCountries());
  }, [dispatch]);

  const filteredCountries = list.filter((country) => {
    const matchesSearch = country.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesRegion =
      selectedRegion === "All" || country.region.value.includes(selectedRegion);
    return matchesSearch && matchesRegion;
  });

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/country/${item.id}`)}
    >
      <View style={styles.cardContent}>
        <View style={styles.iconContainer}>
          <Globe size={24} color="#007AFF" />
        </View>
        <View style={styles.textContainer}>
          <ThemedText type="defaultSemiBold" style={styles.countryName}>
            {item.name}
          </ThemedText>
          <ThemedText style={styles.region}>{item.region.value}</ThemedText>
        </View>
        <ChevronRight size={20} color="#ccc" />
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <View>
            <ThemedText type="title" style={styles.mainTitle}>
              Statistics
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Global Digital Trends 2026
            </ThemedText>
          </View>
          <TouchableOpacity
            style={styles.favCircle}
            onPress={() => router.push("/modal")}
          >
            <Heart size={20} color="#FF3B30" fill="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[2]}
      >
        <View style={styles.featuredCard}>
          <View style={styles.featuredHeader}>
            <TrendingUp size={20} color="#fff" />
            <ThemedText style={styles.featuredTag}>FEATURED INSIGHT</ThemedText>
          </View>
          <ThemedText style={styles.featuredTitle}>
            Global Internet penetration grew by 4% this year.
          </ThemedText>
          <ThemedText style={styles.featuredDesc}>
            Explore how different regions are connecting.
          </ThemedText>
        </View>

        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#8e8e93" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search country..."
              placeholderTextColor="#8e8e93"
              value={search}
              onChangeText={setSearch}
            />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.regionScroll}
          >
            {REGIONS.map((region) => (
              <TouchableOpacity
                key={region}
                style={[
                  styles.regionChip,
                  selectedRegion === region && styles.activeChip,
                ]}
                onPress={() => setSelectedRegion(region)}
              >
                <ThemedText
                  style={[
                    styles.regionText,
                    selectedRegion === region && styles.activeChipText,
                  ]}
                >
                  {region}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        ) : error ? (
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        ) : (
          <View style={styles.listWrapper}>
            {filteredCountries.slice(0, 100).map((country) => (
              <View key={country.id}>{renderItem({ item: country })}</View>
            ))}
          </View>
        )}
      </ScrollView>
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
  headerTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mainTitle: {
    fontSize: 28,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 14,
    color: "#8e8e93",
    marginTop: 2,
  },
  favCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featuredCard: {
    backgroundColor: "#007AFF",
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
  },
  featuredHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  featuredTag: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    marginLeft: 6,
  },
  featuredTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  featuredDesc: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
  },
  searchSection: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f7",
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  regionScroll: {
    marginBottom: 20,
  },
  regionChip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f2f2f7",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  activeChip: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  regionText: {
    fontSize: 14,
    color: "#8e8e93",
    fontWeight: "600",
  },
  activeChipText: {
    color: "#fff",
  },
  listWrapper: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f2f2f7",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#e5f1ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  countryName: {
    fontSize: 16,
    color: "#1c1c1e",
  },
  region: {
    fontSize: 13,
    color: "#8e8e93",
    marginTop: 2,
  },
  loaderContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});
