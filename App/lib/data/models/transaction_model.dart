class TransactionCategory {
  final int id;
  final String name;
  final String icon;
  final bool isIncome;

  const TransactionCategory({
    required this.id,
    required this.name,
    required this.icon,
    required this.isIncome,
  });

  factory TransactionCategory.fromJson(Map<String, dynamic> j) => TransactionCategory(
        id: j['id'] as int,
        name: j['name'] as String,
        icon: j['icon'] as String? ?? '',
        isIncome: j['isIncome'] as bool? ?? false,
      );
}

class Transaction {
  final int id;
  final double amount;
  final String? note;
  final DateTime date;
  final int categoryId;
  final String categoryName;
  final String categoryIcon;
  final bool isIncome;

  const Transaction({
    required this.id,
    required this.amount,
    this.note,
    required this.date,
    required this.categoryId,
    required this.categoryName,
    required this.categoryIcon,
    required this.isIncome,
  });

  factory Transaction.fromJson(Map<String, dynamic> j) => Transaction(
        id: j['id'] as int,
        amount: (j['amount'] as num).toDouble(),
        note: j['note'] as String?,
        date: DateTime.parse(j['date'] as String),
        categoryId: j['categoryId'] as int,
        categoryName: j['categoryName'] as String? ?? '',
        categoryIcon: j['categoryIcon'] as String? ?? '',
        isIncome: j['isIncome'] as bool? ?? false,
      );
}

class TransactionSummary {
  final double totalIncome;
  final double totalExpense;
  final double balance;
  final List<CategorySummary> byCategory;

  const TransactionSummary({
    required this.totalIncome,
    required this.totalExpense,
    required this.balance,
    required this.byCategory,
  });

  factory TransactionSummary.fromJson(Map<String, dynamic> j) => TransactionSummary(
        totalIncome: (j['totalIncome'] as num).toDouble(),
        totalExpense: (j['totalExpense'] as num).toDouble(),
        balance: (j['balance'] as num).toDouble(),
        byCategory: (j['byCategory'] as List<dynamic>? ?? [])
            .map((e) => CategorySummary.fromJson(e as Map<String, dynamic>))
            .toList(),
      );
}

class CategorySummary {
  final int categoryId;
  final String categoryName;
  final String categoryIcon;
  final double total;

  const CategorySummary({
    required this.categoryId,
    required this.categoryName,
    required this.categoryIcon,
    required this.total,
  });

  factory CategorySummary.fromJson(Map<String, dynamic> j) => CategorySummary(
        categoryId: j['categoryId'] as int,
        categoryName: j['categoryName'] as String? ?? '',
        categoryIcon: j['categoryIcon'] as String? ?? '',
        total: (j['total'] as num).toDouble(),
      );
}
