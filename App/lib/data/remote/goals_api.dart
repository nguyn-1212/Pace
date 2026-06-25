import 'package:dio/dio.dart';
import '../../core/network/dio_client.dart';
import '../models/goal_model.dart';

class GoalsApi {
  final Dio _dio = DioClient.instance;

  Future<List<Goal>> getAll() async {
    final res = await _dio.get('/goals');
    return (res.data as List).map((e) => Goal.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<Goal> create(Map<String, dynamic> data) async {
    final res = await _dio.post('/goals', data: data);
    return Goal.fromJson(res.data as Map<String, dynamic>);
  }

  Future<void> delete(int id) async {
    await _dio.delete('/goals/$id');
  }
}
