import 'package:dio/dio.dart';
import '../storage/token_storage.dart';

class DioClient {
  static const _baseUrlDev  = 'http://10.0.2.2:5000/api';   // Android emulator → localhost
  static const _baseUrlProd = 'https://api-pace.lazy.vn/api';

  static bool _isProduction = false;

  static Dio? _instance;

  static Dio get instance {
    _instance ??= _create();
    return _instance!;
  }

  static void useProduction() {
    _isProduction = true;
    _instance = _create();
  }

  static Dio _create() {
    final dio = Dio(
      BaseOptions(
        baseUrl: _isProduction ? _baseUrlProd : _baseUrlDev,
        connectTimeout: const Duration(seconds: 15),
        receiveTimeout: const Duration(seconds: 30),
        headers: {'Content-Type': 'application/json'},
      ),
    );

    dio.interceptors.add(_AuthInterceptor());
    dio.interceptors.add(LogInterceptor(
      requestBody: true,
      responseBody: true,
      error: true,
    ));

    return dio;
  }
}

class _AuthInterceptor extends Interceptor {
  @override
  Future<void> onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    final token = await TokenStorage.getToken();
    if (token != null && token.isNotEmpty) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    if (err.response?.statusCode == 401) {
      TokenStorage.clear();
    }
    handler.next(err);
  }
}
