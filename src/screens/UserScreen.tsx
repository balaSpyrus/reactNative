import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Text from '../components/common/Text';
import auth from '@react-native-firebase/auth';
import {useToast} from 'react-native-toast-notifications';

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', justifyContent: 'space-evenly'},
});

const UserScreen = () => {
  const toast = useToast();
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<any>();

  const onAuthStateChanged = useCallback(
    (user: any) => {
      console.log('user Data ' + user);
      setUser(user);
      if (initializing) setInitializing(false);
    },
    [initializing],
  );

  async function onGoogleButtonPress() {
    GoogleSignin.configure({
      offlineAccess: true,
      webClientId:
        '38744516932-t7vrep490vb5b3477o6dad020hqf7oq5.apps.googleusercontent.com',
    });
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices();
    // Get the users ID token
    const {idToken, user} = await GoogleSignin.signIn();

    console.log('im fetching ', user);

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, [onAuthStateChanged]);

  if (!user) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <GoogleSigninButton
          style={{width: 192, height: 48}}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={() =>
            onGoogleButtonPress()
              .then(() => console.log('Signed in with Google!'))
              .catch(e => toast.show(e.message, {type: 'danger'}))
          }
          disabled={initializing}
        />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text>User Screen</Text>
      {/* <Button title="Go to Home" onPress={() => navigation.navigate('Home')} /> */}
    </View>
  );
};

export default UserScreen;
