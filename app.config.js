export default {
  expo: {
    name: "my-health-app-clean",
    slug: "my-health-app-clean",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    updates: {
      fallbackToCacheTimeout: 0,
      url: "https://u.expo.dev/3a6eabd6-9f2f-4c92-b47e-b18251f3cd58",
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.rconman99.myhealthappclean",
      buildNumber: "1.0.0",
      userInterfaceStyle: "automatic",
      infoPlist: {
        UIUserInterfaceStyle: "Automatic",
        NSCameraUsageDescription: "This app requires camera access to scan QR codes.",
        NSPhotoLibraryUsageDescription: "This app requires photo library access to upload photos.",
      },
      config: {
        googleSignIn: {
          reservedClientId: "com.googleusercontent.apps.YOUR_CLIENT_ID", // 🔒 Replace with actual Client ID if needed
        },
      },
    },
    android: {
      package: "com.rconman99.myhealthappclean",
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      permissions: [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "ACCESS_FINE_LOCATION",
        "FOREGROUND_SERVICE",
      ],
      userInterfaceStyle: "automatic",
    },
    web: {
      favicon: "./assets/favicon.png",
      name: "my-health-app-clean",
      shortName: "HealthApp",
      themeColor: "#007AFF",
      backgroundColor: "#ffffff",
      display: "standalone",
      output: "expo", // ✅ FIXED: prevents expo-router dependency issue
    },
    extra: {
      eas: {
        projectId: "3a6eabd6-9f2f-4c92-b47e-b18251f3cd58",
      },
    },
  },
};