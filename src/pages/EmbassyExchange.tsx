import { useMemo, useState } from "react";
import Slider from "@react-native-community/slider";
import {
  Image,
  ImageBackground,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { AppRoute } from "../constants/routes";
import { embassyResourceOptions } from "../data/embassy";
import { useGameStore } from "../store/useGameStore";
import { theme } from "../theme/theme";
import { ResourceId } from "../types/game";
import { formatDisplayNumber } from "../utils/formatNumber";
import { fromRawResourceAmount } from "../utils/resources";

type EmbassyExchangeProps = {
  onNavigate: (route: AppRoute) => void;
};

const isWeb = Platform.OS === "web";

const resourceIcons: Partial<Record<ResourceId, number>> = {
  gold: require("../../assets/images/General/coin.png"),
  iron: require("../../assets/images/General/coin.png"),
  meat: require("../../assets/images/General/meat.png"),
};

export function EmbassyExchange({
  onNavigate: _onNavigate,
}: EmbassyExchangeProps) {
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
              <View style={styles.selectorContainer}>
                <TouchableOpacity
                  style={styles.selectorBox}
                  onPress={() => setIsDropdownOpen((prev) => !prev)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.selectorText}>
                    {selectedResource.label}
                  </Text>
                  <Text style={styles.selectorChevron}>
                    {isDropdownOpen ? "^" : "v"}
                  </Text>
                </TouchableOpacity>

                {isDropdownOpen ? (
                  <View style={styles.dropdownMenu}>
                    {embassyResourceOptions.map((option) => (
                      <TouchableOpacity
                        key={option.id}
                        style={styles.dropdownOption}
                        onPress={() => handleSelectResource(option.id)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.dropdownOptionText}>
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : null}
              </View>

              <View style={styles.headerRow}>
                <Text style={styles.headerText}>Resources</Text>
                <Text style={styles.headerText}>Gold</Text>
              </View>

              <View style={styles.resourceRow}>
                {hasTradeDraft ? (
                  <>
                    <View style={styles.invoiceSummary}>
                      {activeInvoiceRows.map((row) => (
                        <View key={row.id} style={styles.invoiceSummaryRow}>
                          <Image
                            source={
                              resourceIcons[row.id] ?? resourceIcons.meat!
                            }
                            style={styles.resourceIcon}
                          />
                          <Text style={styles.resourceValue}>
                            {formatDisplayNumber(row.amount)} {row.label}
                          </Text>
                        </View>
                      ))}
                    </View>
                    <View style={styles.invoiceSummary}>
                      <View style={styles.invoiceSummaryRow}>
                        <Image
                          source={resourceIcons.gold!}
                          style={styles.resourceIcon}
                        />
                        <Text style={styles.resourceValue}>
                          {formatDisplayNumber(totalGoldValue)}
                        </Text>
                      </View>
                    </View>
                  </>
                ) : (
                  <View style={styles.invoicePlaceholder}>
                    <Text style={styles.invoicePlaceholderText}>
                      No trade draft yet
                    </Text>
                  </View>
                )}
              </View>

              {activeInvoiceRows.length >= 2 ? (
                <View style={styles.invoiceTotalRow}>
                  <Text style={styles.invoiceTotalLabel}>Invoice Total</Text>
                  <View style={styles.invoiceTotalValueWrap}>
                    <Image
                      source={resourceIcons.gold!}
                      style={styles.invoiceTotalIcon}
                    />
                    <Text style={styles.invoiceTotalValue}>
                      {formatDisplayNumber(totalGoldValue)}
                    </Text>
                  </View>
                </View>
              ) : null}

              <View style={styles.actionArea}>
                <View style={styles.tradeLine}>
                  <Text style={styles.tradeLineLabel}>
                    {selectedResource.label}
                  </Text>
                  <View style={styles.tradeSliderBlock}>
                    <View style={styles.tradeSliderHeader}>
                      <Text style={styles.tradeSliderValue}>
                        {formatDisplayNumber(selectedTradeAmount)}
                      </Text>
                      <Text style={styles.tradeSliderHint}>
                        Owned:{" "}
                        {formatDisplayNumber(selectedResourceOwnedAmount)}
                        {"\n"}1 gold per {selectedResource.exchangeAmount}{" "}
                        {selectedResource.label.toLowerCase()}
                      </Text>
                    </View>
                    <Slider
                      minimumValue={0}
                      maximumValue={selectedResourceOwnedAmount}
                      step={1}
                      value={selectedTradeAmount}
                      minimumTrackTintColor="#E9D7AC"
                      maximumTrackTintColor="rgba(255, 255, 255, 0.28)"
                      thumbTintColor="#F7E7B8"
                      onValueChange={(value) =>
                        handleTradeDraftChange(
                          selectedResource.id,
                          value === 0 ? "" : String(value),
                        )
                      }
                    />
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={handleAccept}
                  activeOpacity={0.8}
                >
                  <Text style={styles.acceptButtonText}>Accept</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </View>

        <Modal
          visible={showTradeErrorModal}
          transparent={true}
          animationType="fade"
          presentationStyle="overFullScreen"
          onRequestClose={() => setShowTradeErrorModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>TRADE FAILED</Text>
              <Text style={styles.modalMessage}>{tradeErrorMessage}</Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowTradeErrorModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalButtonText}>UNDERSTOOD</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  selectorContainer: {
    position: "relative",
    zIndex: 5,
  },
  selectorBox: {
    backgroundColor: "rgba(234, 225, 203, 0.95)",
    borderRadius: 8,
    minHeight: 56,
    paddingVertical: 11,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 2,
    borderTopColor: "#FFF6DC",
    borderLeftColor: "#FFF6DC",
    borderRightColor: "#6B5231",
    borderBottomColor: "#6B5231",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 2,
    elevation: 3,
  },
  selectorText: {
    fontSize: isWeb ? 21 : 19,
    color: "#2A1C0E",
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  selectorChevron: {
    fontSize: 17,
    fontWeight: "700",
    color: "#2A1C0E",
  },
  dropdownMenu: {
    position: "absolute",
    top: 42,
    left: 0,
    right: 0,
    backgroundColor: "rgba(228, 216, 191, 0.97)",
    borderRadius: 8,
    overflow: "hidden",
    zIndex: 10,
    borderWidth: 2,
    borderColor: "#5C4427",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 4,
  },
  dropdownOption: {
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(60, 43, 24, 0.45)",
  },
  dropdownOptionText: {
    fontSize: 16,
    color: "#2A1C0E",
    fontWeight: "700",
  },
  headerRow: {
    marginTop: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: {
    fontSize: isWeb ? 19 : 17,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  resourceRow: {
    marginTop: 14,
    minHeight: 104,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  invoicePlaceholder: {
    width: "100%",
    minHeight: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  invoicePlaceholderText: {
    fontSize: isWeb ? 18 : 16,
    color: "rgba(255, 255, 255, 0.55)",
    fontStyle: "italic",
  },
  invoiceSummary: {
    gap: 10,
  },
  invoiceSummaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  resourceIcon: {
    width: 40,
    height: 40,
  },
  resourceValue: {
    fontSize: isWeb ? 20 : 18,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  invoiceTotalRow: {
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.18)",
  },
  invoiceTotalLabel: {
    fontSize: isWeb ? 18 : 16,
    fontWeight: "700",
    color: "#E9D7AC",
  },
  invoiceTotalValueWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  invoiceTotalIcon: {
    width: 28,
    height: 28,
  },
  invoiceTotalValue: {
    fontSize: isWeb ? 22 : 20,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  actionArea: {
    flex: 1,
    justifyContent: "flex-end",
    gap: 16,
  },
  tradeLine: {
    gap: 10,
  },
  tradeLineLabel: {
    fontSize: isWeb ? 17 : 15,
    fontWeight: "700",
    color: "#E9D7AC",
    letterSpacing: 0.4,
  },
  tradeSliderBlock: {
    backgroundColor: "rgba(14, 24, 20, 0.28)",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(233, 215, 172, 0.18)",
  },
  tradeSliderHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  tradeSliderValue: {
    fontSize: isWeb ? 24 : 22,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  tradeSliderHint: {
    fontSize: isWeb ? 14 : 13,
    color: "rgba(255, 255, 255, 0.68)",
    textAlign: "right",
  },
  acceptButton: {
    backgroundColor: "rgba(226, 212, 178, 0.98)",
    borderRadius: 9,
    minHeight: 58,
    paddingVertical: 11,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderTopColor: "#FFF2C6",
    borderLeftColor: "#FFF2C6",
    borderRightColor: "#71542F",
    borderBottomColor: "#71542F",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.45,
    shadowRadius: 2,
    elevation: 5,
  },
  acceptButtonText: {
    fontSize: isWeb ? 21 : 19,
    color: "#2C1D0C",
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    textShadowColor: "rgba(255, 255, 255, 0.35)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: theme.colors.background,
    borderWidth: 3,
    borderColor: "#8B0000",
    borderRadius: 15,
    padding: 30,
    margin: 20,
    alignItems: "center",
    shadowColor: "#FF0000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 15,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#FF6B6B",
    textAlign: "center",
    marginBottom: 15,
    textShadowColor: "#000000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  modalMessage: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 24,
  },
  modalButton: {
    backgroundColor: theme.colors.buttonLocked,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
});
