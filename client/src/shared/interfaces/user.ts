import { UserStyles } from "./styles/styles";

export interface User {
  id?: string;
  name: string;
  username: string;
  createdAt?: string;
  styles?: UserStyles;
}
