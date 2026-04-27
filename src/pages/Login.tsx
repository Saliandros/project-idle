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

const PAN_LIMIT = 0.95;
const PAN_CYCLE_DURATION = 22000;
const MOBILE_BG_SCALE = 1.08;
const DESKTOP_BG_SCALE = 1.22;
const VERTICAL_PAN_LIMIT = 0.7;
const FALLBACK_IMAGE_ASPECT_RATIO = 1.65;

export function Login({ onLogin }: LoginProps) {
  const [view, setView] = useState<AuthView>("login");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);
  const [isSubmittingRegister, setIsSubmittingRegister] = useState(false);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const motion = useRef(new Animated.Value(0)).current;
  const useNativeDriver = Platform.OS !== "web";
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const imageAspectRatio = useMemo(() => {
    const backgroundImage = theme.backgrounds.WorldMapImage as
      | number
      | { width?: number; height?: number };

    if (
      typeof backgroundImage === "object" &&
      backgroundImage.width &&
      backgroundImage.height
    ) {
      return backgroundImage.width / backgroundImage.height;
    }

    if (
      Platform.OS !== "web" &&
      typeof Image.resolveAssetSource === "function"
    ) {
      const resolvedImage = Image.resolveAssetSource(
        theme.backgrounds.WorldMapImage,
      );

      if (resolvedImage?.width && resolvedImage?.height) {
        return resolvedImage.width / resolvedImage.height;
      }
    }

    return FALLBACK_IMAGE_ASPECT_RATIO;
  }, []);

  const backgroundScale = isMobile ? MOBILE_BG_SCALE : DESKTOP_BG_SCALE;

  const coveredImageWidth = useMemo(() => {
    if (!viewport.width || !viewport.height) {
      return viewport.width;
    }

    return (
      Math.max(viewport.width, viewport.height * imageAspectRatio) *
      backgroundScale
    );
  }, [backgroundScale, imageAspectRatio, viewport.height, viewport.width]);

  const coveredImageHeight = useMemo(() => {
    if (!viewport.height) {
      return viewport.height;
    }

    return viewport.height * backgroundScale;
  }, [backgroundScale, viewport.height]);

  const horizontalShift = useMemo(() => {
    if (!viewport.width || !viewport.height) {
      return 0;
    }

    const overflowWidth = Math.max(0, coveredImageWidth - viewport.width);
    return (overflowWidth / 2) * PAN_LIMIT;
  }, [coveredImageWidth, viewport.height, viewport.width]);

  const verticalShift = useMemo(() => {
    if (!viewport.width || !viewport.height) {
      return 0;
    }

    const overflowHeight = Math.max(0, coveredImageHeight - viewport.height);
    return (overflowHeight / 2) * VERTICAL_PAN_LIMIT;
  }, [coveredImageHeight, viewport.height, viewport.width]);

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
    if (horizontalShift <= 0 && verticalShift <= 0) {
      motion.stopAnimation();
      motion.setValue(0);
      return;
    }

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

  const handleLoginSubmit = async (input: {
    username: string;
    password: string;
    keepLoggedIn: boolean;
  }) => {
    setLoginError(null);
    setLoginSuccess(null);
    setIsSubmittingLogin(true);

    try {
      const user = await loginUser(input.username, input.password);
      onLogin?.(user);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Noget gik galt under login.";
      setLoginError(message);
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  const handleRegisterSubmit = async (input: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    setRegisterError(null);
    setLoginSuccess(null);

    if (input.password !== input.confirmPassword) {
      setRegisterError("Password og bekræftet password skal være ens.");
      return;
    }

    setIsSubmittingRegister(true);

    try {
      await registerUser({
        username: input.username,
        email: input.email,
        password: input.password,
      });
      setView("login");
      setLoginError(null);
      setLoginSuccess("Konto oprettet. Du kan nu logge ind.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Noget gik galt under oprettelse.";
      setRegisterError(message);
    } finally {
      setIsSubmittingRegister(false);
    }
  };

  return (
    <View
      style={styles.background}
      onLayout={(event) => {
        const { width: layoutWidth, height: layoutHeight } =
          event.nativeEvent.layout;
        setViewport({ width: layoutWidth, height: layoutHeight });
      }}
    >
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
      <View
        style={[styles.overlay, { backgroundColor: theme.colors.background }]}
      >
        {view === "login" ? (
          <LoginCard
            onRegister={() => {
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
          <RegisterCard
            onLogin={() => {
              setRegisterError(null);
              setLoginSuccess(null);
              setView("login");
            }}
            onSubmit={handleRegisterSubmit}
            isSubmitting={isSubmittingRegister}
            errorMessage={registerError}
          />
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
