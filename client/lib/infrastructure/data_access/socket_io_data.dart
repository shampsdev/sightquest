import "package:socket_io_client/socket_io_client.dart" as IO;

class SocketIoDataSource {
  late IO.Socket _socket;

  void connect(String url) {
    _socket = IO.io(url, {
      'transports': ['websocket'],
      'autoConnect': true,
    });
  }

  void onConnect(void Function() handler) =>
      _socket.onConnect((_) => handler());

  void onEvent(String event, void Function(dynamic) handler) =>
      _socket.on(event, handler);

  void emit(String event, dynamic data) => _socket.emit(event, data);

  void onDisconnect(void Function() handler) =>
      _socket.onDisconnect((_) => handler());

  void dispose() => _socket.disconnect();
}
