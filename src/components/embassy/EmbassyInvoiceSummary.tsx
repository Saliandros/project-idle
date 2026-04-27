import { Image, StyleSheet, Text, View } from "react-native";

import { EmbassyResourceOption, ResourceId } from "../../types/game";
import { formatDisplayNumber } from "../../utils/formatNumber";

type InvoiceRow = EmbassyResourceOption & {
  amount: number;
  goldValue: number;
  hasDraft: boolean;
};

type EmbassyInvoiceSummaryProps = {
  activeInvoiceRows: InvoiceRow[];
  hasTradeDraft: boolean;
  totalGoldValue: number;
  resourceIcons: Partial<Record<ResourceId, number>>;
};

export function EmbassyInvoiceSummary({
  activeInvoiceRows,
  hasTradeDraft,
  totalGoldValue,
  resourceIcons,
}: EmbassyInvoiceSummaryProps) {
  return (
    <>
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
                    source={resourceIcons[row.id] ?? resourceIcons.meat!}
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
                <Image source={resourceIcons.gold!} style={styles.resourceIcon} />
                <Text style={styles.resourceValue}>{formatDisplayNumber(totalGoldValue)}</Text>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.invoicePlaceholder}>
            <Text style={styles.invoicePlaceholderText}>No trade draft yet</Text>
          </View>
        )}
      </View>

      {activeInvoiceRows.length >= 2 ? (
        <View style={styles.invoiceTotalRow}>
          <Text style={styles.invoiceTotalLabel}>Invoice Total</Text>
          <View style={styles.invoiceTotalValueWrap}>
            <Image source={resourceIcons.gold!} style={styles.invoiceTotalIcon} />
            <Text style={styles.invoiceTotalValue}>{formatDisplayNumber(totalGoldValue)}</Text>
          </View>
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    marginTop: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: {
    fontSize: 17,
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
    fontSize: 16,
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
    fontSize: 18,
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
    fontSize: 16,
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
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});
