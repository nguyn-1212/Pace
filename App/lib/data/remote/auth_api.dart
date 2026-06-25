import 'package:dio/dio.dart';
import '../../core/network/api_result.dart';
import '../../core/network/dio_client.dart';
import '../models/user_model.dart';

class AuthApi {
  final Dio _dio = DioClient.instance;

  Future<ApiResult<AuthResponse>> login(String email, String password) async {
    try {
      final res = await _dio.post('/auth/login', data: {
        'Email': email,
        'Password': password,
      });
      return ApiSuccess(AuthResponse.fromJson(res.data));
    } on DioException catch (e) {
      return ApiError(_parseError(e), statusCode: e.response?.statusCode);
    }
  }

  Future<ApiResult<AuthResponse>> register(String email, String password, String fullName) async {
    try {
      final res = await _dio.post('/auth/register', data: {
        'Email': email,
        'Password': password,
        'FullName': fullName,
      });
      return ApiSuccess(AuthResponse.fromJson(res.data));
    } on DioException catch (e) {
      return ApiError(_parseError(e), statusCode: e.response?.statusCode);
    }
  }

  Future<ApiResult<UserModel>> getMe() async {
    try {
      final res = await _dio.get('/auth/me');
      return ApiSuccess(UserModel.fromJson(res.data));
    } on DioException catch (e) {
      return ApiError(_parseError(e), statusCode: e.response?.statusCode);
    }
  }

  Future<ApiResult<void>> updateProfile({
    String? fullName,
    String? phoneNumber,
    String? avatar,
  }) async {
    try {
      await _dio.put('/auth/me', data: {
        if (fullName != null) 'FullName': fullName,
        if (phoneNumber != null) 'PhoneNumber': phoneNumber,
        if (avatar != null) 'Avatar': avatar,
      });
      return const ApiSuccess(null);
    } on DioException catch (e) {
      return ApiError(_parseError(e), statusCode: e.response?.statusCode);
    }
  }

  Future<ApiResult<void>> changePassword(String currentPassword, String newPassword) async {
    try {
      await _dio.post('/auth/change-password', data: {
        'CurrentPassword': currentPassword,
        'NewPassword': newPassword,
      });
      return const ApiSuccess(null);
    } on DioException catch (e) {
      return ApiError(_parseError(e), statusCode: e.response?.statusCode);
    }
  }

  String _parseError(DioException e) {
    if (e.response?.data is String) return e.response!.data;
    if (e.response?.data is Map) {
      final msg = e.response!.data['message'] ?? e.response!.data['Message'];
      if (msg != null) return msg.toString();
    }
    return switch (e.response?.statusCode) {
      401 => 'Email hoặc mật khẩu không đúng',
      400 => 'Thông tin không hợp lệ',
      500 => 'Lỗi server, thử lại sau',
      _   => 'Không thể kết nối server',
    };
  }
}
