import 'package:flutter_dotenv/flutter_dotenv.dart';

class AppConfig {
  static String get socketUrl => dotenv.env['SOCKET_URL']!;
}
