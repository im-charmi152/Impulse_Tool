using ImpulseSupportTool.Models.Orders;

namespace ImpulseSupportTool.ServiceClients.Abstractions;

/// <summary>
/// Port for reading order data from the order-management source (Oracle/ODBC).
/// </summary>
public interface IOrderServiceClient
{
    Task<OrderResponse> GetOrder(OrderRequest request);
}
