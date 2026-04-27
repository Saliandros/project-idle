import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { theme } from "../../theme/theme";
import { formatDisplayNumber } from "../../utils/formatNumber";

type FrontpageHeaderProps = {
  activeFactionLabel: string;
  isWeb: boolean;
  onOpenFactionPicker: () => void;
  primaryResourceAmount: number;
  goldAmount: number;
};

export function FrontpageHeader({
  activeFactionLabel,
  isWeb,
  onOpenFactionPicker,
  primaryResourceAmount,
  goldAmount,
}: FrontpageHeaderProps) {
  return (
    <View style={styles.headerSection}>
      <TouchableOpacity
        style={styles.factionTrigger}
        activeOpacity={0.85}
        onPress={onOpenFactionPicker}
      >
        <View style={styles.factionTriggerTextWrap}>
          <Text style={styles.factionTriggerEyebrow}>Active Faction</Text>
          <Text style={[styles.title, isWeb && styles.titleWeb]}>{activeFactionLabel}</Text>
        </View>
        <Text style={styles.factionTriggerChevron}>v</Text>
      </TouchableOpacity>

      <View style={styles.resourceSection}>
        <View style={styles.resourceItem}>
          <Text style={[styles.resourceValue, isWeb && styles.resourceValueWeb]}>
            {Math.floor(primaryResourceAmount)}
          </Text>
          <Image
            source={require("../../../assets/images/Factions/Lizardman/Lizardman clicker icon.png")}
            style={styles.resourceIcon}
          />
        </View>
        <View style={styles.resourceItem}>
          <Text style={[styles.resourceValue, isWeb && styles.resourceValueWeb]}>
            {formatDisplayNumber(goldAmount)}
          </Text>
          <Image
            source={require("../../../assets/images/General/coin.png")}
            style={styles.resourceIcon}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerSection: {
    paddingTop: 50,
    paddingHorizontal: 16,
    alignItems: "flex-start",
  },
  factionTrigger: {
    minWidth: 220,
    minHeight: 68,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: "rgba(233, 215, 172, 0.24)",
  },
  factionTriggerTextWrap: {
    gap: 4,
  },
  factionTriggerEyebrow: {
    color: "rgba(233, 215, 172, 0.76)",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  factionTriggerChevron: {
    color: "#E9D7AC",
    fontSize: 18,
    fontWeight: "700",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  titleWeb: {
    fontSize: 32,
  },
  resourceSection: {
    flexDirection: "column",
    gap: 8,
  },
  resourceItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  resourceIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  resourceValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  resourceValueWeb: {
    fontSize: 18,
  },
});
