import { ImageBackground, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useState } from 'react';

import { AppRoute } from '../constants/routes';
import { TestUser } from '../types';
import { theme } from '../theme/theme';

type FrontpageProps = {
    onNavigate: (route: AppRoute) => void;
    currentUser: TestUser;
};

export function Frontpage({ onNavigate, currentUser }: FrontpageProps) {
    const [clicks, setClicks] = useState(0);
    const [scale, setScale] = useState(1);

    const handleClick = () => {
        setClicks(prev => prev + 1);
        // Animation effect
        setScale(1.1);
        setTimeout(() => setScale(1), 100);
    };
    return (
        <ImageBackground
            source={require('../../assets/images/Factions/Lizardman/Shattered Isles Map.png')}
            style={styles.background}
            imageStyle={styles.backgroundImage}
            resizeMode="cover"
        >
            <View style={styles.overlay}>
                {/* Header section with title and resources */}
                <View style={styles.headerSection}>
                    <Text style={styles.title}>Lizardman</Text>
                    <View style={styles.resourceSection}>
                        <View style={styles.resourceItem}>
                            <Image
                                source={require('../../assets/images/Factions/Lizardman/Lizardman clicker icon.png')}
                                style={styles.resourceIcon}
                            />
                            <Text style={styles.resourceValue}>{clicks} Meat</Text>
                        </View>
                        <View style={styles.resourceItem}>
                            <Text style={styles.resourceIconText}>🪙</Text>
                            <Text style={styles.resourceValue}>1485</Text>
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
    headerSection: {
        paddingTop: 50,
        paddingHorizontal: 16,
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 24,
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
    },
    resourceIcon: {
        width: 20,
        height: 20,
        borderRadius: 10,
    },
    resourceIconText: {
        fontSize: 20,
    },
    resourceValue: {
        fontSize: 16,
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
        width: 160,
        height: 160,
        backgroundColor: theme.colors.background,
        borderRadius: 80,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    clickerIcon: {
        width: 150,
        height: 150,
        borderRadius: 75,
    },
});
