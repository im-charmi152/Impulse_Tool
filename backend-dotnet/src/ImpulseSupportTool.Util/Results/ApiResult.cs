namespace ImpulseSupportTool.Util.Results;

/// <summary>
/// Transport-neutral result returned by command and query handlers.
/// The API layer converts it into an HTTP response, so handlers never reference ASP.NET types.
/// </summary>
public sealed record ApiResult
{
    public int StatusCode { get; init; }

    public object? Body { get; init; }

    /// <summary>Set only for file downloads.</summary>
    public string? FilePath { get; init; }

    public string? ContentType { get; init; }

    public string? FileName { get; init; }

    public static ApiResult Ok(object? body) => new() { StatusCode = 200, Body = body };

    public static ApiResult Created(object? body) => new() { StatusCode = 201, Body = body };

    public static ApiResult Accepted(object? body) => new() { StatusCode = 202, Body = body };

    public static ApiResult Problem(int statusCode, object? body) => new() { StatusCode = statusCode, Body = body };

    public static ApiResult File(string path, string contentType, string fileName) =>
        new() { StatusCode = 200, FilePath = path, ContentType = contentType, FileName = fileName };
}
