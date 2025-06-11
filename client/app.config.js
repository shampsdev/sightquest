module.exports = {
  expo: {
    name: "SightQuest",
    slug: "sightquest",
    version: "1.0.0",
    orientation: "portrait",
    scheme: "sightquest-scheme",
    icon: "./src/assets/icon.png",
    newArchEnabled: false,
    splash: {
      image: "./src/assets/icon.png",
      resizeMode: "contain",
      backgroundColor: "#111111",
    },
    ios: {
      buildNumber: "7",
      supportsTablet: true,
      bundleIdentifier: "com.shampsdev.sightquest",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSLocationAlwaysAndWhenInUseUsageDescription:
          "To be able to share your location with friends while playing. This app requires location in the background",
        NSLocationWhenInUseUsageDescription:
          "To be able to share your location with friends while playing. This app requires location while in use",
        NSMotionUsageDescription:
          "To be able to share your location with friends while playing. This app uses motion-detection to determine the motion-activity of the device (walking, vehicle, bicycle, etc)",
        UIBackgroundModes: ["location", "fetch", "processing"],
        BGTaskSchedulerPermittedIdentifiers: [
          "com.transistorsoft.fetch",
          "com.transistorsoft.customtask",
        ],
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./src/assets/icon.png",
        backgroundColor: "#111111",
      },
      edgeToEdgeEnabled: true,
      package: "com.shampsdev.sightquest",
    },
    extra: {
      mapboxToken: process.env.MAPBOX_TOKEN,
      apiUrl: process.env.API_URL || "https://sightquest.ru/",
      mapboxStyleUrl: process.env.MAPBOX_STYLE_URL,
      socketUrl: process.env.SOCKET_URL || "https://sightquest.ru",
      eas: {
        projectId: "ba7e05b8-d26d-4cba-acd0-aa04c79eca56",
      },
    },
    owner: "shampsdev",
    plugins: [
      [
        "expo-splash-screen",
        {
          backgroundColor: "#975DFF",
          image: "./src/assets/icon.png",
          dark: {
            image: "./src/assets/icon.png",
            backgroundColor: "#111111",
          },
          imageWidth: 200,
        },
      ],
      [
        "@rnmapbox/maps",
        {
          RNMapboxMapsDownloadToken:
            "sk.eyJ1IjoibWlrZWRlZ2VvZnJveSIsImEiOiJjbWJieWlicnUwdzQ2MmlzYjA0b2psdnVuIn0.S6eNlhjph0xm95IqTN-AuA",
        },
      ],
      "react-native-background-geolocation",
      [
        "expo-gradle-ext-vars",
        {
          googlePlayServicesLocationVersion: "21.1.0",
          appCompatVersion: "1.4.2",
        },
      ],
      "react-native-background-fetch",
    ],
  },
};
