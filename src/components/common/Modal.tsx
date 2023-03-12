import React, {PropsWithChildren} from 'react';
import {StyleSheet} from 'react-native';
import {View} from 'react-native';
import ModalLibrary from 'react-native-modal';

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center'},
});

interface Props extends PropsWithChildren {
  isOpen: boolean;
}

const Modal: React.FC<Props> = ({isOpen, children}) => {
  return (
    <View>
      <ModalLibrary isVisible={isOpen}>
        <View style={styles.container}>{children}</View>
      </ModalLibrary>
    </View>
  );
};

export default Modal;
