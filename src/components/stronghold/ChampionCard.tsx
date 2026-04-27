import { Image, ImageBackground, Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { ChampionDefinition, ResourceId, ResourceState } from "../../types/game";
import { formatDisplayNumber } from "../../utils/formatNumber";
import { toRawResourceAmount } from "../../utils/resources";
import { theme } from "../../theme/theme";

type ChampionCardProps = {
  champion: ChampionDefinition;
  currentLevel: number;
  onUpgrade: () => void;
  resources: ResourceState;
};

const isWeb = Platform.OS === "web";
const COST_MULTIPLIER = 1.5;
const resourceIcons: Partial<Record<ResourceId, number>> = {
  gold: require("../../../assets/images/General/coin.png"),
  iron: require("../../../assets/images/General/coin.png"),
  meat: require("../../../assets/images/General/meat.png"),
};

export function ChampionCard({
  champion,
  currentLevel,
  onUpgrade,
  resources,
}: ChampionCardProps) {
  const productionPerSecond =
    currentLevel <= 0
      ? 0
      : champion.baseProductionPerSecond +
        champion.productionScalingPerLevel * (currentLevel - 1);
  const nextCost = Math.round(champion.baseCost * Math.pow(COST_MULTIPLIER, currentLevel));
  const canUpgrade =
    resources[champion.costResourceId] >=
    toRawResourceAmount(champion.costResourceId, nextCost);
  const costIcon =
    resourceIcons[champion.costResourceId] ??
    require("../../../assets/images/General/coin.png");

  const previewContent = (
    <View style={styles.previewOverlay}>
      <Text style={styles.championName}>{champion.name}</Text>
      <View style={styles.statStack}>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Idle:</Text>
          <Text style={styles.statValue}>
            {formatDisplayNumber(productionPerSecond)}/sec
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.row}>
      <View style={styles.contentCol}>
        {champion.previewImage ? (
          <ImageBackground
            source={champion.previewImage}
            style={styles.championPreview}
            imageStyle={styles.championPreviewImage}
            resizeMode="cover"
          >
            {previewContent}
          </ImageBackground>
        ) : (
          <View style={styles.championPreviewEmpty}>{previewContent}</View>
        )}

        <View style={styles.actionBar}>
          <Pressable
            style={({ pressed }) => [
              styles.levelUpButton,
              !canUpgrade && styles.levelUpButtonDisabled,
              pressed && canUpgrade && styles.levelUpButtonPressed,
            ]}
            onPress={onUpgrade}
            disabled={!canUpgrade}
          >
            <Text style={styles.levelUpButtonText}>Level Up</Text>
            <View style={styles.levelUpCostRow}>
              <Image source={costIcon} style={styles.costIcon} />
              <Text style={styles.levelUpCostText}>{nextCost}</Text>
            </View>
          </Pressable>
        </View>
      </View>

      <View style={styles.levelCol}>
        <Text style={styles.levelLabel}>LEVEL</Text>
        <Text style={styles.levelValue}>{currentLevel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 132,
    flexDirection: "row",
    backgroundColor: theme.colors.background,
    overflow: "hidden",
  },
  contentCol: {
    flex: 1,
  },
  championPreview: {
    flex: 1,
  },
  championPreviewImage: {
    width: "100%",
    height: "100%",
    opacity: 0.92,
  },
  championPreviewEmpty: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
  },
  previewOverlay: {
    flex: 1,
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    justifyContent: "space-between",
  },
  championName: {
    fontSize: isWeb ? 16 : 15,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  statStack: {
    gap: 6,
  },
  statRow: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statLabel: {
    color: "rgba(233, 215, 172, 0.88)",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.7,
    textTransform: "uppercase",
  },
  statValue: {
    color: "#FFFFFF",
    fontSize: isWeb ? 14 : 13,
    fontWeight: "800",
  },
  actionBar: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "rgba(0, 0, 0, 0.36)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.16)",
  },
  levelUpButton: {
    minHeight: 44,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    backgroundColor: "rgba(226, 212, 178, 0.98)",
    borderWidth: 2,
    borderTopColor: "#FFF2C6",
    borderLeftColor: "#FFF2C6",
    borderRightColor: "#71542F",
    borderBottomColor: "#71542F",
  },
  levelUpButtonDisabled: {
    opacity: 0.45,
  },
  levelUpButtonPressed: {
    opacity: 0.82,
  },
  levelUpButtonText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#2C1D0C",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  levelUpCostRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  costIcon: {
    width: 14,
    height: 14,
  },
  levelUpCostText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#2C1D0C",
  },
  levelCol: {
    width: 95,
    alignItems: "center",
    justifyContent: "center",
    borderLeftWidth: 1,
    borderLeftColor: "rgba(255, 255, 255, 0.7)",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  levelLabel: {
    fontSize: isWeb ? 17 : 16,
    color: "#FFFFFF",
    fontWeight: "400",
  },
  levelValue: {
    fontSize: isWeb ? 15 : 14,
    color: "#FFFFFF",
  },
});
