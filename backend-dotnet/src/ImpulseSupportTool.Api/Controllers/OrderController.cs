using ImpulseSupportTool.Models.Orders;
using ImpulseSupportTool.Queries.Orders.GetOrderDetails;
using ImpulseSupportTool.Util.Messaging;
using Microsoft.AspNetCore.Mvc;

namespace ImpulseSupportTool.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrderController(IDispatcher dispatcher) : ControllerBase
{
    [HttpPost("GetOrder")]
    public async Task<IActionResult> GetOrder(
        [FromBody] OrderRequest request,
        CancellationToken cancellationToken)
    {
        Console.WriteLine(">>> REQUEST RECEIVED");
        Console.WriteLine($">>> PoNumber: '{request.PoNumber}'");
        Console.WriteLine($">>> CountryCode: '{request.CountryCode}'");
        Console.WriteLine($">>> OrderNumber: '{request.OrderNumber}'");
        Console.WriteLine($">>> PartnerId: '{request.PartnerId}'");
        Console.WriteLine($">>> CustomerNumber: '{request.CustomerNumber}'");
        Console.WriteLine($">>> Sku: '{request.Sku}'");
        Console.WriteLine($">>> TransactionId: '{request.TransactionId}'");
        Console.WriteLine($">>> Eviorment: '{request.Environment}'");

        var result = await dispatcher.Send(new GetOrderDetailsQuery(request), cancellationToken);

        if (result == null)
        {
            return NotFound("Order not found");
        }

        return Ok(result);
    }
}
