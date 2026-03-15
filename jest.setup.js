/* eslint-disable no-undef */
import "react-native-gesture-handler/jestSetup";

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

jest.mock("expo-font", () => ({
  useFonts: () => [true, null],
  loadAsync: () => Promise.resolve(),
}));

jest.mock("expo-asset", () => ({
  Asset: {
    fromModule: () => ({
      downloadAsync: () => Promise.resolve(),
      uri: "uri",
    }),
  },
}));

jest.mock("expo-constants", () => ({
  expoConfig: {
    name: "test",
    slug: "test",
  },
  default: {
    expoConfig: {
      name: "test",
      slug: "test",
    },
  },
}));

// Mock @expo/vector-icons
jest.mock("@expo/vector-icons", () => ({
  FontAwesome: "FontAwesome",
}));

// Mock Alert
jest.mock("react-native", () => {
  const reactNative = jest.requireActual("react-native");
  reactNative.Alert.alert = jest.fn();
  return reactNative;
});

// Mock expo-router
jest.mock("expo-router", () => ({
  Stack: {
    Screen: jest.fn(),
  },
  useRouter: jest.fn(),
  useLocalSearchParams: jest.fn(),
}));

// Mock expo-splash-screen
jest.mock("expo-splash-screen", () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
}));
