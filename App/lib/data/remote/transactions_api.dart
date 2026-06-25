import 'package:dio/dio.dart';
import '../../core/network/dio_client.dart';
import '../models/transaction_model.dart';

class TransactionsApi {
  final Dio _dio = DioClient.instance;

  Future<List<Transaction>> getAll({int? year, int? month}) async {
    final res = await _dio.get('/transactions', queryParameters: {
      if (year != null) 'year': year,
      if (month != null) 'month': month,
    });
    return (res.data as List).map((e) => Transaction.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<TransactionSummary> getSummary({required int year, required int month}) async {
    final res = await _dio.get('/transactions/summary', queryParameters: {'year': year, 'month': month});
    return TransactionSummary.fromJson(res.data as Map<String, dynamic>);
  }

  Future<List<TransactionCategory>> getCategories() async {
    final res = await _dio.get('/transactioncategories');
    return (res.data as List).map((e) => TransactionCategory.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<Transaction> create(Map<String, dynamic> data) async {
    final res = await _dio.post('/transactions', data: data);
    return Transaction.fromJson(res.data as Map<String, dynamic>);
  }

  Future<void> delete(int id) async {
    await _dio.delete('/transactions/$id');
  }
}
