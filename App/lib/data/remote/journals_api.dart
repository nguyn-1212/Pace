import 'package:dio/dio.dart';
import '../../core/network/dio_client.dart';
import '../models/journal_model.dart';

class JournalsApi {
  final Dio _dio = DioClient.instance;

  Future<List<Journal>> getAll() async {
    final res = await _dio.get('/journals');
    return (res.data as List).map((e) => Journal.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<Journal> create(Map<String, dynamic> data) async {
    final res = await _dio.post('/journals', data: data);
    return Journal.fromJson(res.data as Map<String, dynamic>);
  }

  Future<void> delete(int id) async {
    await _dio.delete('/journals/$id');
  }
}
