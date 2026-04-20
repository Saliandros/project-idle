import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

import { LoginCard } from "../components/LoginCard";
import { RegisterCard } from "../components/RegisterCard";
import { loginUser, registerUser } from "../services/Auth";
import { theme } from "../theme/theme";
import { TestUser } from "../types";

type AuthView = "login" | "register";

type LoginProps = {
  onLogin?: (user: TestUser) => void;
};

// Konstanter til baggrundspanorering - justeret for at give en subtil bevægelse uden at afsløre tomme kanter.
const PAN_LIMIT = 0.95;

// Varighed for en komplet pan-cyklus (frem og tilbage) i millisekunder.
const PAN_CYCLE_DURATION = 22000;
const MOBILE_BG_SCALE = 1.08;
const DESKTOP_BG_SCALE = 1.22;

// Forhindre for meget vertikal panering på mobile enheder, hvor skærmforholdet ofte er mere begrænset.
const VERTICAL_PAN_LIMIT = 0.7;
const FALLBACK_IMAGE_ASPECT_RATIO = 1.65;

// Login-siden håndterer både login- og registreringsvisninger med en animeret baggrund
// for at skabe en engagerende oplevelse uden at stjæle fokus fra auth-kortene.
export function Login({ onLogin }: LoginProps) {
  
  // Gør så Login vises som standard.
  const [view, setView] = useState<AuthView>("login");

  const [loginError, setLoginError] = useState<string | null>(null);

  const [loginSuccess, setLoginSuccess] = useState<string | null>(null);

  const [registerError, setRegisterError] = useState<string | null>(null);

  // Låser login-knappen mens login-kald kører.
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  // Låser register-knappen mens register-kald kører.
  const [isSubmittingRegister, setIsSubmittingRegister] = useState(false);
  
  // Aktuel størrelse på synligt viewport-område (bruges til baggrundsberegning).
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  // Animeret værdi (0..1) som driver baggrundens pan-bevægelse.
  const motion = useRef(new Animated.Value(0)).current;

  // Web bruger ikke native driver til denne animation.
  const useNativeDriver = Platform.OS !== "web";

  const { width } = useWindowDimensions();
  
  const isMobile = width < 768;

  // Hent billedets ratio fra asset metadata med en sikker fallback til platforme, hvor metadata kan mangle.
  const imageAspectRatio = useMemo(() => {
    const backgroundImage = theme.backgrounds.WorldMapImage as
      | number
      | { width?: number; height?: number };

    // bruger ratio direkte fra asset-objektet, hvis metadata findes.
    if (
      typeof backgroundImage === "object" &&
      backgroundImage.width &&
      backgroundImage.height
    ) {
      // Ratio returneres her direkte fra asset metadata.
      return backgroundImage.width / backgroundImage.height;
    }

    // på native prøves resolveAssetSource som fallback-kilde til width/height.
    if (
      Platform.OS !== "web" &&
      typeof Image.resolveAssetSource === "function"
    ) {
      const resolvedImage = Image.resolveAssetSource(
        theme.backgrounds.WorldMapImage,
      );

      if (resolvedImage?.width && resolvedImage?.height) {
        // Ratio returneres her fra resolved asset source.
        return resolvedImage.width / resolvedImage.height;
      }
    }

    // sidste fallback hvis ingen metadata kunne læses.
    return FALLBACK_IMAGE_ASPECT_RATIO;
  }, []);

  // Skaleringsfaktor for baggrundsbildet ud fra device-type.
  const backgroundScale = isMobile ? MOBILE_BG_SCALE : DESKTOP_BG_SCALE;

  // Beregner den bredde billedet skal have for at dække hele viewporten uden tomme kanter.
  const coveredImageWidth = useMemo(() => {
    if (!viewport.width || !viewport.height) {
      return viewport.width;
    }

    return (
      Math.max(viewport.width, viewport.height * imageAspectRatio) *
      backgroundScale
    );
  }, [backgroundScale, imageAspectRatio, viewport.height, viewport.width]);

  // Beregner den tilsvarende højde efter skaleringsreglen.
  const coveredImageHeight = useMemo(() => {
    if (!viewport.height) {
      return viewport.height;
    }

    return viewport.height * backgroundScale;
  }, [backgroundScale, viewport.height]);

  // Maksimal horisontal pan-afstand baseret på faktisk overflow.
  const horizontalShift = useMemo(() => {
    if (!viewport.width || !viewport.height) {
      return 0;
    }

    // Panorer kun inden for overflow, så baggrunden ikke afslører tomme kanter.
    const overflowWidth = Math.max(0, coveredImageWidth - viewport.width);
    return (overflowWidth / 2) * PAN_LIMIT;
  }, [coveredImageWidth, viewport.height, viewport.width]);

  // Maksimal vertikal pan-afstand baseret på faktisk overflow.
  const verticalShift = useMemo(() => {
    if (!viewport.width || !viewport.height) {
      return 0;
    }

    const overflowHeight = Math.max(0, coveredImageHeight - viewport.height);
    return (overflowHeight / 2) * VERTICAL_PAN_LIMIT;
  }, [coveredImageHeight, viewport.height, viewport.width]);

  // Omsætter motion-værdien til translateX/translateY transform for baggrunden.
  const backgroundTransform = useMemo(
    () => [
      {
        translateX: motion.interpolate({
          inputRange: [0, 1],
          outputRange: [-horizontalShift, horizontalShift],
        }),
      },
      {
        translateY: motion.interpolate({
          inputRange: [0, 1],
          outputRange: [-verticalShift, verticalShift],
        }),
      },
    ],
    [horizontalShift, motion, verticalShift],
  );

  useEffect(() => {
    // Ingen overflow betyder ingen sikker pan-zone, så vi deaktiverer animationen helt.
    if (horizontalShift <= 0 && verticalShift <= 0) {
      motion.stopAnimation();
      motion.setValue(0);
      return;
    }

    // Rolig frem-og-tilbage bevægelse giver liv i baggrunden uden at stjæle fokus.
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(motion, {
          toValue: 1,
          duration: PAN_CYCLE_DURATION / 2,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver,
        }),
        Animated.timing(motion, {
          toValue: 0,
          duration: PAN_CYCLE_DURATION / 2,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver,
        }),
      ]),
    );

    loop.start();

    return () => {
      loop.stop();
      motion.stopAnimation();
    };
  }, [horizontalShift, motion, useNativeDriver, verticalShift]);

  // Kaldes fra LoginCard: udfører login, håndterer loading state og fejlbesked.
  const handleLoginSubmit = async (input: { username: string; password: string; keepLoggedIn: boolean }) => {
    // Nulstil beskeder før nyt login-forsøg.
    setLoginError(null);
    setLoginSuccess(null);
    setIsSubmittingLogin(true);

    try {
      const user = await loginUser(input.username, input.password);
      onLogin?.(user);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Noget gik galt under login.';
      setLoginError(message);
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  // Kaldes fra RegisterCard: validerer passwords, opretter konto og skifter tilbage til login.
  const handleRegisterSubmit = async (input: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    // Registrering starter med clean state for fejl/succes.
    setRegisterError(null);
    setLoginSuccess(null);

    if (input.password !== input.confirmPassword) {
      setRegisterError('Password og bekræftet password skal være ens.');
      return;
    }

    setIsSubmittingRegister(true);

    try {
      await registerUser({
        username: input.username,
        email: input.email,
        password: input.password,
      });
      setView('login');
      setLoginError(null);
      setLoginSuccess('Konto oprettet. Du kan nu logge ind.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Noget gik galt under oprettelse.';
      setRegisterError(message);
    } finally {
      setIsSubmittingRegister(false);
    }
  };

  return (
    // Rodcontainer med onLayout, så vi altid har opdateret viewport til billedberegningerne.
    <View
      style={styles.background}
      onLayout={(event) => {
        const { width: layoutWidth, height: layoutHeight } =
          event.nativeEvent.layout;
        setViewport({ width: layoutWidth, height: layoutHeight });
      }}
    >
      {/* Animeret baggrundsbillede, centreret og skaleret til at dække hele fladen. */}
      <Animated.Image
        source={theme.backgrounds.WorldMapImage}
        resizeMode={theme.image.resizeMode}
        style={[
          styles.backgroundImage,
          viewport.height > 0 && {
            width: coveredImageWidth,
            height: coveredImageHeight,
            left: (viewport.width - coveredImageWidth) / 2,
            top: (viewport.height - coveredImageHeight) / 2,
          },
          { transform: backgroundTransform },
        ]}
      />
      {/* Overlay holder auth-kortet i fokus over den animerede baggrund. */}
      <View
        style={[styles.overlay, { backgroundColor: theme.colors.background }]}
      >
        {/* Login-visning: brugeren kan logge ind eller skifte til registrering. */}
        {view === "login" ? (
          <LoginCard
            onRegister={() => {
              // Skift til register-kort og ryd gamle beskeder.
              setLoginError(null);
              setLoginSuccess(null);
              setView("register");
            }}
            onSubmit={handleLoginSubmit}
            isSubmitting={isSubmittingLogin}
            errorMessage={loginError}
            successMessage={loginSuccess}
          />
        ) : (
          <>
          <RegisterCard
            onLogin={() => {
              // Skift tilbage til login-kort og ryd gamle beskeder.
              setRegisterError(null);
              setLoginSuccess(null);
              setView("login");
            }}
            onSubmit={handleRegisterSubmit}
            isSubmitting={isSubmittingRegister}
            errorMessage={registerError}
          />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    overflow: "hidden",
    backgroundColor: "#000000",
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
  },
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 80,
  },
});
