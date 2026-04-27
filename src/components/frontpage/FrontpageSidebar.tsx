import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { FactionDefinition } from "../../types/game";
import { formatDisplayNumber } from "../../utils/formatNumber";

type DesktopFactionTab = "champions" | "unlocks";

type FrontpageSidebarProps = {
  activeFactionId: FactionDefinition["id"];
  desktopFactionTab: DesktopFactionTab;
  goldAmount: number;
  onFactionPress: (entry: FactionDefinition) => void;
  onTabChange: (tab: DesktopFactionTab) => void;
  onUnlockPress: (entry: FactionDefinition) => void;
  rows: FactionDefinition[];
  unlockedFactionIds: FactionDefinition["id"][];
};

const isWeb = Platform.OS === "web";

export function FrontpageSidebar({
  activeFactionId,
  desktopFactionTab,
  goldAmount,
  onFactionPress,
  onTabChange,
  onUnlockPress,
  rows,
  unlockedFactionIds,
}: FrontpageSidebarProps) {
  return (
    <View style={styles.sidePanel}>
      <View style={styles.sidePanelHeader}>
        <Text style={styles.sidePanelTitle}>Stronghold</Text>
        <View style={styles.sidePanelGoldWrap}>
          <Image
            source={require("../../../assets/images/General/coin.png")}
            style={styles.sidePanelGoldIcon}
          />
          <Text style={styles.sidePanelGoldText}>{formatDisplayNumber(goldAmount)}</Text>
        </View>
      </View>

      <View style={styles.sidePanelTabs}>
        <TouchableOpacity
          style={[
            styles.sidePanelTabButton,
            desktopFactionTab === "champions" && styles.sidePanelTabButtonActive,
          ]}
          activeOpacity={0.85}
          onPress={() => onTabChange("champions")}
        >
          <Text style={styles.sidePanelTabButtonText}>Champions</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sidePanelTabButton,
            desktopFactionTab === "unlocks" && styles.sidePanelTabButtonActive,
          ]}
          activeOpacity={0.85}
          onPress={() => onTabChange("unlocks")}
        >
          <Text style={styles.sidePanelTabButtonText}>Unlocks</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sidePanelList}>
        {desktopFactionTab === "champions"
          ? rows.map((entry) => {
              const isUnlocked = unlockedFactionIds.includes(entry.id);
              const isCurrent = activeFactionId === entry.id;

              return (
                <TouchableOpacity
                  key={entry.label}
                  style={[
                    styles.sidePanelRow,
                    isUnlocked ? styles.sidePanelRowActive : styles.sidePanelRowLocked,
                    isCurrent && styles.sidePanelRowCurrent,
                  ]}
                  activeOpacity={0.85}
                  onPress={() => onFactionPress(entry)}
                >
                  <View style={styles.sidePanelRowContent}>
                    <Text style={styles.sidePanelRowTitle}>{entry.label}</Text>
                    <Text style={styles.sidePanelRowMeta}>
                      {isCurrent ? "Current" : isUnlocked ? "Active" : "Locked"}
                    </Text>
                  </View>
                  <Text style={styles.sidePanelRowArrow}>{">"}</Text>
                </TouchableOpacity>
              );
            })
          : rows
              .sort(
                (a, b) =>
                  Number(unlockedFactionIds.includes(a.id)) -
                  Number(unlockedFactionIds.includes(b.id)),
              )
              .map((entry) => {
                const isUnlocked = unlockedFactionIds.includes(entry.id);

                return (
                  <TouchableOpacity
                    key={entry.id}
                    style={[
                      styles.sidePanelRow,
                      isUnlocked ? styles.sidePanelRowActive : styles.sidePanelRowLocked,
                    ]}
                    activeOpacity={0.85}
                    onPress={isUnlocked ? undefined : () => onUnlockPress(entry)}
                  >
                    <View style={styles.sidePanelRowContent}>
                      <Text style={styles.sidePanelRowTitle}>{entry.label}</Text>
                      {isUnlocked ? (
                        <Text style={styles.sidePanelRowMeta}>Unlocked</Text>
                      ) : (
                        <View style={styles.sidePanelUnlockCost}>
                          <Image
                            source={require("../../../assets/images/General/coin.png")}
                            style={styles.sidePanelUnlockCostIcon}
                          />
                          <Text style={styles.sidePanelRowMeta}>{entry.unlockCostGold}</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.sidePanelRowArrow}>{isUnlocked ? "OK" : ">"}</Text>
                  </TouchableOpacity>
                );
              })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidePanel: {
    width: 320,
    alignSelf: "stretch",
    paddingTop: 20,
    justifyContent: "flex-start",
    backgroundColor: "rgba(6, 18, 14, 0.74)",
    ...(isWeb
      ? { boxShadow: "0 16px 24px rgba(0, 0, 0, 0.24)" }
      : {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 16 },
          shadowOpacity: 0.24,
          shadowRadius: 24,
        }),
  },
  sidePanelHeader: {
    paddingHorizontal: 22,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  sidePanelTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
  },
  sidePanelGoldWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sidePanelGoldIcon: {
    width: 18,
    height: 18,
  },
  sidePanelGoldText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  sidePanelTabs: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 10,
  },
  sidePanelTabButton: {
    flex: 1,
    minHeight: 46,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  sidePanelTabButtonActive: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  sidePanelTabButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  sidePanelList: {
    gap: 0,
  },
  sidePanelRow: {
    minHeight: 78,
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.65)",
  },
  sidePanelRowActive: {
    backgroundColor: "rgba(69, 142, 54, 0.6)",
  },
  sidePanelRowLocked: {
    backgroundColor: "rgba(142, 54, 54, 0.6)",
  },
  sidePanelRowCurrent: {
    backgroundColor: "rgba(69, 142, 54, 0.8)",
  },
  sidePanelRowContent: {
    gap: 6,
  },
  sidePanelUnlockCost: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sidePanelUnlockCostIcon: {
    width: 14,
    height: 14,
  },
  sidePanelRowTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  sidePanelRowMeta: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  sidePanelRowArrow: {
    color: "#D8C48D",
    fontSize: 28,
    lineHeight: 28,
  },
});
