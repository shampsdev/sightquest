import 'dart:async';

import 'package:bloc/bloc.dart';
import 'package:sightquest/presentation/blocs/socket_state.dart';
import '../../domain/models/location.dart';
import '../../domain/repositories/socket_repository.dart';
import '../../internal/di.dart';

class SocketCubit extends Cubit<SocketState> {
  final SocketRepository _repo = getIt<SocketRepository>();
  late final StreamSubscription _subBroadcast;
  late final StreamSubscription _subLocation;

  SocketCubit() : super(SocketInitial());

  void connect(String token, String gameId) async {
    emit(SocketLoading());
    await _repo.connect(token: token, gameId: gameId);
    _subBroadcast = _repo.onBroadcast.listen((msg) {
      emit(SocketBroadcasted(msg));
    });
    _subLocation = _repo.onLocationUpdate.listen((loc) {
      emit(SocketLocationUpdated(loc));
    });
    emit(SocketConnected());
  }

  void sendLocation(Location loc) => _repo.sendLocation(loc);
  void sendBroadcast(String msg) => _repo.sendBroadcast(msg);

  @override
  Future<void> close() {
    _subBroadcast.cancel();
    _subLocation.cancel();
    _repo.dispose();
    return super.close();
  }
}
