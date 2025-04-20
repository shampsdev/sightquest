import 'package:sightquest/domain/models/location.dart';
import 'package:sightquest/domain/models/socket_event.dart';

abstract class SocketState {}

class SocketInitial extends SocketState {}

/// Пока идёт попытка подключения
class SocketLoading extends SocketState {}

class SocketConnected extends SocketState {}

class SocketBroadcasted extends SocketState {
  final BroadcastMessage message;

  SocketBroadcasted(this.message);
}

class SocketLocationUpdated extends SocketState {
  final Location location;

  SocketLocationUpdated(this.location);
}

class SocketError extends SocketState {
  final String errorMessage;

  SocketError(this.errorMessage);
}
