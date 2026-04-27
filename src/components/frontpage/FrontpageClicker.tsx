import { Image, Platform, StyleSheet, TouchableOpacity, View } from "react-native";

import { theme } from "../../theme/theme";

type FrontpageClickerProps = {
  scale: number;
  onPress: () => void;
};

const isWeb = Platform.OS === "web";

export function FrontpageClicker({ scale, onPress }: FrontpageClickerProps) {
  return (
    <View style={styles.page}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={styles.clickerContainer}
      >
        <Image
          source={require("../../../assets/images/Factions/Lizardman/Lizardman clicker icon.png")}
          style={[styles.clickerIcon, { transform: [{ scale }] }]}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  clickerContainer: {
    marginVertical: 30,
    alignItems: "center",
    justifyContent: "center",
    width: isWeb ? 190 : 160,
    height: isWeb ? 190 : 160,
    backgroundColor: theme.colors.background,
    borderRadius: isWeb ? 95 : 80,
    ...(isWeb
      ? { boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)" }
      : {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
          elevation: 8,
        }),
  },
  clickerIcon: {
    width: isWeb ? 178 : 150,
    height: isWeb ? 178 : 150,
    borderRadius: isWeb ? 89 : 75,
  },
});
