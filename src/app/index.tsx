import { Env } from '@env';
import React from 'react';
import { Text, View } from 'react-native';

const IndexScreen = () => {
  return (
    <View>
      <Text>
        {Env.NAME} - v{Env.VERSION} Tag
      </Text>
    </View>
  );
};

export default IndexScreen;
