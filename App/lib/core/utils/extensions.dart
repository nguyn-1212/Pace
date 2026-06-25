import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

extension StringX on String {
  String get capitalize => isEmpty ? this : '${this[0].toUpperCase()}${substring(1)}';
}

extension DateTimeX on DateTime {
  String get ddMMyyyy => DateFormat('dd/MM/yyyy').format(this);
  String get ddMMMyyyy => DateFormat('dd MMM yyyy', 'vi').format(this);
  String get HHmm => DateFormat('HH:mm').format(this);
  bool get isToday {
    final now = DateTime.now();
    return year == now.year && month == now.month && day == now.day;
  }
}

extension NumX on num {
  String get vnd => NumberFormat('#,###', 'vi_VN').format(this);
  String get compact => NumberFormat.compact(locale: 'vi_VN').format(this);
}

extension ContextX on BuildContext {
  TextTheme get textTheme => Theme.of(this).textTheme;
  ColorScheme get colors => Theme.of(this).colorScheme;
  NavigatorState get nav => Navigator.of(this);
  double get width => MediaQuery.sizeOf(this).width;
  double get height => MediaQuery.sizeOf(this).height;

  void showSnack(String msg, {bool error = false}) {
    ScaffoldMessenger.of(this).showSnackBar(
      SnackBar(
        content: Text(msg),
        backgroundColor: error ? Colors.red[700] : Colors.green[700],
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      ),
    );
  }
}
