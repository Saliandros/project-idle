import Slider from "@react-native-community/slider";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { formatDisplayNumber } from "../../utils/formatNumber";

type EmbassyTradeControlsProps = {
  onAccept: () => void;
  onValueChange: (value: number) => void;
  selectedResourceAmountOwned: number;
  selectedResourceExchangeAmount: number;
  selectedResourceLabel: string;
  selectedTradeAmount: number;
};

export function EmbassyTradeControls({
  onAccept,
  onValueChange,
  selectedResourceAmountOwned,
  selectedResourceExchangeAmount,
  selectedResourceLabel,
  selectedTradeAmount,
}: EmbassyTradeControlsProps) {
  return (
    <View style={styles.actionArea}>
      <View style={styles.tradeLine}>
        <Text style={styles.tradeLineLabel}>{selectedResourceLabel}</Text>
        <View style={styles.tradeSliderBlock}>
          <View style={styles.tradeSliderHeader}>
            <Text style={styles.tradeSliderValue}>
              {formatDisplayNumber(selectedTradeAmount)}
            </Text>
            <Text style={styles.tradeSliderHint}>
              Owned: {formatDisplayNumber(selectedResourceAmountOwned)}
              {"\n"}1 gold per {selectedResourceExchangeAmount}{" "}
              {selectedResourceLabel.toLowerCase()}
            </Text>
          </View>
          <Slider
            minimumValue={0}
            maximumValue={selectedResourceAmountOwned}
            step={1}
            value={selectedTradeAmount}
            minimumTrackTintColor="#E9D7AC"
            maximumTrackTintColor="rgba(255, 255, 255, 0.28)"
            thumbTintColor="#F7E7B8"
            onValueChange={onValueChange}
          />
        </View>
      </View>
      <TouchableOpacity style={styles.acceptButton} onPress={onAccept} activeOpacity={0.8}>
        <Text style={styles.acceptButtonText}>Accept</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  actionArea: {
    flex: 1,
    justifyContent: "flex-end",
    gap: 16,
  },
  tradeLine: {
    gap: 10,
  },
  tradeLineLabel: {
    fontSize: 15,
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
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  tradeSliderHint: {
    fontSize: 13,
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
  },
  acceptButtonText: {
    fontSize: 19,
    color: "#2C1D0C",
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
});
