import { registerRootComponent } from "expo";

import App from "./App";
import { remapProps } from "nativewind";
import { MapView } from "@rnmapbox/maps";

// remapping props for nativewind
remapProps(MapView, {
  className: "style",
});

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
