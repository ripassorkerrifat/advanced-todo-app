// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {SymbolViewProps, SymbolWeight} from "expo-symbols";
import {ComponentProps} from "react";
import {OpaqueColorValue, type StyleProp, type TextStyle} from "react-native";

type IconMapping = Record<
     SymbolViewProps["name"],
     ComponentProps<typeof MaterialIcons>["name"]
>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
     "house.fill": "home",
     "paperplane.fill": "send",
     "chevron.left.forwardslash.chevron.right": "code",
     "chevron.right": "chevron-right",
     "gearshape.fill": "settings",
     "person.fill": "person",
     plus: "add",
     "chevron.left": "chevron-left",
     trash: "delete",
     "trash.fill": "delete",
     checkmark: "check",
     "checkmark.circle": "check-circle",
     "checkmark.circle.fill": "check-circle",
     calendar: "calendar-today",
     "xmark.circle.fill": "cancel",
     "list.bullet": "list",
     pencil: "edit",
     envelope: "email",
     phone: "phone",
     "text.alignleft": "format-align-left",
     "doc.text": "description",
     folder: "folder",
     flag: "flag",
     "chart.bar": "bar-chart",
     magnifyingglass: "search",
     "chevron.down": "keyboard-arrow-down",
     "chevron.up": "keyboard-arrow-up",
     "mic.fill": "mic",
     "arrow.clockwise": "refresh",
     "info.circle": "info",
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
     name,
     size = 24,
     color,
     style,
}: {
     name: IconSymbolName;
     size?: number;
     color: string | OpaqueColorValue;
     style?: StyleProp<TextStyle>;
     weight?: SymbolWeight;
}) {
     return (
          <MaterialIcons
               color={color}
               size={size}
               name={MAPPING[name]}
               style={style}
          />
     );
}
