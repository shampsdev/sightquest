import { AvatarCard, AvatarCardProps } from "@/components/widgets/avatar-card";
import { View } from "react-native";
import { twMerge } from "tailwind-merge";

interface AvatarWidgetProps {
  cards: AvatarCardProps[];
  className?: string;
}

export const AvatarsWidget = ({ cards, className }: AvatarWidgetProps) => {
  return (
    <View
      className={twMerge(
        "mt-[32px] flex flex-row gap-y-[90px] gap-x-[10px] flex-wrap items-start justify-start",
        className
      )}
    >
      {cards.map((card, index) => {
        return <AvatarCard {...card} key={index} />;
      })}
    </View>
  );
};
