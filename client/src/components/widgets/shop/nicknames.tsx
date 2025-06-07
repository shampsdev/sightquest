import { View } from "react-native";
import { twMerge } from "tailwind-merge";
import AvatarCard from "../avatar-card";
import NicknameCard, { NicknameCardProps } from "../nickname-card";

interface NicknamesWidgetProps {
  cards: NicknameCardProps[];
  className?: string;
}
const NicknamesWidget = ({ cards, className }: NicknamesWidgetProps) => {
  return (
    <View
      className={twMerge(
        "mt-[32px] flex flex-row gap-y-[50px] gap-x-[10px] flex-wrap items-start justify-start",
        className
      )}
    >
      {cards.map((card, index) => {
        return <NicknameCard {...card} key={index} />;
      })}
    </View>
  );
};

export default NicknamesWidget;
