import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  ImageBackground,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { GameMessageModal } from "../components/GameMessageModal";
import { StrongholdFactionList } from "../components/strongholdHub/StrongholdFactionList";
import { StrongholdHubHeader } from "../components/strongholdHub/StrongholdHubHeader";
import { StrongholdHubTabs } from "../components/strongholdHub/StrongholdHubTabs";
import { StrongholdUnlockList } from "../components/strongholdHub/StrongholdUnlockList";
import { embassyUnlockOrder } from "../data/embassy";
import { factionDefinitions } from "../data/factions";
import { useGameStore } from "../store/useGameStore";
import { theme } from "../theme/theme";
import { fromRawResourceAmount } from "../utils/resources";

type FactionTab = "champions" | "unlocks";

const isWeb = Platform.OS === "web";

export function StrongholdHub() {
  const [activeTab, setActiveTab] = useState<FactionTab>("champions");
  const [showLockedModal, setShowLockedModal] = useState(false);
  const [lockedFactionName, setLockedFactionName] = useState("");
  const activeFactionId = useGameStore((state) => state.activeFactionId);
  const gold = useGameStore((state) => state.resources.gold);
  const unlockedFactionIds = useGameStore((state) => state.unlockedFactionIds);
  const setActiveFaction = useGameStore((state) => state.setActiveFaction);
  const unlockFaction = useGameStore((state) => state.unlockFaction);
  const goldAmount = fromRawResourceAmount("gold", gold);

  const unlockRows = useMemo(
    () =>
      embassyUnlockOrder
        .map((factionId) =>
          factionDefinitions.find((entry) => entry.id === factionId),
        )
        .filter((faction): faction is (typeof factionDefinitions)[number] =>
          Boolean(faction),
        ),
    [],
  );

  const handleFactionPress = (
    factionId: (typeof factionDefinitions)[number]["id"],
  ) => {
    const faction = factionDefinitions.find((entry) => entry.id === factionId);

    if (!faction) {
      return;
    }

    if (unlockedFactionIds.includes(factionId)) {
      setActiveFaction(factionId);

      if (faction.route) {
        router.push(faction.route);
      }

      return;
    }

    setLockedFactionName(faction.lockedName);
    setShowLockedModal(true);
  };

  const handleUnlockPress = (
    factionId: (typeof factionDefinitions)[number]["id"],
  ) => {
    const faction = factionDefinitions.find((entry) => entry.id === factionId);

    if (!faction) {
      return;
    }

    if (unlockedFactionIds.includes(factionId)) {
      return;
    }

    const didUnlock = unlockFaction(factionId);

    if (!didUnlock) {
      setLockedFactionName(faction.lockedName);
      setShowLockedModal(true);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/Factions/Lizardman/Shattered Isles Map.png")}
      style={styles.background}
      imageStyle={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <StrongholdHubHeader goldAmount={goldAmount} isWeb={isWeb} />
        <StrongholdHubTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "champions" ? (
          <StrongholdFactionList
            activeFactionId={activeFactionId}
            factions={factionDefinitions}
            isWeb={isWeb}
            onFactionPress={handleFactionPress}
            unlockedFactionIds={unlockedFactionIds}
          />
        ) : (
          <StrongholdUnlockList
            factions={unlockRows}
            isWeb={isWeb}
            onUnlockPress={handleUnlockPress}
            unlockedFactionIds={unlockedFactionIds}
          />
        )}

        <GameMessageModal
          visible={showLockedModal}
          title="FACTION LOCKED"
          message={`${lockedFactionName} are still Locked`}
          subtext={`You need more gold to unlock ${lockedFactionName}`}
          onClose={() => setShowLockedModal(false)}
        />
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
  },
});
