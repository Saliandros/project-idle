export const theme = {
  colors: {
    background: 'rgba(0, 0, 0, 0.65)',
    navColor: 'rgba(0, 0, 0, 0.65)',
    buttonUnlocked: 'rgba(69, 142, 54, 1)',
    buttonLocked: 'rgba(142, 54, 54, 1)',
    textPrimary: 'rgba(255, 255, 255, 1)',
    feedbackSuccess: 'rgba(120, 255, 140, 1)',
    feedbackError: 'rgba(255, 120, 120, 1)',
  },
  backgrounds: {
    WorldMapImage: require('../../assets/images/Backgrounds/WorldMap.png'),
  },
  sfx: {
    buttonClick: require('../../assets/SFX/ButtonClick.mp3'),
  },
  image: {
    resizeMode: 'cover' as const,
  },
} as const;
