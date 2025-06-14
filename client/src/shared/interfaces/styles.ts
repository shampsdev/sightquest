export interface Style {
  id: string;
  priceRoubles: number;
  title: string;
  type: "avatar" | undefined;
  style: any;
}

export interface AvatarStyle {
  style: {
    url: string;
  };
}

export interface UserStyles {
  avatarId: string;
}
