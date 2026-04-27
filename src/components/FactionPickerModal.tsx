import { Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { FactionDefinition, FactionId } from '../types/game';
import { theme } from '../theme/theme';

type FactionPickerModalProps = {
  activeFactionId: FactionId;
  factions: FactionDefinition[];
  onClose: () => void;
  onSelect: (faction: FactionDefinition) => void;
  unlockedFactionIds: FactionId[];
  visible: boolean;
};

const isWeb = Platform.OS === 'web';

export function FactionPickerModal({
  activeFactionId,
  factions,
  onClose,
  onSelect,
  unlockedFactionIds,
  visible,
}: FactionPickerModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>SELECT FACTION</Text>
          <View style={styles.list}>
            {factions.map((entry) => {
              const isUnlocked = unlockedFactionIds.includes(entry.id);
              const isCurrent = activeFactionId === entry.id;

              return (
                <TouchableOpacity
                  key={entry.id}
                  style={[
                    styles.row,
                    isUnlocked ? styles.rowUnlocked : styles.rowLocked,
                    isCurrent && styles.rowCurrent,
                  ]}
                  onPress={() => onSelect(entry)}
                >
                  <View style={styles.rowBody}>
                    <Text style={styles.rowText}>{entry.label}</Text>
                    <Text style={styles.rowMeta}>
                      {isCurrent ? 'Current' : isUnlocked ? 'Available' : 'Locked'}
                    </Text>
                  </View>
                  <Text style={styles.rowArrow}>{'>'}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>CLOSE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: 'rgba(6, 18, 14, 0.94)',
    borderWidth: 1,
    borderColor: 'rgba(233, 215, 172, 0.3)',
    padding: 22,
    margin: 20,
    ...(isWeb
      ? { boxShadow: '0 14px 24px rgba(0, 0, 0, 0.35)' }
      : {
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 14 },
          shadowOpacity: 0.35,
          shadowRadius: 24,
          elevation: 18,
        }),
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: 15,
    ...(isWeb
      ? { textShadow: '2px 2px 3px #000000' }
      : {
          textShadowColor: '#000000',
          textShadowOffset: { width: 2, height: 2 },
          textShadowRadius: 3,
        }),
  },
  list: {
    width: '100%',
    gap: 8,
    marginBottom: 20,
  },
  row: {
    minHeight: 68,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.28)',
  },
  rowUnlocked: {
    backgroundColor: 'rgba(69, 142, 54, 0.6)',
  },
  rowLocked: {
    backgroundColor: 'rgba(142, 54, 54, 0.6)',
  },
  rowCurrent: {
    backgroundColor: 'rgba(69, 142, 54, 0.82)',
    borderColor: 'rgba(233, 215, 172, 0.4)',
  },
  rowBody: {
    gap: 4,
  },
  rowText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  rowMeta: {
    color: 'rgba(255, 255, 255, 0.76)',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  rowArrow: {
    color: '#E9D7AC',
    fontSize: 24,
    fontWeight: '700',
  },
  button: {
    backgroundColor: theme.colors.buttonLocked,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});
