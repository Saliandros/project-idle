import { useMemo, useState } from 'react';
import { Image, ImageBackground, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AppRoute } from '../constants/routes';
import { embassyUnlockOrder } from '../data/embassy';
import { factionDefinitions } from '../data/factions';
import { useGameStore } from '../store/useGameStore';
import { theme } from '../theme/theme';

type FactionsProps = {
	onNavigate: (route: AppRoute) => void;
};

type FactionTab = 'champions' | 'unlocks';

const isWeb = Platform.OS === 'web';

export function Factions({ onNavigate }: FactionsProps) {
	const [activeTab, setActiveTab] = useState<FactionTab>('champions');
	const [showLockedModal, setShowLockedModal] = useState(false);
	const [lockedFactionName, setLockedFactionName] = useState('');
	const activeFactionId = useGameStore((state) => state.activeFactionId);
	const unlockedFactionIds = useGameStore((state) => state.unlockedFactionIds);
	const setActiveFaction = useGameStore((state) => state.setActiveFaction);

	const unlockRows = useMemo(
		() =>
			embassyUnlockOrder
				.map((factionId) => factionDefinitions.find((entry) => entry.id === factionId))
				.filter((faction): faction is (typeof factionDefinitions)[number] => Boolean(faction)),
		[],
	);

	const handleFactionPress = (factionId: typeof factionDefinitions[number]['id']) => {
		const faction = factionDefinitions.find((entry) => entry.id === factionId);

		if (!faction) {
			return;
		}

		if (unlockedFactionIds.includes(factionId)) {
			setActiveFaction(factionId);

			if (faction.route) {
				onNavigate(faction.route);
			}

			return;
		}

		setLockedFactionName(faction.lockedName);
		setShowLockedModal(true);
	};

	return (
		<ImageBackground
			source={require('../../assets/images/Factions/Lizardman/Shattered Isles Map.png')}
			style={styles.background}
			imageStyle={styles.backgroundImage}
			resizeMode="cover"
		>
			<View style={styles.overlay}>
				<Text style={styles.title}>Factions</Text>

				<View style={styles.tabRow}>
					<TouchableOpacity
						style={[styles.tabButton, activeTab === 'champions' && styles.tabButtonActive]}
						onPress={() => setActiveTab('champions')}
						activeOpacity={0.85}
					>
						<Text style={styles.tabButtonText}>Champions</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.tabButton, activeTab === 'unlocks' && styles.tabButtonActive]}
						onPress={() => setActiveTab('unlocks')}
						activeOpacity={0.85}
					>
						<Text style={styles.tabButtonText}>Unlocks</Text>
					</TouchableOpacity>
				</View>

				{activeTab === 'champions' ? (
					<View style={styles.factionContainer}>
						{factionDefinitions.map((faction) => {
							const isUnlocked = unlockedFactionIds.includes(faction.id);
							const isActive = activeFactionId === faction.id;

							return (
								<TouchableOpacity
									key={faction.id}
									style={[
										styles.factionBox,
										isUnlocked ? styles.unlockedBox : styles.lockedBox,
										isActive && styles.activeFaction,
									]}
									onPress={() => handleFactionPress(faction.id)}
								>
									<Text style={[styles.factionText, isActive && styles.activeFactionText]}>
										{faction.label}
									</Text>
								</TouchableOpacity>
							);
						})}
					</View>
				) : (
					<ScrollView
						style={styles.unlockList}
						contentContainerStyle={styles.unlockListContent}
						showsVerticalScrollIndicator={Platform.OS === 'web'}
					>
						{unlockRows
							.sort((a, b) => Number(unlockedFactionIds.includes(a.id)) - Number(unlockedFactionIds.includes(b.id)))
							.map((faction) => {
							const isUnlocked = unlockedFactionIds.includes(faction.id);

							return (
								<TouchableOpacity
									key={faction.id}
									style={[styles.unlockRow, isUnlocked ? styles.unlockRowUnlocked : styles.unlockRowLocked]}
									activeOpacity={0.8}
									onPress={isUnlocked ? undefined : () => handleFactionPress(faction.id)}
								>
									<View>
										<Text style={[styles.unlockText, isUnlocked && styles.unlockTextUnlocked]}>
											{isUnlocked ? 'Unlocked' : 'Unlock'}{'\n'}{faction.label}
										</Text>
									</View>
									<View style={styles.unlockCost}>
										{isUnlocked ? (
											<Text style={styles.unlockStatus}>Ready</Text>
										) : (
											<>
												<Image
													source={require('../../assets/images/General/coin.png')}
													style={styles.unlockCoin}
												/>
												<Text style={styles.unlockAmount}>1485</Text>
											</>
										)}
									</View>
								</TouchableOpacity>
							);
						})}
					</ScrollView>
				)}

				<Modal
					visible={showLockedModal}
					transparent={true}
					animationType="fade"
					onRequestClose={() => setShowLockedModal(false)}
				>
					<View style={styles.modalOverlay}>
						<View style={styles.modalContainer}>
							<Text style={styles.modalTitle}>FACTION LOCKED</Text>
							<Text style={styles.modalMessage}>{lockedFactionName} are still Locked</Text>
							<Text style={styles.modalSubtext}>Raise your standing with {lockedFactionName} to be able to purchase "unlock"</Text>
							<TouchableOpacity
								style={styles.modalButton}
								onPress={() => setShowLockedModal(false)}
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
		width: '130%',
		height: '130%',
		left: '-15%',
		top: '-15%',
	},
	overlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.28)',
		paddingTop: isWeb ? 20 : 50,
	},
	title: {
		fontSize: isWeb ? 32 : 24,
		fontWeight: '700',
		color: '#FFFFFF',
		marginBottom: 20,
		marginLeft: 20,
	},
	tabRow: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 20,
		paddingVertical: 10,
		marginBottom: 16,
		gap: 10,
		backgroundColor: theme.colors.navColor,
		borderTopWidth: StyleSheet.hairlineWidth,
		borderTopColor: 'rgba(255, 255, 255, 0.4)',
	},
	tabButton: {
		flex: 1,
		height: 64,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 14,
		backgroundColor: 'rgba(255, 255, 255, 0.08)',
	},
	tabButtonActive: {
		backgroundColor: 'rgba(255, 255, 255, 0.2)',
	},
	tabButtonText: {
		color: theme.colors.textPrimary,
		fontSize: isWeb ? 17 : 15,
		fontWeight: '700',
	},
	factionContainer: {
		flex: 1,
		justifyContent: 'flex-start',
		gap: 0,
	},
	factionBox: {
		width: '100%',
		paddingVertical: 25,
		paddingHorizontal: 20,
		justifyContent: 'center',
		borderBottomWidth: 1,
		borderBottomColor: 'rgba(0, 0, 0, 0.65)',
	},
	unlockedBox: {
		backgroundColor: 'rgba(69, 142, 54, 0.6)',
	},
	lockedBox: {
		backgroundColor: 'rgba(142, 54, 54, 0.6)',
	},
	factionText: {
		fontSize: isWeb ? 20 : 18,
		fontWeight: '600',
		color: '#FFFFFF',
	},
	activeFaction: {
		borderWidth: 1,
		borderColor: 'rgba(0, 0, 0, 0.65)',
		backgroundColor: 'rgba(69, 142, 54, 0.8)',
	},
	activeFactionText: {
		fontWeight: '700',
		color: '#FFFFFF',
	},
	unlockList: {
		flex: 1,
	},
	unlockListContent: {
		paddingBottom: 24,
	},
	unlockRow: {
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 16,
		paddingHorizontal: 20,
		borderBottomWidth: 1,
		borderBottomColor: 'rgba(0, 0, 0, 0.65)',
	},
	unlockRowLocked: {
		backgroundColor: 'rgba(142, 54, 54, 0.6)',
	},
	unlockRowUnlocked: {
		backgroundColor: 'rgba(69, 142, 54, 0.7)',
	},
	unlockText: {
		fontSize: isWeb ? 16 : 15,
		fontWeight: '600',
		lineHeight: isWeb ? 19 : 18,
		color: '#FFFFFF',
		textShadowColor: 'rgba(0, 0, 0, 0.6)',
		textShadowOffset: { width: 0, height: 1 },
		textShadowRadius: 1,
	},
	unlockTextUnlocked: {
		fontWeight: '700',
	},
	unlockCost: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
	},
	unlockCoin: {
		width: 24,
		height: 24,
	},
	unlockAmount: {
		fontSize: isWeb ? 16 : 15,
		color: '#FFFFFF',
		fontWeight: '600',
		textShadowColor: 'rgba(0, 0, 0, 0.6)',
		textShadowOffset: { width: 0, height: 1 },
		textShadowRadius: 1,
	},
	unlockStatus: {
		fontSize: isWeb ? 15 : 14,
		color: '#E7FFE3',
		fontWeight: '700',
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.8)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalContainer: {
		backgroundColor: theme.colors.background,
		borderWidth: 3,
		borderColor: '#8B0000',
		borderRadius: 15,
		padding: 30,
		margin: 20,
		alignItems: 'center',
		shadowColor: '#FF0000',
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.5,
		shadowRadius: 10,
		elevation: 15,
	},
	modalTitle: {
		fontSize: 24,
		fontWeight: '900',
		color: '#FF6B6B',
		textAlign: 'center',
		marginBottom: 15,
		textShadowColor: '#000000',
		textShadowOffset: { width: 2, height: 2 },
		textShadowRadius: 3,
	},
	modalMessage: {
		fontSize: isWeb ? 19 : 18,
		fontWeight: '600',
		color: '#FFFFFF',
		textAlign: 'center',
		marginBottom: 10,
	},
	modalSubtext: {
		fontSize: isWeb ? 15 : 14,
		color: '#CCCCCC',
		textAlign: 'center',
		marginBottom: 25,
		fontStyle: 'italic',
	},
	modalButton: {
		backgroundColor: theme.colors.buttonLocked,
		paddingVertical: 12,
		paddingHorizontal: 30,
		borderRadius: 8,
		borderWidth: 2,
		borderColor: '#FFFFFF',
	},
	modalButtonText: {
		color: '#FFFFFF',
		fontSize: 16,
		fontWeight: '700',
		textAlign: 'center',
	},
});
