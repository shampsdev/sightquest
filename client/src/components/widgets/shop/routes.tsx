import { View } from "react-native";
import { RouteCard } from "../route-card";
import { Route } from "@/shared/interfaces/route";
import { buyRoute } from "@/shared/api/routes.api";
import { useModal } from "@/shared/hooks/useModal";
import { logger } from "@/shared/instances/logger.instance";

export interface RouteData {
  route: Route;
  disabled?: boolean;
}

interface RoutesWidgetProps {
  routes: RouteData[];
}

export const RoutesWidget = (props: RoutesWidgetProps) => {
  const { setModalOpen } = useModal();

  const handleBuy = async (r: Route) => {
    try {
      await buyRoute(r.id);
      setModalOpen({
        title: "Маршрут куплен",
        subtitle: `Теперь доступен: ${r.title}`,
        buttons: [
          { text: "Ок", type: "primary", onClick: () => setModalOpen(false) },
        ],
      });
    } catch (e: any) {
      logger.error("ui", "Error buying route:", e);
      setModalOpen({
        title: "Ошибка",
        subtitle: "Не удалось купить маршрут",
        buttons: [
          {
            text: "Закрыть",
            type: "primary",
            onClick: () => setModalOpen(false),
          },
        ],
      });
    }
  };

  return (
    <View className="flex flex-col justify-center items-center gap-[24px]">
      {props.routes.map((route, index) => (
        <RouteCard
          key={index}
          title={route.route.title}
          route={route.route}
          disabled={route.disabled}
          buttonAction={() => handleBuy(route.route)}
        />
      ))}
    </View>
  );
};
