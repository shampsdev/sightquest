import { UserStyles } from "./styles";

export interface User {
  id?: string;
  name: string;
  username: string;
  createdAt?: string;
  styles?: UserStyles;
}
