import { socket } from "../instances/socket.instance";

export interface SocketEvent {}

export interface AuthEvent extends SocketEvent {
  user: {
    username: string;
  };
}

const user = {
  username: "penis",
};

socket.emit<AuthEvent>("auth", { user });

// socket.on<AuthEvent>((user) => {});
