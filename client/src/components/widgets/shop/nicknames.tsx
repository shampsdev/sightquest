import { View } from "react-native";
import { twMerge } from "tailwind-merge";
import { NicknameCardProps, NicknameCard } from "../nickname-card";

interface NicknamesWidgetProps {
  cards: NicknameCardProps[];
  className?: string;
}

export const NicknamesWidget = ({ cards, className }: NicknamesWidgetProps) => {
  return (
    <View
      className={twMerge(
        "mt-[10px] flex flex-row gap-y-[50px] gap-x-[10px] flex-wrap items-start justify-start",
        className
      )}
    >
      {cards.map((card, index) => {
        return <NicknameCard {...card} key={index} />;
      })}
    </View>
  );
};
