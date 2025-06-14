export interface Style {
  id: string;
  priceRoubles: number;
  title: string;
  type: "avatar" | undefined;
  style: any;
}

export interface AvatarStyle extends Style {
  style: {
    url: string;
  };
}

export interface UserStyles {
  avatarId: string;
}
