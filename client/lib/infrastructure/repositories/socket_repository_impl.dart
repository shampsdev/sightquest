import 'dart:async';

import 'package:sightquest/config/app_config.dart';
import 'package:sightquest/domain/models/location.dart';
import 'package:sightquest/domain/models/socket_event.dart';
import 'package:sightquest/domain/repositories/socket_repository.dart';
import 'package:sightquest/infrastructure/data_access/socket_io_data.dart';

class SocketRepositoryImpl implements SocketRepository {
  final SocketIoDataSource _dataSource;
  final _broadcastController = StreamController<BroadcastMessage>.broadcast();
  final _locationController = StreamController<Location>.broadcast();

  SocketRepositoryImpl(this._dataSource);
  @override
  Future<void> connect({required String token, required String gameId}) async {
    _dataSource.connect(AppConfig.socketUrl);
    _dataSource.onConnect(() {
      _dataSource.emit('auth', {'token': token});
      _dataSource.emit('joinGame', {'gameId': gameId});
    });
    _dataSource.onEvent('broadcasted', (data) {
      final from = data['from'].toString();
      final d = data['data'].toString();
      _broadcastController.add(BroadcastMessage(from: from, data: d));
    });
    _dataSource.onEvent('locationUpdate', (data) {
      final loc = data['location'];
      _locationController.add(
        Location(lat: loc['lat'] as double, lon: loc['lon'] as double),
      );
    });
  }

  @override
  void dispose() {
    _dataSource.dispose();
    _broadcastController.close();
    _locationController.close();
  }

  @override
  Stream<BroadcastMessage> get onBroadcast => _broadcastController.stream;

  @override
  Stream<Location> get onLocationUpdate => _locationController.stream;

  @override
  void sendBroadcast(String message) {
    _dataSource.emit('broadcast', {'data': message});
  }

  @override
  void sendLocation(Location loc) {
    _dataSource.emit('locationUpdate', {
      'location': {'lat': loc.lat, 'lon': loc.lon},
    });
  }
}
