import { ImageBackground, StyleSheet, Text, View } from 'react-native';

import { AppRoute } from '../constants/routes';
import { TestUser } from '../types';

type FrontpageProps = {
	onNavigate: (route: AppRoute) => void;
	currentUser: TestUser;
};

export function Frontpage({ onNavigate, currentUser }: FrontpageProps) {
	return (
		<ImageBackground
			source={require('../../assets/images/Factions/Lizardman/Shattered Isles Map.png')}
			style={styles.background}
			imageStyle={styles.backgroundImage}
			resizeMode="cover"
		>
			<View style={styles.overlay}>
				<View style={styles.page}>
					<Text style={styles.welcomeText}>{`Hej og velkommen ${currentUser.username}`}</Text>
					<Text style={styles.title} onPress={() => onNavigate(AppRoute.Factions)}>
						Frontpage
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
	welcomeText: {
		fontSize: 18,
		fontWeight: '600',
		marginBottom: 16,
		color: '#FFFFFF',
		textAlign: 'center',
	},
});
