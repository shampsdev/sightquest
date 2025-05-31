import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import MapView, { UrlTile } from 'react-native-maps';

const MAPBOX_TOKEN =
  'pk.eyJ1IjoibWlrZWRlZ2VvZnJveSIsImEiOiJja3ZiOGQwc3I0N29uMnVxd2xlbGVyZGQzIn0.11XK5mqIzfLBTfNTYOGDgw';

export default function App() {
  return (
    <View style={styles.container}>
      <MapView
        provider='google'
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 59.943801,
          longitude: 30.335833,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        mapType='none'
        showsCompass={false}
        showsBuildings={false}
        showsIndoors={false}
        showsIndoorLevelPicker={false}
        onPanDrag={() => {}}
      >
        <UrlTile
          urlTemplate={`https://api.mapbox.com/styles/v1/mikedegeofroy/cma57ielt004801s3gkciegzd/tiles/512/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}&format=webp`}
          maximumZ={22}
          flipY={false}
          tileSize={256}
        />
      </MapView>

      <StatusBar style='auto' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
