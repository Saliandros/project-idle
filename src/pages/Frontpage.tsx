import { useState } from 'react';
import {
    Image,
    ImageBackground,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from 'react-native';

import { AppRoute } from '../constants/routes';
import { theme } from '../theme/theme';
import { TestUser } from '../types';

type FrontpageProps = {
    onNavigate: (route: AppRoute) => void;
    currentUser: TestUser;
};

const isWeb = Platform.OS === 'web';

export function Frontpage({ onNavigate, currentUser }: FrontpageProps) {
    const [clicks, setClicks] = useState(0);
    const [scale, setScale] = useState(1);
    const [showLockedModal, setShowLockedModal] = useState(false);
    const [lockedFactionName, setLockedFactionName] = useState('');
    const { width } = useWindowDimensions();
    const isDesktopWeb = Platform.OS === 'web' && width >= 1024;

    const factionEntries = [
        { label: 'Lizardman', status: 'Active', locked: false, route: AppRoute.Champions, lockedName: 'Lizardman' },
        { label: 'Human', status: 'Locked', locked: true, route: null, lockedName: 'The Humans' },
        { label: 'Elves', status: 'Locked', locked: true, route: null, lockedName: 'The Elves' },
    ] as const;

    const handleClick = () => {
        setClicks((prev) => prev + 1);
        setScale(1.1);
        setTimeout(() => setScale(1), 100);
    };

    const handleFactionPress = (entry: typeof factionEntries[number]) => {
        if (entry.route) {
            onNavigate(entry.route);
            return;
        }

        setLockedFactionName(entry.lockedName);
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
                <View style={[styles.shell, isDesktopWeb && styles.shellDesktop]}>
                    <View style={styles.mainColumn}>
                        <View style={styles.headerSection}>
                            <Text style={styles.title}>Lizardman</Text>
                            <View style={styles.resourceSection}>
                                <View style={styles.resourceItem}>
                                    <Text style={styles.resourceValue}>{clicks}</Text>
                                    <Image
                                        source={require('../../assets/images/Factions/Lizardman/Lizardman clicker icon.png')}
                                        style={styles.resourceIcon}
                                    />
                                </View>
                                <View style={styles.resourceItem}>
                                    <Text style={styles.resourceValue}>1485</Text>
                                    <Image
                                        source={require('../../assets/images/General/coin.png')}
                                        style={styles.resourceIcon}
                                    />
                                </View>
                            </View>
                        </View>

                        <View style={styles.page}>
                            <TouchableOpacity
                                onPress={handleClick}
                                activeOpacity={0.8}
                                style={styles.clickerContainer}
                            >
                                <Image
                                    source={require('../../assets/images/Factions/Lizardman/Lizardman clicker icon.png')}
                                    style={[styles.clickerIcon, { transform: [{ scale }] }]}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {isDesktopWeb ? (
                        <View style={styles.sidePanel}>
                            <Text style={styles.sidePanelTitle}>Factions</Text>

                            <View style={styles.sidePanelList}>
                                {factionEntries.map((entry) => (
                                    <TouchableOpacity
                                        key={entry.label}
                                        style={[
                                            styles.sidePanelRow,
                                            entry.locked ? styles.sidePanelRowLocked : styles.sidePanelRowActive,
                                        ]}
                                        activeOpacity={0.85}
                                        onPress={() => handleFactionPress(entry)}
                                    >
                                        <View style={styles.sidePanelRowContent}>
                                            <Text style={styles.sidePanelRowTitle}>{entry.label}</Text>
                                            <Text style={styles.sidePanelRowMeta}>{entry.status}</Text>
                                        </View>
                                        <Text style={styles.sidePanelRowArrow}>{'>'}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    ) : null}
                </View>
            </View>

            <Modal
                visible={showLockedModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowLockedModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>FACTION LOCKED</Text>
                        <Text style={styles.modalMessage}>{lockedFactionName} Faction is still Locked</Text>
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
    shell: {
        flex: 1,
    },
    shellDesktop: {
        flexDirection: 'row',
        gap: 0,
    },
    mainColumn: {
        flex: 1,
    },
    headerSection: {
        paddingTop: isWeb ? 20 : 50,
        paddingHorizontal: 16,
        alignItems: 'flex-start',
    },
    title: {
        fontSize: isWeb ? 32 : 24,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 12,
    },
    resourceSection: {
        flexDirection: 'column',
        gap: 8,
    },
    resourceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: theme.colors.background,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    resourceIcon: {
        width: 20,
        height: 20,
        borderRadius: 10,
    },
    resourceValue: {
        fontSize: isWeb ? 18 : 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    page: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    clickerContainer: {
        marginVertical: 30,
        alignItems: 'center',
        justifyContent: 'center',
        width: isWeb ? 190 : 160,
        height: isWeb ? 190 : 160,
        backgroundColor: theme.colors.background,
        borderRadius: isWeb ? 95 : 80,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    clickerIcon: {
        width: isWeb ? 178 : 150,
        height: isWeb ? 178 : 150,
        borderRadius: isWeb ? 89 : 75,
    },
    sidePanel: {
        width: 320,
        alignSelf: 'stretch',
        marginTop: 0,
        marginBottom: 0,
        marginRight: 0,
        paddingTop: 20,
        justifyContent: 'flex-start',
        backgroundColor: 'rgba(6, 18, 14, 0.74)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.24,
        shadowRadius: 24,
    },
    sidePanelTitle: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: '800',
        marginBottom: 18,
        paddingHorizontal: 22,
    },
    sidePanelList: {
        gap: 0,
    },
    sidePanelRow: {
        minHeight: 78,
        paddingHorizontal: 20,
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.65)',
    },
    sidePanelRowActive: {
        backgroundColor: 'rgba(69, 142, 54, 0.6)',
    },
    sidePanelRowLocked: {
        backgroundColor: 'rgba(142, 54, 54, 0.6)',
    },
    sidePanelRowContent: {
        gap: 6,
    },
    sidePanelRowTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    sidePanelRowMeta: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    sidePanelRowArrow: {
        color: '#D8C48D',
        fontSize: 28,
        lineHeight: 28,
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
