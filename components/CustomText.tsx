import React from "react";
import { Text, TextProps } from "react-native";

export default function CustomText({ style, children, ...props }: TextProps) {
  return (
    <Text {...props} style={[{ fontFamily: "MoreSugar" }, style]}>
      {children}
    </Text>
  );
}
