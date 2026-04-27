import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { EmbassyResourceOption } from "../../types/game";

type EmbassyResourceSelectorProps = {
  isDropdownOpen: boolean;
  onSelectResource: (resourceId: EmbassyResourceOption["id"]) => void;
  onToggle: () => void;
  options: EmbassyResourceOption[];
  selectedLabel: string;
};

export function EmbassyResourceSelector({
  isDropdownOpen,
  onSelectResource,
  onToggle,
  options,
  selectedLabel,
}: EmbassyResourceSelectorProps) {
  return (
    <View style={styles.selectorContainer}>
      <TouchableOpacity style={styles.selectorBox} onPress={onToggle} activeOpacity={0.8}>
        <Text style={styles.selectorText}>{selectedLabel}</Text>
        <Text style={styles.selectorChevron}>{isDropdownOpen ? "^" : "v"}</Text>
      </TouchableOpacity>

      {isDropdownOpen ? (
        <View style={styles.dropdownMenu}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.dropdownOption}
              onPress={() => onSelectResource(option.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.dropdownOptionText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
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
  },
  selectorText: {
    fontSize: 19,
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
});
