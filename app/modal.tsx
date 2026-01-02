import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useRouter } from "expo-router";
import { ChevronRight, Edit3, Globe, Trash2 } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import {
  removeFavorite,
  updateFavoriteNote,
} from "../store/slices/favoritesSlice";

export default function FavoritesScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const favorites = useSelector((state: RootState) => state.favorites.items);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const handleDelete = (id: string) => {
    Alert.alert("Remove", "Remove from favorites?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        onPress: () => dispatch(removeFavorite(id)),
        style: "destructive",
      },
    ]);
  };

  const startEditing = (id: string, currentNote: string) => {
    setEditingId(id);
    setNote(currentNote);
  };

  const saveNote = (id: string) => {
    dispatch(updateFavoriteNote({ id, notes: note }));
    setEditingId(null);
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.cardHeader}
        onPress={() => {
          router.dismissAll();
          router.push(`/country/${item.id}`);
        }}
      >
        <View style={styles.iconContainer}>
          <Globe size={20} color="#007AFF" />
        </View>
        <ThemedText type="defaultSemiBold" style={styles.countryName}>
          {item.name}
        </ThemedText>
        <ChevronRight size={18} color="#ccc" />
      </TouchableOpacity>

      <View style={styles.noteContainer}>
        {editingId === item.id ? (
          <View style={styles.editContainer}>
            <TextInput
              style={styles.input}
              value={note}
              onChangeText={setNote}
              placeholder="Add a note..."
              autoFocus
            />
            <TouchableOpacity
              onPress={() => saveNote(item.id)}
              style={styles.saveBtn}
            >
              <ThemedText style={styles.saveBtnText}>Save</ThemedText>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.noteRow}>
            <ThemedText style={styles.noteText}>
              {item.notes || "No notes added"}
            </ThemedText>
            <View style={styles.actionRow}>
              <TouchableOpacity
                onPress={() => startEditing(item.id, item.notes)}
                style={styles.actionIcon}
              >
                <Edit3 size={18} color="#8e8e93" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelete(item.id)}
                style={styles.actionIcon}
              >
                <Trash2 size={18} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>
            No favorites yet. Add some from the country details!
          </ThemedText>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f7",
    marginBottom: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e5f1ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  countryName: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  noteContainer: {
    minHeight: 40,
  },
  noteRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  noteText: {
    flex: 1,
    fontSize: 14,
    color: "#8e8e93",
    fontStyle: "italic",
  },
  actionRow: {
    flexDirection: "row",
  },
  actionIcon: {
    padding: 8,
    marginLeft: 8,
  },
  editContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#f2f2f7",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: "#000",
  },
  saveBtn: {
    marginLeft: 10,
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    opacity: 0.5,
    fontSize: 16,
  },
});
