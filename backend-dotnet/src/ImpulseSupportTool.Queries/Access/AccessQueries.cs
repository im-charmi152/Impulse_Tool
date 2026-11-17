using ImpulseSupportTool.Data.Abstractions;
using ImpulseSupportTool.Models.Requests;
using ImpulseSupportTool.Util.Messaging;
using ImpulseSupportTool.Util.Results;
using static ImpulseSupportTool.Models.Access.AccessRules;

namespace ImpulseSupportTool.Queries.Access;

// ---------------------------------------------------------------------------
// Find a production user by email
// ---------------------------------------------------------------------------
public sealed record FindUserQuery(string Email) : IQuery<ApiResult>;

public sealed class FindUserQueryHandler(IUserAccessStore userAccess)
    : IQueryHandler<FindUserQuery, ApiResult>
{
    public async Task<ApiResult> Handle(FindUserQuery query, CancellationToken cancellationToken)
    {
        var email = query.Email;
        if (!IsEmail(email))
        {
            return ApiResult.Problem(400, new { message = "A valid email is required." });
        }

        var record = await userAccess.LatestAsync(email.Trim(), cancellationToken);
        if (record is null)
        {
            return ApiResult.Problem(404, new { message = "User was not found in the access log." });
        }

        return ApiResult.Ok(ToProfile(record));
    }
}

// ---------------------------------------------------------------------------
// Production user login
// ---------------------------------------------------------------------------
public sealed record LoginQuery(AccessLoginRequest Request) : IQuery<ApiResult>;

public sealed class LoginQueryHandler(IUserAccessStore userAccess, IApprovalStore requests)
    : IQueryHandler<LoginQuery, ApiResult>
{
    public async Task<ApiResult> Handle(LoginQuery query, CancellationToken cancellationToken)
    {
        var request = query.Request;

        if (!IsCompanyEmail(request.Email))
        {
            return ApiResult.Problem(400, new { message = "Only an @ingrammicro.com email ID can be used." });
        }

        if (string.IsNullOrEmpty(request.Password))
        {
            return ApiResult.Problem(400, new { message = "Email and password are required." });
        }

        var record = await userAccess.LatestAsync(request.Email.Trim(), cancellationToken);
        if (record is null)
        {
            var approval = await requests.LatestByEmailAsync(request.Email.Trim(), "access", cancellationToken);
            if (approval?.Status == "pending")
            {
                return ApiResult.Problem(403, new
                {
                    message = "An approval request for this email is waiting for an admin.",
                });
            }

            if (approval?.Status == "declined")
            {
                var note = string.IsNullOrWhiteSpace(approval.Note) ? "" : $" {approval.Note}";
                return ApiResult.Problem(403, new
                {
                    message = $"This request was declined.{note}",
                });
            }

            return ApiResult.Problem(404, new { message = "User was not found in the access log." });
        }

        if (!string.Equals(record.Password, request.Password, StringComparison.Ordinal))
        {
            return ApiResult.Problem(401, new { message = "Production email or password was not recognized." });
        }

        return ApiResult.Ok(ToProfile(record));
    }
}

// ---------------------------------------------------------------------------
// Administrator login (checked against the encrypted admin vault)
// ---------------------------------------------------------------------------
public sealed record AdminLoginQuery(AccessLoginRequest Request) : IQuery<ApiResult>;

public sealed class AdminLoginQueryHandler(IAdminAuthenticator admins)
    : IQueryHandler<AdminLoginQuery, ApiResult>
{
    public Task<ApiResult> Handle(AdminLoginQuery query, CancellationToken cancellationToken)
        => Task.FromResult(Authenticate(query.Request));

    private ApiResult Authenticate(AccessLoginRequest request)
    {
        if (!IsCompanyEmail(request.Email))
        {
            return ApiResult.Problem(400, new { message = "Only an @ingrammicro.com email ID can be used." });
        }

        if (string.IsNullOrEmpty(request.Password))
        {
            return ApiResult.Problem(400, new { message = "Email and password are required." });
        }

        if (!admins.IsReady)
        {
            return ApiResult.Problem(503, new { message = "Admin sign-in is not configured on this server." });
        }

        var email = request.Email.Trim().ToLowerInvariant();
        if (!admins.Authenticate(email, request.Password))
        {
            return ApiResult.Problem(401, new { message = "Admin credentials were not recognized." });
        }

        return ApiResult.Ok(new
        {
            email,
            name = NameFromEmail(email),
            role = "Administrator",
        });
    }
}

// ---------------------------------------------------------------------------
// Find a guest sign-in by email
// ---------------------------------------------------------------------------
public sealed record FindGuestQuery(string Email) : IQuery<ApiResult>;

public sealed class FindGuestQueryHandler(IGuestStore guests)
    : IQueryHandler<FindGuestQuery, ApiResult>
{
    public async Task<ApiResult> Handle(FindGuestQuery query, CancellationToken cancellationToken)
    {
        var email = query.Email;
        if (!IsCompanyEmail(email))
        {
            return ApiResult.Problem(400, new { message = "Only an @ingrammicro.com email ID can be used." });
        }

        var guest = await guests.LatestByEmailAsync(email, cancellationToken);
        if (guest is null)
        {
            return ApiResult.Problem(404, new { message = "Guest was not found." });
        }

        return ApiResult.Ok(guest);
    }
}

// ---------------------------------------------------------------------------
// List the latest approval and password-reset requests
// ---------------------------------------------------------------------------
public sealed record ListRequestsQuery : IQuery<ApiResult>;

public sealed class ListRequestsQueryHandler(IApprovalStore requests)
    : IQueryHandler<ListRequestsQuery, ApiResult>
{
    public async Task<ApiResult> Handle(ListRequestsQuery query, CancellationToken cancellationToken)
    {
        var items = await requests.ListLatestAsync(cancellationToken);
        return ApiResult.Ok(items);
    }
}
