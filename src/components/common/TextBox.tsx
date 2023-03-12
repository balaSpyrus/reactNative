import React from 'react';
import {TextInput, TextInputProps} from 'react-native';
import {SECONDARY_ACCENT} from '../../utils';

interface Props extends TextInputProps {}

const TextBox: React.FC<Props> = ({style = {}, ...props}) => (
  <TextInput
    style={{
      borderRadius: 5,
      padding: 8,
      margin: 8,
      backgroundColor: 'transparent',
      borderColor: SECONDARY_ACCENT,
      borderWidth: 1,
      color: 'black',
      ...(style as any),
    }}
    {...props}
  />
);
export default TextBox;
