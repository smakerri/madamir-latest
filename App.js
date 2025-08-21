
import React from 'react';
import Principal from './Components/Principal'
import {
  StyleSheet, View
} from 'react-native';

const App: () => React$Node = () => {
  return (
    <>

              <View style={styles.container}>
                <Principal/>
              </View>

    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default App;
