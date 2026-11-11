using ImpulseSupportTool.Util.Messaging;
using ImpulseSupportTool.Models.Orders;

namespace ImpulseSupportTool.Queries.Orders.GetOrderDetails;

/// <summary>
/// Query: load the full details of one order.
/// </summary>
public sealed record GetOrderDetailsQuery(OrderRequest Request) : IQuery<OrderResponse?>;
