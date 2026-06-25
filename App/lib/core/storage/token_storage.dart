import 'package:shared_preferences/shared_preferences.dart';

class TokenStorage {
  static const _keyToken = 'pace_token';
  static const _keyUserId = 'pace_user_id';
  static const _keyUserName = 'pace_user_name';
  static const _keyUserEmail = 'pace_user_email';
  static const _keyUserAvatar = 'pace_user_avatar';

  static Future<void> saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keyToken, token);
  }

  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_keyToken);
  }

  static Future<void> saveUser({
    required int id,
    required String name,
    required String email,
    String? avatar,
  }) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt(_keyUserId, id);
    await prefs.setString(_keyUserName, name);
    await prefs.setString(_keyUserEmail, email);
    if (avatar != null) await prefs.setString(_keyUserAvatar, avatar);
  }

  static Future<Map<String, dynamic>> getUser() async {
    final prefs = await SharedPreferences.getInstance();
    return {
      'id': prefs.getInt(_keyUserId),
      'name': prefs.getString(_keyUserName),
      'email': prefs.getString(_keyUserEmail),
      'avatar': prefs.getString(_keyUserAvatar),
    };
  }

  static Future<void> clear() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_keyToken);
    await prefs.remove(_keyUserId);
    await prefs.remove(_keyUserName);
    await prefs.remove(_keyUserEmail);
    await prefs.remove(_keyUserAvatar);
  }

  static Future<bool> hasToken() async {
    final token = await getToken();
    return token != null && token.isNotEmpty;
  }
}
