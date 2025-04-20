import 'package:get_it/get_it.dart';
import 'package:sightquest/domain/repositories/socket_repository.dart';
import 'package:sightquest/infrastructure/data_access/socket_io_data.dart';
import 'package:sightquest/infrastructure/repositories/socket_repository_impl.dart';

final getIt = GetIt.instance;

void initDependencies() {
  getIt.registerLazySingleton<SocketIoDataSource>(() => SocketIoDataSource());
  getIt.registerLazySingleton<SocketRepository>(
    () => SocketRepositoryImpl(getIt<SocketIoDataSource>()),
  );
}
