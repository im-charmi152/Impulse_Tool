using ImpulseSupportTool.Util.Results;
using Microsoft.AspNetCore.Mvc;

namespace ImpulseSupportTool.Api.Extensions;

/// <summary>
/// Converts the transport-neutral <see cref="ApiResult"/> into an ASP.NET Core response.
/// </summary>
public static class ApiResultExtensions
{
    public static IActionResult ToActionResult(this ApiResult result, ControllerBase controller)
    {
        if (result.FilePath is not null)
        {
            return controller.PhysicalFile(result.FilePath, result.ContentType!, result.FileName!);
        }

        return new ObjectResult(result.Body) { StatusCode = result.StatusCode };
    }
}
