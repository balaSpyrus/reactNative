import React, {PropsWithChildren} from 'react';
import {ScrollView, View, Text as TextN, TextProps} from 'react-native';
import {SECONDARY_ACCENT} from '../../utils';

const Text: React.FC<PropsWithChildren & TextProps> = ({
  children,
  style,
  ...props
}) => {
  return (
    <TextN style={[{color: SECONDARY_ACCENT}, style]} {...props}>
      {children}
    </TextN>
  );
};

export default Text;
