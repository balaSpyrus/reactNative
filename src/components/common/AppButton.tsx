import {
  StyleSheet,
  TouchableOpacityProps,
  TouchableOpacity,
  Text,
  TextProps,
} from 'react-native';
import React from 'react';
import {PRIMARY_ACCENT, SECONDARY_ACCENT} from '../../utils';

const buttonStyles = StyleSheet.create({
  // ...
  appButtonContainer: {
    elevation: 3,
    backgroundColor: PRIMARY_ACCENT,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  disabled: {
    backgroundColor: 'gray',
  },
  appButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',
    textTransform: 'uppercase',
  },
});

const AppButton: React.FC<
  {
    title: string;
    textProps?: TextProps;
  } & TouchableOpacityProps
> = ({onPress, title, style = {}, disabled, textProps, ...rest}) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    style={[
      buttonStyles.appButtonContainer,
      style,
      disabled ? buttonStyles.disabled : false,
    ]}
    {...rest}>
    <Text style={buttonStyles.appButtonText} disabled={disabled} {...textProps}>
      {title}
    </Text>
  </TouchableOpacity>
);

export default AppButton;
