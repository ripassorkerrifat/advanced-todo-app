/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import {Platform} from "react-native";

// Purple primary color
const primaryPurple = "#8B5CF6";
const primaryPurpleDark = "#7C3AED";

export const Colors = {
     light: {
          text: "#11181C",
          background: "#FFFFFF",
          tint: primaryPurple,
          icon: "#687076",
          tabIconDefault: "#687076",
          tabIconSelected: primaryPurple,
          card: "#F9FAFB",
          border: "#E5E7EB",
          primary: primaryPurple,
          secondary: "#A78BFA",
     },
     dark: {
          text: "#F1F5F9", // Brighter text for better visibility
          background: "#0F172A", // Dark blue-black
          tint: primaryPurpleDark,
          icon: "#CBD5E1", // Brighter icons
          tabIconDefault: "#94A3B8",
          tabIconSelected: primaryPurpleDark,
          card: "#1E293B", // Slightly lighter dark blue
          border: "#334155",
          primary: primaryPurpleDark,
          secondary: "#A78BFA",
     },
};

export const Fonts = Platform.select({
     ios: {
          /** iOS `UIFontDescriptorSystemDesignDefault` */
          sans: "system-ui",
          /** iOS `UIFontDescriptorSystemDesignSerif` */
          serif: "ui-serif",
          /** iOS `UIFontDescriptorSystemDesignRounded` */
          rounded: "ui-rounded",
          /** iOS `UIFontDescriptorSystemDesignMonospaced` */
          mono: "ui-monospace",
     },
     default: {
          sans: "normal",
          serif: "serif",
          rounded: "normal",
          mono: "monospace",
     },
     web: {
          sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          serif: "Georgia, 'Times New Roman', serif",
          rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
          mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
     },
});
