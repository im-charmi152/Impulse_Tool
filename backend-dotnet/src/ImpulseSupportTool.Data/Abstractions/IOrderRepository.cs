using ImpulseSupportTool.Models.Orders;

namespace ImpulseSupportTool.Data.Abstractions;

/// <summary>
/// Port for reading order data from the order-management source (Oracle/ODBC).
/// </summary>
public interface IOrderRepository
{
    Task<OrderResponse> GetOrder(OrderRequest request);
}
