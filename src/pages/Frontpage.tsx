import { StyleSheet, Text, View } from 'react-native';

import { AppRoute } from '../constants/routes';

type FrontpageProps = {
	onNavigate: (route: AppRoute) => void;
};

export function Frontpage({ onNavigate }: FrontpageProps) {
	return (
		<View style={styles.page}>
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
});
