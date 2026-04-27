import { Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { theme } from '../theme/theme';

type GameMessageModalProps = {
  actionLabel?: string;
  actionDisabled?: boolean;
  message: string;
  onClose: () => void;
  onSecondaryAction?: () => void;
  secondaryActionLabel?: string;
  subtext?: string;
  title: string;
  visible: boolean;
};

const isWeb = Platform.OS === 'web';

export function GameMessageModal({
  actionLabel = 'UNDERSTOOD',
  actionDisabled = false,
  message,
  onClose,
  onSecondaryAction,
  secondaryActionLabel,
  subtext,
  title,
  visible,
}: GameMessageModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          {subtext ? <Text style={styles.subtext}>{subtext}</Text> : null}
          <View style={styles.buttonRow}>
            {onSecondaryAction && secondaryActionLabel ? (
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={onSecondaryAction}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>{secondaryActionLabel}</Text>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity
              style={[styles.button, actionDisabled && styles.buttonDisabled]}
              onPress={onClose}
              activeOpacity={0.8}
              disabled={actionDisabled}
            >
              <Text style={styles.buttonText}>{actionLabel}</Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: theme.colors.background,
    borderWidth: 3,
    borderColor: '#8B0000',
    borderRadius: 15,
    padding: 30,
    margin: 20,
    alignItems: 'center',
    ...(isWeb
      ? { boxShadow: '0 0 10px rgba(255, 0, 0, 0.5)' }
      : {
          shadowColor: '#FF0000',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.5,
          shadowRadius: 10,
          elevation: 15,
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
  message: {
    fontSize: isWeb ? 19 : 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtext: {
    fontSize: isWeb ? 15 : 14,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 25,
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: theme.colors.buttonLocked,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});
