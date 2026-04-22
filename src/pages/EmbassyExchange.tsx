import { useMemo, useState } from 'react';
import { Image, ImageBackground, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AppRoute } from '../constants/routes';
import { theme } from '../theme/theme';

type EmbassyExchangeProps = {
	onNavigate: (route: AppRoute) => void;
};

type EmbassyResourceId = 'meat';

type EmbassyResourceOption = {
	id: EmbassyResourceId;
	label: string;
	amount: number;
	goldValue: number;
};

const resourceOptions: EmbassyResourceOption[] = [
	{ id: 'meat', label: 'Meat', amount: 9, goldValue: 1485 },
];

const unlockPlaceholders = [
	{ name: 'Human', unlocked: false },
	{ name: 'Lizardman', unlocked: true },
	{ name: 'Orcs', unlocked: false },
	{ name: 'Goblin Tribes', unlocked: false },
];

const isWeb = Platform.OS === 'web';

export function EmbassyExchange({ onNavigate: _onNavigate }: EmbassyExchangeProps) {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [selectedResourceId, setSelectedResourceId] = useState<EmbassyResourceId>('meat');
	const [showUnlockModal, setShowUnlockModal] = useState(false);

	const selectedResource = useMemo(
		() => resourceOptions.find((option) => option.id === selectedResourceId) ?? resourceOptions[0],
		[selectedResourceId],
	);
	const sortedUnlockRows = useMemo(
		() =>
			unlockPlaceholders
				.map((item, index) => ({ ...item, index }))
				.sort((a, b) => Number(a.unlocked) - Number(b.unlocked) || a.index - b.index),
		[],
	);

	const handleAccept = () => {};
	const toggleDropdown = () => setIsDropdownOpen((previous) => !previous);
	const handleUnlockPress = () => {
		setIsDropdownOpen(false);
		setShowUnlockModal(true);
	};
	const handleSelectResource = (resourceId: EmbassyResourceId) => {
		setSelectedResourceId(resourceId);
		setIsDropdownOpen(false);
	};

	return (
		<ImageBackground
			source={require('../../assets/images/Factions/Lizardman/Shattered Isles Map.png')}
			style={styles.background}
			imageStyle={styles.backgroundImage}
			resizeMode="cover"
		>
			<View style={styles.mapDimmer} pointerEvents="none" />
			<View style={styles.overlay}>
				<Text style={styles.title}>Embassy Exchange</Text>

				<View style={[styles.mainContent, isWeb && styles.mainContentWeb]}>
					<ImageBackground
						source={require('../../assets/images/Backgrounds/TradeBG.png')}
						style={[styles.exchangePanel, isWeb && styles.exchangePanelWeb]}
						imageStyle={styles.exchangePanelImage}
						resizeMode="cover"
					>
						<View style={styles.exchangePanelOverlay} />
						<View style={styles.exchangePanelContent}>
							<View style={styles.selectorContainer}>
								<TouchableOpacity style={styles.selectorBox} onPress={toggleDropdown} activeOpacity={0.8}>
									<Text style={styles.selectorText}>{selectedResource.label}</Text>
									<Text style={styles.selectorChevron}>{isDropdownOpen ? '^' : 'v'}</Text>
								</TouchableOpacity>

								{isDropdownOpen ? (
									<View style={styles.dropdownMenu}>
										{resourceOptions.map((option) => (
											<TouchableOpacity
												key={option.id}
												style={styles.dropdownOption}
												onPress={() => handleSelectResource(option.id)}
												activeOpacity={0.8}
											>
												<Text style={styles.dropdownOptionText}>{option.label}</Text>
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
								<View style={styles.resourceInfo}>
									<Image
										source={require('../../assets/images/General/meat.png')}
										style={styles.resourceIcon}
									/>
									<Text style={styles.resourceValue}>
										{selectedResource.amount} {selectedResource.label}
									</Text>
								</View>
								<View style={styles.resourceInfo}>
									<Image
										source={require('../../assets/images/General/coin.png')}
										style={styles.resourceIcon}
									/>
									<Text style={styles.resourceValue}>{selectedResource.goldValue}</Text>
								</View>
							</View>

							<View style={styles.actionArea}>
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

					<View style={[styles.unlockScrollArea, isWeb && styles.unlockScrollAreaWeb]}>
						<ScrollView
							style={[styles.unlockList, Platform.OS === 'web' && styles.unlockListWeb]}
							contentContainerStyle={[styles.unlockListContent, isWeb && styles.unlockListContentWeb]}
							showsVerticalScrollIndicator={Platform.OS === 'web'}
							persistentScrollbar={Platform.OS === 'web'}
							scrollEnabled={true}
						>
							{sortedUnlockRows.map((item) => (
								<TouchableOpacity
									key={item.name}
									style={[styles.unlockRow, item.unlocked ? styles.unlockRowUnlocked : styles.unlockRowLocked]}
									activeOpacity={0.8}
									onPress={item.unlocked ? undefined : handleUnlockPress}
								>
									<View>
										<Text style={[styles.unlockText, item.unlocked && styles.unlockTextUnlocked]}>
											{item.unlocked ? 'Unlocked' : 'Unlock'}{'\n'}{item.name}
										</Text>
									</View>
									<View style={styles.unlockCost}>
										{item.unlocked ? (
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
							))}
						</ScrollView>

						{Platform.OS === 'web' ? (
							<View style={styles.scrollRail} pointerEvents="none">
								<View style={styles.scrollThumb} />
							</View>
						) : null}
					</View>
				</View>

				<Modal
					visible={showUnlockModal}
					transparent={true}
					animationType="fade"
					presentationStyle="overFullScreen"
					onRequestClose={() => setShowUnlockModal(false)}
				>
					<View style={styles.modalOverlay}>
						<View style={styles.modalContainer}>
							<Text style={styles.modalTitle}>NOT ENOUGH GOLD</Text>
							<Text style={styles.modalMessage}>You dont have the required amount of gold</Text>
							<TouchableOpacity
								style={styles.modalButton}
								onPress={() => setShowUnlockModal(false)}
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
		width: '130%',
		height: '130%',
		left: '-15%',
		top: '-15%',
	},
	overlay: {
		flex: 1,
		backgroundColor: 'transparent',
		paddingTop: isWeb ? 20 : 50,
	},
	mapDimmer: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: 'rgba(0, 0, 0, 0.28)',
	},
	title: {
		fontSize: isWeb ? 32 : 24,
		fontWeight: '700',
		color: '#FFFFFF',
		marginBottom: 30,
		marginLeft: 20,
	},
	mainContent: {
		flex: 1,
	},
	mainContentWeb: {
		flexDirection: 'row',
		gap: 14,
		paddingHorizontal: 20,
		paddingBottom: 8,
	},
	exchangePanel: {
		height: 340,
		width: '100%',
		overflow: 'hidden',
	},
	exchangePanelWeb: {
		flex: 1,
		height: '100%',
		width: undefined,
		borderRadius: 10,
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
		paddingHorizontal: 18,
		paddingTop: 10,
		paddingBottom: 24,
	},
	selectorBox: {
		backgroundColor: 'rgba(234, 225, 203, 0.95)',
		borderRadius: 8,
		paddingVertical: 9,
		paddingHorizontal: 12,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		borderWidth: 2,
		borderTopColor: '#FFF6DC',
		borderLeftColor: '#FFF6DC',
		borderRightColor: '#6B5231',
		borderBottomColor: '#6B5231',
		shadowColor: '#000000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.35,
		shadowRadius: 2,
		elevation: 3,
	},
	selectorContainer: {
		position: 'relative',
		zIndex: 5,
	},
	selectorText: {
		fontSize: isWeb ? 19 : 18,
		color: '#2A1C0E',
		fontWeight: '700',
		letterSpacing: 0.3,
	},
	selectorChevron: {
		fontSize: 15,
		fontWeight: '700',
		color: '#2A1C0E',
	},
	dropdownMenu: {
		position: 'absolute',
		top: 42,
		left: 0,
		right: 0,
		backgroundColor: 'rgba(228, 216, 191, 0.97)',
		borderRadius: 8,
		overflow: 'hidden',
		zIndex: 10,
		borderWidth: 2,
		borderColor: '#5C4427',
		shadowColor: '#000000',
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.4,
		shadowRadius: 3,
		elevation: 4,
	},
	dropdownOption: {
		paddingVertical: 11,
		paddingHorizontal: 12,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: 'rgba(60, 43, 24, 0.45)',
	},
	dropdownOptionText: {
		fontSize: 16,
		color: '#2A1C0E',
		fontWeight: '700',
	},
	headerRow: {
		marginTop: 18,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	headerText: {
		fontSize: isWeb ? 17 : 16,
		color: '#FFFFFF',
	},
	resourceRow: {
		marginTop: 10,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	resourceInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
	},
	resourceIcon: {
		width: 34,
		height: 34,
	},
	resourceValue: {
		fontSize: isWeb ? 18 : 17,
		color: '#FFFFFF',
	},
	actionArea: {
		flex: 1,
		justifyContent: 'flex-end',
	},
	acceptButton: {
		backgroundColor: 'rgba(226, 212, 178, 0.98)',
		borderRadius: 9,
		paddingVertical: 9,
		alignItems: 'center',
		borderWidth: 2,
		borderTopColor: '#FFF2C6',
		borderLeftColor: '#FFF2C6',
		borderRightColor: '#71542F',
		borderBottomColor: '#71542F',
		shadowColor: '#000000',
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.45,
		shadowRadius: 2,
		elevation: 5,
	},
	acceptButtonText: {
		fontSize: isWeb ? 19 : 18,
		color: '#2C1D0C',
		fontWeight: '800',
		letterSpacing: 0.8,
		textTransform: 'uppercase',
		textShadowColor: 'rgba(255, 255, 255, 0.35)',
		textShadowOffset: { width: 0, height: 1 },
		textShadowRadius: 1,
	},
	unlockList: {
		marginTop: 0,
		paddingHorizontal: 0,
		flex: 1,
	},
	unlockListWeb: {
		paddingRight: 10,
	},
	unlockScrollArea: {
		flex: 1,
		position: 'relative',
		borderTopWidth: 1,
		borderTopColor: 'rgba(0, 0, 0, 0.6)',
	},
	unlockScrollAreaWeb: {
		flex: 1,
		borderTopWidth: 0,
		borderRadius: 10,
		overflow: 'hidden',
	},
	unlockListContent: {
		paddingBottom: 120,
	},
	unlockListContentWeb: {
		paddingBottom: 24,
	},
	scrollRail: {
		position: 'absolute',
		right: 3,
		top: 10,
		bottom: 126,
		width: 5,
		borderRadius: 3,
		backgroundColor: 'rgba(0, 0, 0, 0.35)',
	},
	scrollThumb: {
		width: '100%',
		height: 42,
		borderRadius: 3,
		backgroundColor: 'rgba(255, 255, 255, 0.55)',
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
		fontSize: 18,
		fontWeight: '600',
		color: '#FFFFFF',
		textAlign: 'center',
		marginBottom: 24,
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
