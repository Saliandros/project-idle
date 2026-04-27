import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { FactionDefinition } from "../../types/game";

type StrongholdFactionListProps = {
  activeFactionId: FactionDefinition["id"];
  factions: FactionDefinition[];
  isWeb: boolean;
  onFactionPress: (factionId: FactionDefinition["id"]) => void;
  unlockedFactionIds: FactionDefinition["id"][];
};

export function StrongholdFactionList({
  activeFactionId,
  factions,
  isWeb,
  onFactionPress,
  unlockedFactionIds,
}: StrongholdFactionListProps) {
  return (
    <View style={styles.container}>
      {factions.map((faction) => {
        const isUnlocked = unlockedFactionIds.includes(faction.id);
        const isActive = activeFactionId === faction.id;

        return (
          <TouchableOpacity
            key={faction.id}
            style={[
              styles.factionBox,
              isUnlocked ? styles.unlockedBox : styles.lockedBox,
              isActive && styles.activeFaction,
            ]}
            onPress={() => onFactionPress(faction.id)}
          >
            <Text
              style={[
                styles.factionText,
                isWeb && styles.factionTextWeb,
                isActive && styles.activeFactionText,
              ]}
            >
              {faction.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    gap: 0,
  },
  factionBox: {
    width: "100%",
    paddingVertical: 25,
    paddingHorizontal: 20,
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.65)",
  },
  unlockedBox: {
    backgroundColor: "rgba(69, 142, 54, 0.6)",
  },
  lockedBox: {
    backgroundColor: "rgba(142, 54, 54, 0.6)",
  },
  factionText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  factionTextWeb: {
    fontSize: 20,
  },
  activeFaction: {
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.65)",
    backgroundColor: "rgba(69, 142, 54, 0.8)",
  },
  activeFactionText: {
    fontWeight: "700",
  },
});
