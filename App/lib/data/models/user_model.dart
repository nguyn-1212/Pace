class UserModel {
  final int id;
  final String fullName;
  final String email;
  final String? avatar;
  final String? phoneNumber;

  const UserModel({
    required this.id,
    required this.fullName,
    required this.email,
    this.avatar,
    this.phoneNumber,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) => UserModel(
        id: json['Id'] as int,
        fullName: json['FullName'] as String? ?? '',
        email: json['Email'] as String? ?? '',
        avatar: json['Avatar'] as String?,
        phoneNumber: json['PhoneNumber'] as String?,
      );
}

class AuthResponse {
  final String token;
  final UserModel user;

  const AuthResponse({required this.token, required this.user});

  factory AuthResponse.fromJson(Map<String, dynamic> json) => AuthResponse(
        token: json['Token'] as String,
        user: UserModel.fromJson(json['User'] as Map<String, dynamic>),
      );
}
