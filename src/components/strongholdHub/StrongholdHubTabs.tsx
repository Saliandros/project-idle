import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { theme } from "../../theme/theme";

type StrongholdHubTab = "champions" | "unlocks";

type StrongholdHubTabsProps = {
  activeTab: StrongholdHubTab;
  onTabChange: (tab: StrongholdHubTab) => void;
};

export function StrongholdHubTabs({ activeTab, onTabChange }: StrongholdHubTabsProps) {
  return (
    <View style={styles.tabRow}>
      <TouchableOpacity
        style={[styles.tabButton, activeTab === "champions" && styles.tabButtonActive]}
        onPress={() => onTabChange("champions")}
        activeOpacity={0.85}
      >
        <Text style={styles.tabButtonText}>Champions</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tabButton, activeTab === "unlocks" && styles.tabButtonActive]}
        onPress={() => onTabChange("unlocks")}
        activeOpacity={0.85}
      >
        <Text style={styles.tabButtonText}>Unlocks</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tabRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 16,
    gap: 10,
    backgroundColor: theme.colors.navColor,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255, 255, 255, 0.4)",
  },
  tabButton: {
    flex: 1,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  tabButtonActive: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  tabButtonText: {
    color: theme.colors.textPrimary,
    fontSize: 15,
    fontWeight: "700",
  },
});
