import {
  Image,
  ImageBackground,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AppRoute } from "../constants/routes";
import { championDefinitions } from "../data/champions";
import { factionDefinitions } from "../data/factions";
import { useGameStore } from "../store/useGameStore";
import { theme } from "../theme/theme";
import { toRawResourceAmount } from "../utils/resources";

type ChampionsProps = {
  onNavigate: (route: AppRoute) => void;
};

const isWeb = Platform.OS === "web";

export function Champions({ onNavigate: _onNavigate }: ChampionsProps) {
  const activeFactionId = useGameStore((state) => state.activeFactionId);
  const championLevels = useGameStore((state) => state.championLevels);
  const resources = useGameStore((state) => state.resources);
  const upgradeChampion = useGameStore((state) => state.upgradeChampion);
  const activeFaction =
    factionDefinitions.find((faction) => faction.id === activeFactionId) ??
    factionDefinitions[0];
  const visibleChampions = championDefinitions.filter(
    (champion) => champion.factionId === activeFaction.id,
  );

  return (
    <ImageBackground
      source={require("../../assets/images/Factions/Lizardman/Shattered Isles Map.png")}
      style={styles.background}
      imageStyle={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Factions</Text>
        <View style={styles.divider} />
        <Text style={styles.factionName}>{activeFaction.label}</Text>

        <View style={styles.list}>
          {visibleChampions.map((champion) => {
            const currentLevel = championLevels[champion.id] ?? 0;
            const nextCost = Math.round(
              champion.baseCost * Math.pow(1.5, currentLevel),
            );
            const canUpgrade =
              resources[champion.costResourceId] >=
              toRawResourceAmount(champion.costResourceId, nextCost);

            return (
              <View key={champion.id} style={styles.row}>
                <View style={styles.contentCol}>
                  {champion.previewImage ? (
                    <ImageBackground
                      source={champion.previewImage}
                      style={styles.championPreview}
                      imageStyle={styles.championPreviewImage}
                      resizeMode="cover"
                    >
                      <View style={styles.previewOverlay}>
                        <Text style={styles.championName}>{champion.name}</Text>
                        <View style={styles.priceRow}>
                          <Image
                            source={require("../../assets/images/General/meat.png")}
                            style={styles.meatIcon}
                          />
                          <Text style={styles.championPrice}>{nextCost}</Text>
                        </View>
                      </View>
                    </ImageBackground>
                  ) : (
                    <View style={styles.championPreviewEmpty}>
                      <View style={styles.previewOverlay}>
                        <Text style={styles.championName}>{champion.name}</Text>
                        <View style={styles.priceRow}>
                          <Image
                            source={require("../../assets/images/General/meat.png")}
                            style={styles.meatIcon}
                          />
                          <Text style={styles.championPrice}>{nextCost}</Text>
                        </View>
                      </View>
                    </View>
                  )}

                  <View style={styles.actionBar}>
                    <Pressable
                      style={({ pressed }) => [
                        styles.levelUpButton,
                        !canUpgrade && styles.levelUpButtonDisabled,
                        pressed && canUpgrade && styles.levelUpButtonPressed,
                      ]}
                      onPress={() => upgradeChampion(champion.id)}
                      disabled={!canUpgrade}
                    >
                      <Text style={styles.levelUpButtonText}>Level Up</Text>
                    </Pressable>
                  </View>
                </View>

                <View style={styles.levelCol}>
                  <Text style={styles.levelLabel}>LEVEL</Text>
                  <Text style={styles.levelValue}>{currentLevel}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  backgroundImage: {
    width: "130%",
    height: "130%",
    left: "-15%",
    top: "-15%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.28)",
    paddingTop: isWeb ? 20 : 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: isWeb ? 32 : 24,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.65)",
    marginTop: 8,
  },
  factionName: {
    fontSize: isWeb ? 22 : 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 10,
    marginBottom: 14,
  },
  list: {
    gap: 10,
  },
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
  championPrice: {
    fontSize: isWeb ? 14 : 13,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  actionBar: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "rgba(0, 0, 0, 0.36)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.16)",
  },
  meatIcon: {
    width: 16,
    height: 16,
  },
  levelUpButton: {
    minHeight: 38,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
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
