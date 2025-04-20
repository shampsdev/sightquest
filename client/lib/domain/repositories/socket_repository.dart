import 'package:sightquest/domain/models/location.dart';
import 'package:sightquest/domain/models/socket_event.dart';

abstract class SocketRepository {
  Future<void> connect({required String token, required String gameId});
  Stream<BroadcastMessage> get onBroadcast;
  Stream<Location> get onLocationUpdate;

  void sendLocation(Location loc);
  void sendBroadcast(String message);
  void dispose();
}
