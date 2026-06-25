import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../data/models/habit_model.dart';
import '../../data/models/goal_model.dart';
import '../../data/models/journal_model.dart';
import '../../data/models/transaction_model.dart';
import '../../data/models/user_model.dart';
import '../../data/remote/auth_api.dart';
import '../../data/remote/habits_api.dart';
import '../../data/remote/goals_api.dart';
import '../../data/remote/journals_api.dart';
import '../../data/remote/transactions_api.dart';
import '../network/dio_client.dart';

// Shared Preferences — initialized in main before runApp
final sharedPrefsProvider = Provider<SharedPreferences>((ref) {
  throw UnimplementedError('SharedPreferences must be overridden in ProviderScope');
});

// APIs
final authApiProvider = Provider<AuthApi>((ref) => AuthApi());
final transactionsApiProvider = Provider<TransactionsApi>((ref) => TransactionsApi());
final habitsApiProvider = Provider<HabitsApi>((ref) => HabitsApi());
final goalsApiProvider = Provider<GoalsApi>((ref) => GoalsApi());
final journalsApiProvider = Provider<JournalsApi>((ref) => JournalsApi());

// Data providers
final transactionSummaryProvider = FutureProvider.family<TransactionSummary, (int, int)>((ref, args) {
  return ref.read(transactionsApiProvider).getSummary(year: args.$1, month: args.$2);
});

final transactionsProvider = FutureProvider.family<List<Transaction>, (int, int)>((ref, args) {
  return ref.read(transactionsApiProvider).getAll(year: args.$1, month: args.$2);
});

final categoriesProvider = FutureProvider<List<TransactionCategory>>((ref) {
  return ref.read(transactionsApiProvider).getCategories();
});

final habitsProvider = FutureProvider<List<HabitToday>>((ref) {
  return ref.read(habitsApiProvider).getToday();
});

final goalsProvider = FutureProvider<List<Goal>>((ref) {
  return ref.read(goalsApiProvider).getAll();
});

final journalsProvider = FutureProvider<List<Journal>>((ref) {
  return ref.read(journalsApiProvider).getAll();
});

// Current user (in-memory after login)
final currentUserProvider = StateProvider<UserModel?>((ref) => null);

// Auth notifier
final authNotifierProvider = AsyncNotifierProvider<AuthNotifier, bool>(AuthNotifier.new);

class AuthNotifier extends AsyncNotifier<bool> {
  @override
  Future<bool> build() async {
    final prefs = ref.read(sharedPrefsProvider);
    final token = prefs.getString('pace_token');
    if (token == null || token.isEmpty) return false;
    // Token exists — try to fetch user
    final result = await ref.read(authApiProvider).getMe();
    return result.isSuccess;
  }

  Future<String?> login(String email, String password) async {
    state = const AsyncValue.loading();
    final result = await ref.read(authApiProvider).login(email, password);
    return result.when(
      success: (auth) async {
        await _save(auth);
        ref.read(currentUserProvider.notifier).state = auth.user;
        state = const AsyncValue.data(true);
        return null; // no error
      },
      error: (msg, _) {
        state = const AsyncValue.data(false);
        return msg;
      },
    );
  }

  Future<String?> register(String email, String password, String fullName) async {
    state = const AsyncValue.loading();
    final result = await ref.read(authApiProvider).register(email, password, fullName);
    return result.when(
      success: (auth) async {
        await _save(auth);
        ref.read(currentUserProvider.notifier).state = auth.user;
        state = const AsyncValue.data(true);
        return null;
      },
      error: (msg, _) {
        state = const AsyncValue.data(false);
        return msg;
      },
    );
  }

  Future<void> logout() async {
    final prefs = ref.read(sharedPrefsProvider);
    await prefs.clear();
    ref.read(currentUserProvider.notifier).state = null;
    DioClient.instance.options.headers.remove('Authorization');
    state = const AsyncValue.data(false);
  }

  Future<void> _save(AuthResponse auth) async {
    final prefs = ref.read(sharedPrefsProvider);
    await prefs.setString('pace_token', auth.token);
    await prefs.setInt('pace_user_id', auth.user.id);
    await prefs.setString('pace_user_name', auth.user.fullName);
    await prefs.setString('pace_user_email', auth.user.email);
    if (auth.user.avatar != null) {
      await prefs.setString('pace_user_avatar', auth.user.avatar!);
    }
  }
}
