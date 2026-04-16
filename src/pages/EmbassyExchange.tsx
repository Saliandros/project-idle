import { StyleSheet, Text, View } from 'react-native';

import { AppRoute } from '../constants/routes';

type EmbassyExchangeProps = {
	onNavigate: (route: AppRoute) => void;
};

export function EmbassyExchange({ onNavigate }: EmbassyExchangeProps) {
	return (
		<View style={styles.page}>
			<Text style={styles.title} onPress={() => onNavigate(AppRoute.Home)}>
				Embassy Exchange
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
