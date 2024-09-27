export default {
  "expo": {
    "name": "eventApp",
    "slug": "eventApp",
    "version": "1.0.0",
    "scheme": "eventApp",
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-router",
      "expo-font",
      [
        "@rnmapbox/maps",
        {
          "RNMapboxMapsDownloadToken": process.env.EXPO_MAPBOX_SK,
          "RNMapboxMapsVersion": "11.0.0"
        }
      ],
      [
        "expo-location",
        {
          "locationWhenInUsePermission": "Show current location on map."
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true,
      "tsconfigPaths": true
    },
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "dark",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#000"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.itzyashh.eventApp"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#000"
      },
      "package": "com.itzyashh.eventApp"
    }
  }
}
