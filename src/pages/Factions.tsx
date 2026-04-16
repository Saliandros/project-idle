import { StyleSheet, Text, View } from 'react-native';

import { AppRoute } from '../constants/routes';

type FactionsProps = {
	onNavigate: (route: AppRoute) => void;
};

export function Factions({ onNavigate }: FactionsProps) {
	return (
		<View style={styles.page}>
			<Text style={styles.title} onPress={() => onNavigate(AppRoute.Embassy_Exchange)}>
				Factions
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
