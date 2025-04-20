import 'package:flutter/material.dart';

class ActionButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onPressed;
  final bool expanded;

  const ActionButton({
    Key? key,
    required this.icon,
    required this.label,
    required this.onPressed,
    this.expanded = false,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final btn = ElevatedButton.icon(
      icon: Icon(icon, size: 20),
      label: Text(label),
      onPressed: onPressed,
      style: ElevatedButton.styleFrom(
        minimumSize: expanded ? const Size.fromHeight(48) : null,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      ),
    );

    return expanded ? SizedBox(width: double.infinity, child: btn) : btn;
  }
}
