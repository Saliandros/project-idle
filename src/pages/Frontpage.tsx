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
import { factionDefinitions } from '../data/factions';
import { useGameStore } from '../store/useGameStore';
import { theme } from '../theme/theme';
import { TestUser } from '../types';
import { formatDisplayNumber } from '../utils/formatNumber';
import { fromRawResourceAmount } from '../utils/resources';

type FrontpageProps = {
    onNavigate: (route: AppRoute) => void;
    currentUser: TestUser;
};

const isWeb = Platform.OS === 'web';

export function Frontpage({ onNavigate, currentUser }: FrontpageProps) {
    const [scale, setScale] = useState(1);
    const [showLockedModal, setShowLockedModal] = useState(false);
    const [showFactionPicker, setShowFactionPicker] = useState(false);
    const [lockedFactionName, setLockedFactionName] = useState('');
    const { width } = useWindowDimensions();
    const isDesktopWeb = Platform.OS === 'web' && width >= 1024;
    const gold = useGameStore((state) => state.resources.gold);
    const performClick = useGameStore((state) => state.performClick);
    const activeFactionId = useGameStore((state) => state.activeFactionId);
    const unlockedFactionIds = useGameStore((state) => state.unlockedFactionIds);
    const setActiveFaction = useGameStore((state) => state.setActiveFaction);
    const activeFaction = factionDefinitions.find((entry) => entry.id === activeFactionId) ?? factionDefinitions[0];
    const primaryResourceAmount = useGameStore((state) =>
        fromRawResourceAmount(activeFaction.clickResourceId, state.resources[activeFaction.clickResourceId])
    );
    const goldAmount = fromRawResourceAmount('gold', gold);

    const handleClick = () => {
        performClick();
        setScale(1.1);
        setTimeout(() => setScale(1), 100);
    };

    const handleFactionPress = (entry: typeof factionDefinitions[number]) => {
        if (unlockedFactionIds.includes(entry.id)) {
            setActiveFaction(entry.id);
        }

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
                            <TouchableOpacity
                                style={styles.factionTrigger}
                                activeOpacity={0.85}
                                onPress={() => setShowFactionPicker(true)}
                            >
                                <View style={styles.factionTriggerTextWrap}>
                                    <Text style={styles.factionTriggerEyebrow}>Active Faction</Text>
                                    <Text style={styles.title}>{activeFaction.label}</Text>
                                </View>
                                <Text style={styles.factionTriggerChevron}>v</Text>
                            </TouchableOpacity>
                            <View style={styles.resourceSection}>
                                <View style={styles.resourceItem}>
                                    <Text style={styles.resourceValue}>
                                        {Math.floor(primaryResourceAmount)}
                                    </Text>
                                    <Image
                                        source={require('../../assets/images/Factions/Lizardman/Lizardman clicker icon.png')}
                                        style={styles.resourceIcon}
                                    />
                                </View>
                                <View style={styles.resourceItem}>
                                    <Text style={styles.resourceValue}>{formatDisplayNumber(goldAmount)}</Text>
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
                                {factionDefinitions.map((entry) => (
                                    <TouchableOpacity
                                        key={entry.label}
                                        style={[
                                            styles.sidePanelRow,
                                            unlockedFactionIds.includes(entry.id) ? styles.sidePanelRowActive : styles.sidePanelRowLocked,
                                            activeFactionId === entry.id && styles.sidePanelRowCurrent,
                                        ]}
                                        activeOpacity={0.85}
                                        onPress={() => handleFactionPress(entry)}
                                    >
                                        <View style={styles.sidePanelRowContent}>
                                            <Text style={styles.sidePanelRowTitle}>{entry.label}</Text>
                                            <Text style={styles.sidePanelRowMeta}>
                                                {activeFactionId === entry.id ? 'Current' : unlockedFactionIds.includes(entry.id) ? 'Active' : 'Locked'}
                                            </Text>
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
                visible={showFactionPicker}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowFactionPicker(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.factionPickerContainer}>
                        <Text style={styles.modalTitle}>SELECT FACTION</Text>
                        <View style={styles.pickerList}>
                            {factionDefinitions.map((entry) => {
                                const isUnlocked = unlockedFactionIds.includes(entry.id);
                                const isCurrent = activeFactionId === entry.id;

                                return (
                                    <TouchableOpacity
                                        key={entry.id}
                                        style={[
                                            styles.pickerRow,
                                            isUnlocked ? styles.pickerRowUnlocked : styles.pickerRowLocked,
                                            isCurrent && styles.pickerRowCurrent,
                                        ]}
                                        onPress={() => {
                                            if (isUnlocked) {
                                                setActiveFaction(entry.id);
                                                setShowFactionPicker(false);
                                                return;
                                            }

                                            setShowFactionPicker(false);
                                            setLockedFactionName(entry.lockedName);
                                            setShowLockedModal(true);
                                        }}
                                    >
                                        <View style={styles.pickerRowBody}>
                                            <Text style={styles.pickerRowText}>{entry.label}</Text>
                                            <Text style={styles.pickerRowMeta}>
                                                {isCurrent ? 'Current' : isUnlocked ? 'Available' : 'Locked'}
                                            </Text>
                                        </View>
                                        <Text style={styles.pickerRowArrow}>{'>'}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setShowFactionPicker(false)}
                        >
                            <Text style={styles.modalButtonText}>CLOSE</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

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
    factionTrigger: {
        minWidth: isWeb ? 260 : 220,
        minHeight: 68,
        marginBottom: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.colors.background,
        borderWidth: 1,
        borderColor: 'rgba(233, 215, 172, 0.24)',
    },
    factionTriggerTextWrap: {
        gap: 4,
    },
    factionTriggerEyebrow: {
        color: 'rgba(233, 215, 172, 0.76)',
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    factionTriggerChevron: {
        color: '#E9D7AC',
        fontSize: 18,
        fontWeight: '700',
    },
    title: {
        fontSize: isWeb ? 32 : 24,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 0,
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
    sidePanelRowCurrent: {
        backgroundColor: 'rgba(69, 142, 54, 0.8)',
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
    factionPickerContainer: {
        width: '100%',
        maxWidth: 440,
        backgroundColor: 'rgba(6, 18, 14, 0.94)',
        borderWidth: 1,
        borderColor: 'rgba(233, 215, 172, 0.3)',
        padding: 22,
        margin: 20,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 14 },
        shadowOpacity: 0.35,
        shadowRadius: 24,
        elevation: 18,
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
    pickerList: {
        width: '100%',
        gap: 8,
        marginBottom: 20,
    },
    pickerRow: {
        minHeight: 68,
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.28)',
    },
    pickerRowUnlocked: {
        backgroundColor: 'rgba(69, 142, 54, 0.6)',
    },
    pickerRowLocked: {
        backgroundColor: 'rgba(142, 54, 54, 0.6)',
    },
    pickerRowCurrent: {
        backgroundColor: 'rgba(69, 142, 54, 0.82)',
        borderWidth: 1,
        borderColor: 'rgba(233, 215, 172, 0.4)',
    },
    pickerRowBody: {
        gap: 4,
    },
    pickerRowText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
    },
    pickerRowMeta: {
        color: 'rgba(255, 255, 255, 0.76)',
        fontSize: 13,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.6,
    },
    pickerRowArrow: {
        color: '#E9D7AC',
        fontSize: 24,
        fontWeight: '700',
    },
});
