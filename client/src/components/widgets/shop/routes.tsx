import { View } from "react-native";
import RouteCard, { RouteCardProps } from "../route-card";
import { Coords } from "@/shared/interfaces/Coords";
import { Route } from "@/shared/interfaces/Route";

export interface RouteData {
  coords: Coords;
  route: Route;
  title: string;
  disabled?: boolean;
}

interface RoutesWidgetProps {
  routes: RouteData[];
}

const RoutesWidget = (props: RoutesWidgetProps) => {
  return (
    <View className="flex flex-col justify-center items-center gap-[24px]">
      {props.routes.map((route, index) => (
        <RouteCard
          key={index}
          title={route.title}
          route={route.route}
          coords={route.coords}
          disabled={route.disabled}
        />
      ))}
    </View>
  );
};

export default RoutesWidget;
