import { Image, StyleSheet, Text, View } from "react-native";

import { formatDisplayNumber } from "../../utils/formatNumber";

type StrongholdHubHeaderProps = {
  goldAmount: number;
  isWeb: boolean;
};

export function StrongholdHubHeader({ goldAmount, isWeb }: StrongholdHubHeaderProps) {
  return (
    <>
      <Text style={[styles.title, isWeb && styles.titleWeb]}>Stronghold</Text>
      <View style={styles.goldBar}>
        <Image
          source={require("../../../assets/images/General/coin.png")}
          style={styles.goldBarIcon}
        />
        <Text style={[styles.goldBarText, isWeb && styles.goldBarTextWeb]}>
          {formatDisplayNumber(goldAmount)}
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
    marginLeft: 20,
  },
  titleWeb: {
    fontSize: 32,
  },
  goldBar: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  goldBarIcon: {
    width: 22,
    height: 22,
  },
  goldBarText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  goldBarTextWeb: {
    fontSize: 18,
  },
});
