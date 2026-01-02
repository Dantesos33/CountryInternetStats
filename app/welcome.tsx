import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowRight, BarChart3, Globe, Shield, Zap } from "lucide-react-native";
import React, { useEffect } from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen() {
  const router = useRouter();
  const floatValue = useSharedValue(0);

  useEffect(() => {
    floatValue.value = withRepeat(withTiming(1, { duration: 2000 }), -1, true);
  }, []);

  const animatedLogoStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: floatValue.value * -15 },
        { scale: withSpring(floatValue.value * 0.05 + 1) },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={["#001D3D", "#003566", "#007AFF"]}
        style={styles.gradient}
      >
        <View style={styles.safeArea}>
          <Animated.View
            entering={FadeInUp.delay(300).duration(1000)}
            style={styles.logoSection}
          >
            <Animated.View style={animatedLogoStyle}>
              <View style={styles.logoGlow}>
                <Globe size={60} color="#fff" strokeWidth={1.5} />
              </View>
            </Animated.View>
          </Animated.View>

          <View style={styles.contentSection}>
            <Animated.View entering={FadeInUp.delay(500).duration(800)}>
              <Text style={styles.title}>DataGlobe</Text>
              <Text style={styles.subtitle}>
                Precision insights into global connectivity and digital trends.
              </Text>
            </Animated.View>

            <Animated.View
              entering={FadeInUp.delay(700).duration(800)}
              style={styles.featuresRow}
            >
              <FeatureItem
                icon={<BarChart3 size={18} color="#fff" />}
                label="Real-time Stats"
              />
              <FeatureItem
                icon={<Zap size={18} color="#fff" />}
                label="Fast Compare"
              />
              <FeatureItem
                icon={<Shield size={18} color="#fff" />}
                label="Verified Data"
              />
            </Animated.View>
          </View>

          <Animated.View
            entering={FadeInDown.delay(900).duration(1000)}
            style={styles.footerSection}
          >
            <TouchableOpacity
              style={styles.mainButton}
              activeOpacity={0.8}
              onPress={() => router.replace("/(tabs)")}
            >
              <LinearGradient
                colors={["#007AFF", "#005BBB"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Get Started</Text>
                <View style={styles.buttonIconCircle}>
                  <ArrowRight size={20} color="#007AFF" />
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <Text style={styles.versionText}>
              Version 1.0.0 • World Bank API
            </Text>
          </Animated.View>
        </View>
      </LinearGradient>
    </View>
  );
}

function FeatureItem({ icon, label }: { icon: any; label: string }) {
  return (
    <View style={styles.featureItem}>
      <View style={styles.featureIconContainer}>{icon}</View>
      <Text style={styles.featureLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 40,
    paddingHorizontal: 30,
    justifyContent: "space-between",
  },
  logoSection: {
    alignItems: "center",
    marginTop: height * 0.05,
  },
  logoGlow: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  contentSection: {
    alignItems: "center",
  },
  title: {
    fontSize: 48,
    fontWeight: "900",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 17,
    color: "rgba(255, 255, 255, 0.75)",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 15,
    marginBottom: 35,
  },
  featuresRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  featureItem: {
    alignItems: "center",
    width: 80,
  },
  featureIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  featureLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
    fontWeight: "600",
  },
  footerSection: {
    alignItems: "center",
  },
  mainButton: {
    width: "100%",
    height: 64,
    borderRadius: 32,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 20,
  },
  buttonGradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    marginRight: 12,
  },
  buttonIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  versionText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.4)",
    letterSpacing: 1,
    fontWeight: "700",
  },
});
