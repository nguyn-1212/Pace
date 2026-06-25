sealed class ApiResult<T> {
  const ApiResult();
}

class ApiSuccess<T> extends ApiResult<T> {
  final T data;
  const ApiSuccess(this.data);
}

class ApiError<T> extends ApiResult<T> {
  final String message;
  final int? statusCode;
  const ApiError(this.message, {this.statusCode});
}

extension ApiResultX<T> on ApiResult<T> {
  T? get dataOrNull => this is ApiSuccess<T> ? (this as ApiSuccess<T>).data : null;
  String? get errorOrNull => this is ApiError<T> ? (this as ApiError<T>).message : null;
  bool get isSuccess => this is ApiSuccess<T>;
  bool get isError => this is ApiError<T>;

  R when<R>({
    required R Function(T data) success,
    required R Function(String message, int? statusCode) error,
  }) {
    return switch (this) {
      ApiSuccess<T> s => success(s.data),
      ApiError<T> e   => error(e.message, e.statusCode),
    };
  }
}
