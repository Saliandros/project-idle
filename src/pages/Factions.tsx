import { ImageBackground, StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import { useState } from 'react';

import { AppRoute } from '../constants/routes';
import { theme } from '../theme/theme';

type FactionsProps = {
	onNavigate: (route: AppRoute) => void;
};

export function Factions({ onNavigate }: FactionsProps) {
	const [activeFaction, setActiveFaction] = useState<'lizardman' | 'human' | 'elves'>('lizardman');
	const [showLockedModal, setShowLockedModal] = useState(false);
	const [lockedFactionName, setLockedFactionName] = useState<string>('');

	const handleFactionPress = (faction: 'lizardman' | 'human' | 'elves') => {
		if (faction === 'lizardman') {
			setActiveFaction(faction);
		} else {
			// Gem faction navn og vis game-style popup for locked factions
			let factionDisplayName: string = '';
			if (faction === 'human') {
				factionDisplayName = 'The Humans';
			} else if (faction === 'elves') {
				factionDisplayName = 'The Elves';
			}
			setLockedFactionName(factionDisplayName);
			setShowLockedModal(true);
		}
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
				
				<View style={styles.factionContainer}>
					{/* Lizardman - Unlocked (grøn) */}
					<TouchableOpacity 
						style={[
							styles.factionBox, 
							styles.unlockedBox,
							activeFaction === 'lizardman' && styles.activeFaction
						]}
						onPress={() => handleFactionPress('lizardman')}
					>
						<Text style={[
							styles.factionText,
							activeFaction === 'lizardman' && styles.activeFactionText
						]}>
							Lizardman
						</Text>
					</TouchableOpacity>
					
					{/* Human - Locked (rød) */}
					<TouchableOpacity 
						style={[styles.factionBox, styles.lockedBox]}
						onPress={() => handleFactionPress('human')}
					>
						<Text style={styles.factionText}>Human</Text>
					</TouchableOpacity>
					
					{/* Elves - Locked (rød) */}
					<TouchableOpacity 
						style={[styles.factionBox, styles.lockedBox]}
						onPress={() => handleFactionPress('elves')}
					>
						<Text style={styles.factionText}>Elves</Text>
					</TouchableOpacity>
				</View>
				
				{/* Game-style Locked Modal */}
				<Modal
					visible={showLockedModal}
					transparent={true}
					animationType="fade"
				>
					<View style={styles.modalOverlay}>
						<View style={styles.modalContainer}>
							<Text style={styles.modalTitle}>FACTION LOCKED</Text>
							<Text style={styles.modalMessage}>The {lockedFactionName} Faction is still Locked</Text>
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
		paddingTop: 50,
	},
	title: {
		fontSize: 24,
		fontWeight: '700',
		color: '#FFFFFF',
		marginBottom: 30,
		marginLeft: 20,
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
	},
	unlockedBox: {
		backgroundColor: 'rgba(69, 142, 54, 0.6)',
	},
	lockedBox: {
		backgroundColor: 'rgba(142, 54, 54, 0.6)',
	},
	factionText: {
		fontSize: 18,
		fontWeight: '600',
		color: '#FFFFFF',
	},
	activeFaction: {
		borderWidth: 3,
		borderColor: '#FFFFFF',
		backgroundColor: 'rgba(69, 142, 54, 0.8)',
	},
	activeFactionText: {
		fontWeight: '700',
		color: '#FFFFFF',
	},
	// Game-style Modal Styles
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
		marginBottom: 10,
	},
	modalSubtext: {
		fontSize: 14,
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
