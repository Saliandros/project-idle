import { StyleSheet, Text, View } from 'react-native';

import { AppRoute } from '../constants/routes';
import { TestUser } from '../types';

type FrontpageProps = {
	onNavigate: (route: AppRoute) => void;
	currentUser: TestUser;
};

export function Frontpage({ onNavigate, currentUser }: FrontpageProps) {
	return (
		<View style={styles.page}>
			<Text style={styles.welcomeText}>{`Hej og velkommen ${currentUser.username}`}</Text>
			<Text style={styles.title} onPress={() => onNavigate(AppRoute.Factions)}>
				Frontpage
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	page: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		fontSize: 24,
		fontWeight: '700',
	},
	welcomeText: {
		fontSize: 18,
		fontWeight: '600',
		marginBottom: 16,
	},
});
