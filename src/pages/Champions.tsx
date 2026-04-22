import { Image, ImageBackground, Platform, StyleSheet, Text, View } from 'react-native';

import { AppRoute } from '../constants/routes';
import { championDefinitions } from '../data/champions';
import { factionDefinitions } from '../data/factions';
import { useGameStore } from '../store/useGameStore';
import { theme } from '../theme/theme';

type ChampionsProps = {
	onNavigate: (route: AppRoute) => void;
};

const isWeb = Platform.OS === 'web';

export function Champions({ onNavigate: _onNavigate }: ChampionsProps) {
	const activeFactionId = useGameStore((state) => state.activeFactionId);
	const championLevels = useGameStore((state) => state.championLevels);
	const activeFaction = factionDefinitions.find((faction) => faction.id === activeFactionId) ?? factionDefinitions[0];
	const visibleChampions = championDefinitions.filter((champion) => champion.factionId === activeFaction.id);

	return (
		<ImageBackground
			source={require('../../assets/images/Factions/Lizardman/Shattered Isles Map.png')}
			style={styles.background}
			imageStyle={styles.backgroundImage}
			resizeMode="cover"
		>
			<View style={styles.overlay}>
				<Text style={styles.title}>Factions</Text>
				<View style={styles.divider} />
				<Text style={styles.factionName}>{activeFaction.label}</Text>

				<View style={styles.list}>
					{visibleChampions.map((champion) => (
						<View key={champion.id} style={styles.row}>
							{champion.previewImage ? (
								<ImageBackground
									source={champion.previewImage}
									style={styles.championPreview}
									imageStyle={styles.championPreviewImage}
									resizeMode="cover"
								>
									<View style={styles.previewOverlay}>
										<Text style={styles.championName}>{champion.name}</Text>
										<View style={styles.priceRow}>
											<Image
												source={require('../../assets/images/General/meat.png')}
												style={styles.meatIcon}
											/>
											<Text style={styles.championPrice}>{champion.costAmount}</Text>
										</View>
									</View>
								</ImageBackground>
							) : (
								<View style={styles.championPreviewEmpty}>
									<View style={styles.previewOverlay}>
										<Text style={styles.championName}>{champion.name}</Text>
										<View style={styles.priceRow}>
											<Image
												source={require('../../assets/images/General/meat.png')}
												style={styles.meatIcon}
											/>
											<Text style={styles.championPrice}>{champion.costAmount}</Text>
										</View>
									</View>
								</View>
							)}

							<View style={styles.levelCol}>
								<Text style={styles.levelLabel}>LEVEL</Text>
								<Text style={styles.levelValue}>{championLevels[champion.id] ?? 0}</Text>
							</View>
						</View>
					))}
				</View>
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
		paddingHorizontal: 20,
	},
	title: {
		fontSize: isWeb ? 32 : 24,
		fontWeight: '700',
		color: '#FFFFFF',
	},
	divider: {
		height: 1,
		backgroundColor: 'rgba(255, 255, 255, 0.65)',
		marginTop: 8,
	},
	factionName: {
		fontSize: isWeb ? 22 : 20,
		fontWeight: '700',
		color: '#FFFFFF',
		marginTop: 10,
		marginBottom: 14,
	},
	list: {
		gap: 10,
	},
	row: {
		height: 108,
		flexDirection: 'row',
		backgroundColor: theme.colors.background,
		overflow: 'hidden',
	},
	championPreview: {
		flex: 1,
		height: '100%',
	},
	championPreviewImage: {
		width: '100%',
		height: '100%',
		opacity: 0.92,
	},
	championPreviewEmpty: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.25)',
	},
	previewOverlay: {
		flex: 1,
		padding: 10,
		backgroundColor: 'rgba(0, 0, 0, 0.2)',
	},
	championName: {
		fontSize: isWeb ? 16 : 15,
		color: '#FFFFFF',
		fontWeight: '700',
	},
	championPrice: {
		fontSize: isWeb ? 14 : 13,
		color: '#FFFFFF',
		fontWeight: '600',
	},
	priceRow: {
		marginTop: 4,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
	},
	meatIcon: {
		width: 16,
		height: 16,
	},
	levelCol: {
		width: 95,
		alignItems: 'center',
		justifyContent: 'center',
		borderLeftWidth: 1,
		borderLeftColor: 'rgba(255, 255, 255, 0.7)',
		backgroundColor: 'rgba(0, 0, 0, 0.2)',
	},
	levelLabel: {
		fontSize: isWeb ? 17 : 16,
		color: '#FFFFFF',
		fontWeight: '400',
	},
	levelValue: {
		fontSize: isWeb ? 15 : 14,
		color: '#FFFFFF',
	},
});
