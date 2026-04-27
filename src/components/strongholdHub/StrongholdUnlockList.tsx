import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { FactionDefinition } from "../../types/game";

type StrongholdUnlockListProps = {
  factions: FactionDefinition[];
  isWeb: boolean;
  onUnlockPress: (factionId: FactionDefinition["id"]) => void;
  unlockedFactionIds: FactionDefinition["id"][];
};

const platformIsWeb = Platform.OS === "web";

export function StrongholdUnlockList({
  factions,
  isWeb,
  onUnlockPress,
  unlockedFactionIds,
}: StrongholdUnlockListProps) {
  return (
    <ScrollView
      style={styles.unlockList}
      contentContainerStyle={styles.unlockListContent}
      showsVerticalScrollIndicator={platformIsWeb}
    >
      {factions
        .sort(
          (a, b) =>
            Number(unlockedFactionIds.includes(a.id)) -
            Number(unlockedFactionIds.includes(b.id)),
        )
        .map((faction) => {
          const isUnlocked = unlockedFactionIds.includes(faction.id);

          return (
            <TouchableOpacity
              key={faction.id}
              style={[
                styles.unlockRow,
                isUnlocked ? styles.unlockRowUnlocked : styles.unlockRowLocked,
              ]}
              activeOpacity={0.8}
              onPress={isUnlocked ? undefined : () => onUnlockPress(faction.id)}
            >
              <View>
                <Text
                  style={[
                    styles.unlockText,
                    isWeb && styles.unlockTextWeb,
                    isUnlocked && styles.unlockTextUnlocked,
                  ]}
                >
                  {isUnlocked ? "Unlocked" : "Unlock"}
                  {"\n"}
                  {faction.label}
                </Text>
              </View>
              <View style={styles.unlockCost}>
                {isUnlocked ? (
                  <Text style={[styles.unlockStatus, isWeb && styles.unlockStatusWeb]}>Ready</Text>
                ) : (
                  <>
                    <Image
                      source={require("../../../assets/images/General/coin.png")}
                      style={styles.unlockCoin}
                    />
                    <Text style={[styles.unlockAmount, isWeb && styles.unlockAmountWeb]}>
                      {faction.unlockCostGold}
                    </Text>
                  </>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  unlockList: {
    flex: 1,
  },
  unlockListContent: {
    paddingBottom: 24,
  },
  unlockRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.65)",
  },
  unlockRowLocked: {
    backgroundColor: "rgba(142, 54, 54, 0.6)",
  },
  unlockRowUnlocked: {
    backgroundColor: "rgba(69, 142, 54, 0.7)",
  },
  unlockText: {
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 18,
    color: "#FFFFFF",
  },
  unlockTextWeb: {
    fontSize: 16,
    lineHeight: 19,
  },
  unlockTextUnlocked: {
    fontWeight: "700",
  },
  unlockCost: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  unlockCoin: {
    width: 24,
    height: 24,
  },
  unlockAmount: {
    fontSize: 15,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  unlockAmountWeb: {
    fontSize: 16,
  },
  unlockStatus: {
    fontSize: 14,
    color: "#E7FFE3",
    fontWeight: "700",
  },
  unlockStatusWeb: {
    fontSize: 15,
  },
});
