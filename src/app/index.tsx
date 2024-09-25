import { View, Text } from "react-native";
import React from "react";
import { Env } from "@env";

const IndexScreen = () => {
  return (
    <View>
      <Text style={{ fontFamily: "Open-Sans" }}>
        {Env.NAME} - v{Env.VERSION} Tag
      </Text>
    </View>
  );
};

export default IndexScreen;
