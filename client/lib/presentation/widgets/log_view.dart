import 'package:flutter/material.dart';

class LogView extends StatelessWidget {
  final List<String> entries;
  const LogView({Key? key, required this.entries}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey.shade300),
        borderRadius: BorderRadius.circular(4),
      ),
      child: ListView.builder(
        padding: const EdgeInsets.all(8),
        itemCount: entries.length,
        itemBuilder: (context, i) => Text(entries[i]),
      ),
    );
  }
}
