import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:sightquest/presentation/blocs/socket_cubit.dart';

import '../widgets/input_field.dart';
import '../widgets/action_button.dart';
import '../widgets/log_view.dart';
import '../../domain/models/location.dart';
import '../blocs/socket_state.dart';

class TestPage extends StatefulWidget {
  const TestPage({Key? key}) : super(key: key);

  @override
  _SimpleSocketPageState createState() => _SimpleSocketPageState();
}

class _SimpleSocketPageState extends State<TestPage> {
  final _tokenC = TextEditingController();
  final _gameIdC = TextEditingController();
  final _broadcastC = TextEditingController();

  final List<String> _logs = [];

  void _addLog(String text) {
    setState(() {
      _logs.add(text);
    });
  }

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => SocketCubit(),
      child: Scaffold(
        appBar: AppBar(title: const Text('Socket.IO Demo')),
        body: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              InputField(label: 'Token', controller: _tokenC),
              InputField(label: 'Game ID', controller: _gameIdC),
              const SizedBox(height: 12),

              BlocBuilder<SocketCubit, SocketState>(
                buildWhen:
                    (oldS, newS) =>
                        newS is SocketInitial || newS is SocketConnected,
                builder: (context, state) {
                  final isConnected = state is SocketConnected;
                  return ActionButton(
                    icon: isConnected ? Icons.link_off : Icons.link,
                    label: isConnected ? 'Отключиться' : 'Подключиться',
                    expanded: true,
                    onPressed: () {
                      final cubit = context.read<SocketCubit>();
                      if (isConnected) {
                        cubit.close();
                        _addLog('❌ Disconnected by user');
                      } else {
                        cubit.connect(
                          _tokenC.text.trim(),
                          _gameIdC.text.trim(),
                        );
                      }
                    },
                  );
                },
              ),

              const SizedBox(height: 16),

              BlocConsumer<SocketCubit, SocketState>(
                listener: (context, state) {
                  if (state is SocketConnected) {
                    _addLog('✅ Connected');
                  } else if (state is SocketBroadcasted) {
                    _addLog(
                      '📢 From ${state.message.from}: ${state.message.data}',
                    );
                  } else if (state is SocketLocationUpdated) {
                    final loc = state.location;
                    _addLog('📍 Location update: ${loc.lon}, ${loc.lat}');
                  } else if (state is SocketError) {
                    _addLog('❗ Error: ${state.errorMessage}');
                  }
                },
                builder: (context, state) {
                  if (state is SocketConnected) {
                    return Column(
                      children: [
                        InputField(
                          label: 'Broadcast Message',
                          controller: _broadcastC,
                        ),

                        Row(
                          children: [
                            Expanded(
                              child: ActionButton(
                                icon: Icons.broadcast_on_personal,
                                label: 'Send Broadcast',
                                onPressed: () {
                                  context.read<SocketCubit>().sendBroadcast(
                                    _broadcastC.text.trim(),
                                  );
                                  _addLog(
                                    '📝 Sent broadcast: ${_broadcastC.text}',
                                  );
                                },
                              ),
                            ),
                            const SizedBox(width: 10),
                            ActionButton(
                              icon: Icons.my_location,
                              label: 'Send Location',
                              onPressed: () {
                                context.read<SocketCubit>().sendLocation(
                                  Location(lon: 0, lat: 0),
                                );
                                _addLog('📤 Sent manual location');
                              },
                            ),
                          ],
                        ),
                      ],
                    );
                  }
                  return const SizedBox.shrink();
                },
              ),

              const SizedBox(height: 16),

              const Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  'Логи:',
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
              ),
              const SizedBox(height: 8),
              Expanded(child: LogView(entries: _logs)),
            ],
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _tokenC.dispose();
    _gameIdC.dispose();
    _broadcastC.dispose();
    super.dispose();
  }
}
