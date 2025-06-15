export type StyleType = "avatar";

export interface Style {
  id: string;
  priceRoubles: number;
  title: string;
  type: StyleType;
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
