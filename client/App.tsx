import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

import Mapbox from '@rnmapbox/maps';

Mapbox.setAccessToken(
  'sk.eyJ1IjoibWlrZWRlZ2VvZnJveSIsImEiOiJjbWJieWlicnUwdzQ2MmlzYjA0b2psdnVuIn0.S6eNlhjph0xm95IqTN-AuA'
);
Mapbox.Logger.setLogLevel('verbose');
Mapbox.Logger.setLogCallback((lcb) => {
  console.log(lcb);
  return true;
});

export default function App() {
  return (
    <View style={styles.container}>
      <Mapbox.MapView
        scaleBarEnabled={false}
        attributionEnabled={false}
        style={styles.map}
        styleURL='mapbox://styles/mikedegeofroy/cma57ielt004801s3gkciegzd'
      ></Mapbox.MapView>
      <StatusBar style='auto' />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
