import React, {PropsWithChildren} from 'react';
import {ScrollView, View} from 'react-native';

interface Props extends PropsWithChildren {
  scrollable?: boolean;
}

const Container: React.FC<Props> = ({scrollable = false, children}) => {
  const Component = scrollable ? ScrollView : View;
  return <Component>{children}</Component>;
};

export default Container;
