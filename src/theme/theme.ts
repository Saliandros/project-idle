export const theme = {
  colors: {

    // Background colors
    background: 'rgba(0, 0, 0, 0.65)',
    navColor: 'rgba(0, 0, 0, 0.65)',
    buttonUnlocked: 'rgba(69, 142,54, 1)',
    buttonLocked: 'rgba(142, 54, 54, 1)',

    //text colors
    textPrimary: 'rgba(255, 255, 255, 1)',
    feedbackSuccess: 'rgba(120, 255, 140, 1)',
    feedbackError: 'rgba(255, 120, 120, 1)',
  },
    backgrounds: {

    // Images I use a backgrounds
    WorldMapImage: require('../../assets/images/Backgrounds/WorldMap.png'),
  },
    sfx: {

    // UI sound effects
    buttonClick: require('../../assets/SFX/ButtonClick.mp3'),
  },
    image: {

    // Image rules
    resizeMode: 'cover' as const,
  },
} as const;