import { useMemo, useState } from "react";
import {
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { GameMessageModal } from "../components/GameMessageModal";
import { EmbassyInvoiceSummary } from "../components/embassy/EmbassyInvoiceSummary";
import { EmbassyResourceSelector } from "../components/embassy/EmbassyResourceSelector";
import { EmbassyTradeControls } from "../components/embassy/EmbassyTradeControls";

import { embassyResourceOptions } from "../data/embassy";
import { useGameStore } from "../store/useGameStore";
import { theme } from "../theme/theme";
import { ResourceId } from "../types/game";
import { fromRawResourceAmount } from "../utils/resources";

const isWeb = Platform.OS === "web";

const resourceIcons: Partial<Record<ResourceId, number>> = {
  gold: require("../../assets/images/General/coin.png"),
  iron: require("../../assets/images/General/coin.png"),
  meat: require("../../assets/images/General/meat.png"),
};

export function EmbassyExchange() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedResourceId, setSelectedResourceId] =
    useState<ResourceId>("meat");
  const [tradeDrafts, setTradeDrafts] = useState<
    Partial<Record<ResourceId, string>>
  >({});
  const [showTradeErrorModal, setShowTradeErrorModal] = useState(false);
  const resources = useGameStore((state) => state.resources);
  const exchangeResource = useGameStore((state) => state.exchangeResource);

  const selectedResource =
    embassyResourceOptions.find((option) => option.id === selectedResourceId) ??
    embassyResourceOptions[0];
  const selectedTradeAmount = Math.max(
    0,
    Number.parseInt(tradeDrafts[selectedResource.id] ?? "", 10) || 0,
  );
  const selectedResourceOwnedAmount = Math.floor(
    fromRawResourceAmount(selectedResource.id, resources[selectedResource.id]),
  );

  const invoiceRows = useMemo(
    () =>
      embassyResourceOptions.map((option) => {
        const rawInput = tradeDrafts[option.id] ?? "";
        const amount = Math.max(0, Number.parseInt(rawInput, 10) || 0);
        const goldValue =
          Math.floor(amount / option.exchangeAmount) * option.goldYield;

        return {
          ...option,
          amount,
          goldValue,
          hasDraft: rawInput.trim().length > 0 && amount > 0,
        };
      }),
    [tradeDrafts],
  );

  const activeInvoiceRows = invoiceRows.filter((row) => row.hasDraft);
  const totalGoldValue = activeInvoiceRows.reduce(
    (sum, row) => sum + row.goldValue,
    0,
  );
  const hasTradeDraft = activeInvoiceRows.length > 0;

  const handleAccept = () => {
    const didAnyExchange = activeInvoiceRows.reduce((didExchange, row) => {
      const exchanged = exchangeResource(row.id, row.amount);
      return didExchange || exchanged;
    }, false);

    if (!didAnyExchange) {
      setShowTradeErrorModal(true);
      return;
    }

    setTradeDrafts({});
  };

  const handleSelectResource = (resourceId: ResourceId) => {
    setSelectedResourceId(resourceId);
    setIsDropdownOpen(false);
  };

  const handleTradeDraftChange = (resourceId: ResourceId, value: string) => {
    const ownedAmount = Math.floor(
      fromRawResourceAmount(resourceId, resources[resourceId]),
    );
    const parsedValue = Math.max(0, Number.parseInt(value, 10) || 0);
    const clampedValue = Math.min(parsedValue, ownedAmount);

    setTradeDrafts((current) => ({
      ...current,
      [resourceId]: clampedValue === 0 ? "" : String(clampedValue),
    }));
  };

  const tradeErrorMessage = hasTradeDraft
    ? "You dont have enough resources to complete this trade"
    : "Add at least one resource line before accepting the trade";

  return (
    <ImageBackground
      source={require("../../assets/images/Factions/Lizardman/Shattered Isles Map.png")}
      style={styles.background}
      imageStyle={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.mapDimmer} pointerEvents="none" />
      <View style={styles.overlay}>
        <Text style={styles.title}>Embassy Exchange</Text>

        <View style={[styles.mainContent, isWeb && styles.mainContentWeb]}>
          <ImageBackground
            source={require("../../assets/images/Backgrounds/TradeBG.png")}
            style={[styles.exchangePanel, isWeb && styles.exchangePanelWeb]}
            imageStyle={styles.exchangePanelImage}
            resizeMode="cover"
          >
            <View style={styles.exchangePanelOverlay} />
            <View style={styles.exchangePanelContent}>
              <EmbassyResourceSelector
                isDropdownOpen={isDropdownOpen}
                onSelectResource={handleSelectResource}
                onToggle={() => setIsDropdownOpen((prev) => !prev)}
                options={embassyResourceOptions}
                selectedLabel={selectedResource.label}
              />

              <EmbassyInvoiceSummary
                activeInvoiceRows={activeInvoiceRows}
                hasTradeDraft={hasTradeDraft}
                totalGoldValue={totalGoldValue}
                resourceIcons={resourceIcons}
              />

              <EmbassyTradeControls
                onAccept={handleAccept}
                onValueChange={(value) =>
                  handleTradeDraftChange(
                    selectedResource.id,
                    value === 0 ? "" : String(value),
                  )
                }
                selectedResourceAmountOwned={selectedResourceOwnedAmount}
                selectedResourceExchangeAmount={selectedResource.exchangeAmount}
                selectedResourceLabel={selectedResource.label}
                selectedTradeAmount={selectedTradeAmount}
              />
            </View>
          </ImageBackground>
        </View>

        <GameMessageModal
          visible={showTradeErrorModal}
          title="TRADE FAILED"
          message={tradeErrorMessage}
          onClose={() => setShowTradeErrorModal(false)}
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
    backgroundColor: "transparent",
    paddingTop: isWeb ? 20 : 50,
  },
  mapDimmer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.28)",
  },
  title: {
    fontSize: isWeb ? 32 : 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 30,
    marginLeft: 20,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  mainContentWeb: {
    paddingHorizontal: 0,
    paddingBottom: 0,
  },
  exchangePanel: {
    flex: 1,
    overflow: "hidden",
  },
  exchangePanelWeb: {
    width: "100%",
  },
  exchangePanelImage: {
    opacity: 0.95,
  },
  exchangePanelOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.background,
  },
  exchangePanelContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
  },
});
