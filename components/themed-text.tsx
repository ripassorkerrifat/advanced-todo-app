import {StyleSheet, Text, type TextProps} from "react-native";

import {Colors} from "@/constants/theme";
import {useTheme} from "@/store/ThemeContext";

export type ThemedTextProps = TextProps & {
     lightColor?: string;
     darkColor?: string;
     type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedText({
     style,
     lightColor,
     darkColor,
     type = "default",
     ...rest
}: ThemedTextProps) {
     const {currentTheme} = useTheme();
     const themeColor =
          lightColor || darkColor
               ? (currentTheme === "dark" ? darkColor : lightColor) ||
                 Colors[currentTheme].text
               : Colors[currentTheme].text;

     return (
          <Text
               style={[
                    {color: themeColor},
                    type === "default" ? styles.default : undefined,
                    type === "title" ? styles.title : undefined,
                    type === "defaultSemiBold"
                         ? styles.defaultSemiBold
                         : undefined,
                    type === "subtitle" ? styles.subtitle : undefined,
                    type === "link" ? styles.link : undefined,
                    style,
               ]}
               {...rest}
          />
     );
}

const styles = StyleSheet.create({
     default: {
          fontSize: 16,
          lineHeight: 24,
     },
     defaultSemiBold: {
          fontSize: 16,
          lineHeight: 24,
          fontWeight: "600",
     },
     title: {
          fontSize: 32,
          fontWeight: "bold",
          lineHeight: 32,
     },
     subtitle: {
          fontSize: 20,
          fontWeight: "bold",
     },
     link: {
          lineHeight: 30,
          fontSize: 16,
          color: "#0a7ea4",
     },
});
