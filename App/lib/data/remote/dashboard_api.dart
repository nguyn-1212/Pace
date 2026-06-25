import 'package:dio/dio.dart';
import '../../core/network/dio_client.dart';

class DashboardApi {
  final Dio _dio = DioClient.instance;

  Future<Map<String, dynamic>> get() async {
    final res = await _dio.get('/dashboard');
    return res.data as Map<String, dynamic>;
  }
}
