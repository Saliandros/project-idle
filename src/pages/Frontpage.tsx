import { router } from "expo-router";
import { useState } from "react";
import {
  ImageBackground,
  Platform,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { FactionPickerModal } from "../components/FactionPickerModal";
import { GameMessageModal } from "../components/GameMessageModal";
import { FrontpageClicker } from "../components/frontpage/FrontpageClicker";
import { FrontpageHeader } from "../components/frontpage/FrontpageHeader";
import { FrontpageSidebar } from "../components/frontpage/FrontpageSidebar";
import { useAuth } from "../context/AuthContext";
import { useBottomNavInset } from "../context/BottomNavInsetContext";
import { embassyUnlockOrder } from "../data/embassy";
import { factionDefinitions } from "../data/factions";
import { resetGameProgress } from "../services/gameProgress";
import { useGameStore } from "../store/useGameStore";
import { theme } from "../theme/theme";
import { FactionDefinition } from "../types/game";
import { fromRawResourceAmount } from "../utils/resources";

type DesktopFactionTab = "champions" | "unlocks";

const isWeb = Platform.OS === "web";

export function Frontpage() {
  const [scale, setScale] = useState(1);
  const [showLockedModal, setShowLockedModal] = useState(false);
  const [showFactionPicker, setShowFactionPicker] = useState(false);
  const [desktopFactionTab, setDesktopFactionTab] =
    useState<DesktopFactionTab>("champions");
  const [lockedFactionName, setLockedFactionName] = useState("");
  const [lockedModalMessage, setLockedModalMessage] = useState("");
  const [lockedModalSubtext, setLockedModalSubtext] = useState("");
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  const [showResetResultModal, setShowResetResultModal] = useState(false);
  const [resetResultMessage, setResetResultMessage] = useState("");
  const [resetResultSubtext, setResetResultSubtext] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const { width } = useWindowDimensions();
  const { bottomNavHeight } = useBottomNavInset();
  const { currentUser } = useAuth();
  const isDesktopWeb = Platform.OS === "web" && width >= 1024;
  const gold = useGameStore((state) => state.resources.gold);
  const performClick = useGameStore((state) => state.performClick);
  const activeFactionId = useGameStore((state) => state.activeFactionId);
  const unlockedFactionIds = useGameStore((state) => state.unlockedFactionIds);
  const setActiveFaction = useGameStore((state) => state.setActiveFaction);
  const resetGameState = useGameStore((state) => state.resetGameState);
  const unlockFaction = useGameStore((state) => state.unlockFaction);
  const activeFaction =
    factionDefinitions.find((entry) => entry.id === activeFactionId) ??
    factionDefinitions[0];
  const primaryResourceAmount = useGameStore((state) =>
    fromRawResourceAmount(
      activeFaction.clickResourceId,
      state.resources[activeFaction.clickResourceId],
    ),
  );
  const goldAmount = fromRawResourceAmount("gold", gold);
  const desktopUnlockRows = embassyUnlockOrder
    .map((factionId) =>
      factionDefinitions.find((entry) => entry.id === factionId),
    )
    .filter((entry): entry is (typeof factionDefinitions)[number] =>
      Boolean(entry),
    );

  const handleFactionPickerSelect = (entry: FactionDefinition) => {
    if (unlockedFactionIds.includes(entry.id)) {
      setActiveFaction(entry.id);
      setShowFactionPicker(false);
      return;
    }

    setShowFactionPicker(false);
    setLockedFactionName(entry.lockedName);
    setLockedModalMessage(`${entry.lockedName} Faction is still Locked`);
    setLockedModalSubtext(
      `Raise your standing with ${entry.lockedName} to be able to purchase "unlock"`,
    );
    setShowLockedModal(true);
  };

  const handleClick = () => {
    performClick();
    setScale(1.1);
    setTimeout(() => setScale(1), 100);
  };

  const handleFactionPress = (entry: (typeof factionDefinitions)[number]) => {
    if (unlockedFactionIds.includes(entry.id)) {
      setActiveFaction(entry.id);
    }

    if (entry.route) {
      router.push(entry.route);
      return;
    }

    setLockedFactionName(entry.lockedName);
    setLockedModalMessage(`${entry.lockedName} Faction is still Locked`);
    setLockedModalSubtext(
      `Raise your standing with ${entry.lockedName} to be able to purchase "unlock"`,
    );
    setShowLockedModal(true);
  };

  const handleUnlockPress = (entry: (typeof factionDefinitions)[number]) => {
    if (unlockedFactionIds.includes(entry.id)) {
      return;
    }

    const didUnlock = unlockFaction(entry.id);

    if (!didUnlock) {
      setLockedFactionName(entry.lockedName);
      setLockedModalMessage(`${entry.lockedName} are still Locked`);
      setLockedModalSubtext(`You need more gold to unlock ${entry.lockedName}`);
      setShowLockedModal(true);
    }
  };

  const handleResetGame = async () => {
    const profileId = typeof currentUser?.id === "string" ? currentUser.id : null;

    if (!profileId || isResetting) {
      return;
    }

    setIsResetting(true);

    try {
      resetGameState();
      await resetGameProgress(profileId);
      setShowResetConfirmModal(false);
      setResetResultMessage("Your game has been reset.");
      setResetResultSubtext("You are back at the starting faction with starting resources.");
      setShowResetResultModal(true);
    } catch (error) {
      setResetResultMessage("Reset failed.");
      setResetResultSubtext(
        error instanceof Error ? error.message : "Could not reset your saved progress.",
      );
      setShowResetResultModal(true);
    } finally {
      setIsResetting(false);
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
        <View
          style={[
            styles.shell,
            isDesktopWeb && styles.shellDesktop,
            isDesktopWeb && { paddingBottom: Math.max(bottomNavHeight, 96) },
          ]}
        >
          <View style={styles.mainColumn}>
            <FrontpageHeader
              activeFactionLabel={activeFaction.label}
              isWeb={isWeb}
              onOpenFactionPicker={() => setShowFactionPicker(true)}
              onResetGame={() => setShowResetConfirmModal(true)}
              primaryResourceAmount={primaryResourceAmount}
              goldAmount={goldAmount}
            />
            <FrontpageClicker scale={scale} onPress={handleClick} />
          </View>

          {isDesktopWeb ? (
            <FrontpageSidebar
              activeFactionId={activeFactionId}
              bottomInset={bottomNavHeight}
              desktopFactionTab={desktopFactionTab}
              goldAmount={goldAmount}
              onFactionPress={handleFactionPress}
              onTabChange={setDesktopFactionTab}
              onUnlockPress={handleUnlockPress}
              rows={desktopUnlockRows}
              unlockedFactionIds={unlockedFactionIds}
            />
          ) : null}
        </View>
      </View>

      <FactionPickerModal
        visible={showFactionPicker}
        activeFactionId={activeFactionId}
        factions={factionDefinitions}
        unlockedFactionIds={unlockedFactionIds}
        onClose={() => setShowFactionPicker(false)}
        onSelect={handleFactionPickerSelect}
      />

      <GameMessageModal
        visible={showLockedModal}
        title="FACTION LOCKED"
        message={lockedModalMessage}
        subtext={lockedModalSubtext}
        onClose={() => setShowLockedModal(false)}
      />

      <GameMessageModal
        visible={showResetConfirmModal}
        title="RESET GAME"
        message="Start the game over from the beginning?"
        subtext="This will overwrite your current progress for this account."
        actionLabel={isResetting ? "RESETTING..." : "RESET"}
        actionDisabled={isResetting}
        onClose={() => {
          void handleResetGame();
        }}
        onSecondaryAction={() => setShowResetConfirmModal(false)}
        secondaryActionLabel="CANCEL"
      />

      <GameMessageModal
        visible={showResetResultModal}
        title="RESET STATUS"
        message={resetResultMessage}
        subtext={resetResultSubtext}
        onClose={() => setShowResetResultModal(false)}
      />
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
  },
  shell: {
    flex: 1,
  },
  shellDesktop: {
    flexDirection: "row",
    gap: 0,
  },
  mainColumn: {
    flex: 1,
  },
});
