import 'package:flutter/material.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(home: SimpleSocketPage());
  }
}

class SimpleSocketPage extends StatefulWidget {
  const SimpleSocketPage({super.key});

  @override
  State<SimpleSocketPage> createState() => _SimpleSocketPageState();
}

class _SimpleSocketPageState extends State<SimpleSocketPage> {
  late IO.Socket socket;
  String log = '⏳ Waiting to connect...';

  final TextEditingController tokenController = TextEditingController();
  final TextEditingController gameIdController = TextEditingController();
  final TextEditingController lonController = TextEditingController();
  final TextEditingController latController = TextEditingController();
  final TextEditingController broadcastController = TextEditingController();

  bool isConnected = false;

  void _connectSocket() {
    if (isConnected) return;

    socket = IO.io('https://dev.sightquest.ru', {
      'transports': ['websocket'],
      'autoConnect': true,
    });

    socket.onConnect((_) {
      setState(() {
        isConnected = true;
      });

      _appendLog('✅ Connected');

      final token = tokenController.text.trim();
      final gameId = gameIdController.text.trim();
      final lon = double.tryParse(lonController.text.trim()) ?? 0.0;
      final lat = double.tryParse(latController.text.trim()) ?? 0.0;
      final broadcastData = broadcastController.text.trim();

      socket.emit('auth', {'token': token});
      socket.emit('joinGame', {'gameId': gameId});
      socket.emit('locationUpdate', {
        'location': {'lon': lon, 'lat': lat},
      });
      socket.emit('broadcast', {'data': broadcastData});
    });

    socket.on('auth', (data) => _appendLog('🛡️ Auth: $data'));
    socket.on('joinGame', (data) => _appendLog('🎮 JoinGame: $data'));
    socket.on('game', (data) => _appendLog('📦 Game: $data'));
    socket.on('locationUpdate', (data) => _appendLog('📍 Location: $data'));
    socket.on('broadcasted', (data) {
      try {
        if (data is Map<String, dynamic>) {
          final from = data['from'];
          final payload = data['data'];

          _appendLog('📢 Broadcasted message from: ${from.toString()}');
          _appendLog('📝 Data: ${payload.toString()}');
        } else {
          _appendLog('⚠️ Unexpected broadcasted format: ${data.runtimeType}');
        }
      } catch (e) {
        _appendLog('❌ Error parsing broadcasted event: $e');
      }
    });

    socket.onDisconnect((_) {
      _appendLog('❌ Disconnected');
      setState(() {
        isConnected = false;
      });
    });

    socket.onConnectError((err) => _appendLog('❗ Connect error: $err'));
    socket.onError((err) => _appendLog('💥 Socket error: $err'));
  }

  void _appendLog(String text) {
    setState(() {
      log = '$log\n$text';
    });
  }

  void _sendBroadcast() {
    final message = broadcastController.text.trim();
    socket.emit('broadcast', {'data': message});

    _appendLog('Sent in broadcast: $message');
  }

  void _sendLocationUpdate() {
    final lon = double.tryParse(lonController.text.trim()) ?? 0.0;
    final lat = double.tryParse(latController.text.trim()) ?? 0.0;

    socket.emit('locationUpdate', {
      'location': {'lon': lon, 'lan': lat},
    });

    _appendLog('📤 Sent location ($lon, $lat)');
  }

  @override
  void dispose() {
    if (isConnected) {
      socket.disconnect();
    }
    super.dispose();
  }

  Widget _buildTextField(
    String label,
    TextEditingController controller, {
    TextInputType keyboardType = TextInputType.text,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: TextField(
        controller: controller,
        keyboardType: keyboardType,
        decoration: InputDecoration(
          labelText: label,
          border: const OutlineInputBorder(),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Socket.IO Flutter Demo')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            _buildTextField('Token', tokenController),
            _buildTextField('Game ID', gameIdController),

            _buildTextField('Broadcast Message', broadcastController),
            if (isConnected)
              ElevatedButton.icon(
                icon: const Icon(Icons.broadcast_on_personal),
                label: const Text('Отправить сообщение'),
                onPressed: _sendBroadcast,
              ),
            Row(
              children: [
                Expanded(
                  child: _buildTextField(
                    'Longitude',
                    lonController,
                    keyboardType: TextInputType.number,
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: _buildTextField(
                    'Latitude',
                    latController,
                    keyboardType: TextInputType.number,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    icon: const Icon(Icons.link),
                    label: const Text('Подключиться'),
                    onPressed: _connectSocket,
                  ),
                ),
                const SizedBox(width: 10),
                if (isConnected)
                  ElevatedButton.icon(
                    icon: const Icon(Icons.send),
                    label: const Text('Отправить координаты'),
                    onPressed: _sendLocationUpdate,
                  ),
              ],
            ),
            const SizedBox(height: 16),
            const Text(
              'Лог событий:',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            Expanded(child: SingleChildScrollView(child: Text(log))),
          ],
        ),
      ),
    );
  }
}
