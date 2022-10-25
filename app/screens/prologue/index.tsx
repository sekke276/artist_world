import React from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  Button,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {images} from '@assets/images/index';
import {CommonType} from '@utils/types';
import {getSize} from '@utils/responsive';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'white',
  },
  button: {
    width: 295,
    height: 56,
    backgroundColor: 'rgba(233, 64, 87, 1)',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

interface Props {}

export const Prologue: CommonType.AppScreenProps<'prologue', Props> = ({
  navigation,
}) => {
  return (
    <View style={styles.container}>
      <Image
        source={images.girl}
        style={{
          width: getSize.v(235),
          height: getSize.v(360),
          borderRadius: 15,
        }}
      />
      <View>
        <TouchableOpacity style={styles.button}>
          <Text style={{color: 'white', fontSize: getSize.font(16)}}>
            Create an account
          </Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 20,
          }}>
          <Text style={{fontSize: 16, color: 'rgba(0, 0, 0, 0.7)'}}>
            Already have an account?{' '}
          </Text>
          <TouchableWithoutFeedback
            onPress={() => navigation.navigate('phoneLogin')}>
            <Text
              style={{
                color: 'rgba(233, 64, 87, 1)',
                fontSize: getSize.font(16),
              }}>
              Sign In!
            </Text>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </View>
  );
};
