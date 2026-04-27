import {
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { ChampionCard } from "../components/stronghold/ChampionCard";
import { championDefinitions } from "../data/champions";
import { factionDefinitions } from "../data/factions";
import { useGameStore } from "../store/useGameStore";

const isWeb = Platform.OS === "web";

export function Stronghold() {
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
        <Text style={styles.title}>Stronghold</Text>
        <View style={styles.divider} />
        <Text style={styles.factionName}>{activeFaction.label}</Text>

        <View style={styles.list}>
          {visibleChampions.map((champion) => {
            const currentLevel = championLevels[champion.id] ?? 0;

            return (
              <ChampionCard
                key={champion.id}
                champion={champion}
                currentLevel={currentLevel}
                onUpgrade={() => upgradeChampion(champion.id)}
                resources={resources}
              />
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
});
