import { ImageBackground, StyleSheet, Text, View } from 'react-native';

import { AppRoute } from '../constants/routes';

type EmbassyExchangeProps = {
	onNavigate: (route: AppRoute) => void;
};

export function EmbassyExchange({ onNavigate }: EmbassyExchangeProps) {
	return (
		<ImageBackground
			source={require('../../assets/images/Factions/Lizardman/Shattered Isles Map.png')}
			style={styles.background}
			imageStyle={styles.backgroundImage}
			resizeMode="cover"
		>
			<View style={styles.overlay}>
				<View style={styles.page}>
					<Text style={styles.title}>
						Embassy Exchange
					</Text>
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
	},
	page: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 16,
	},
	title: {
		fontSize: 24,
		fontWeight: '700',
		color: '#FFFFFF',
	},
});
