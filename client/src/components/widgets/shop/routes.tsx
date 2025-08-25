import { View } from "react-native";
import { RouteCard } from "../route-card";
import { Route } from "@/shared/interfaces/route";
import { useModal } from "@/shared/hooks/useModal";

export interface RouteData {
  route: Route;
  buttonAction?: () => void;
  disabled?: boolean;
}

interface RoutesWidgetProps {
  routes: RouteData[];
}

export const RoutesWidget = (props: RoutesWidgetProps) => {
  return (
    <View className="flex flex-col justify-center items-center gap-[24px]">
      {props.routes.map((route, index) => (
        <RouteCard
          key={index}
          title={route.route.title}
          route={route.route}
          disabled={route.disabled}
          buttonAction={route.buttonAction}
        />
      ))}
    </View>
  );
};
