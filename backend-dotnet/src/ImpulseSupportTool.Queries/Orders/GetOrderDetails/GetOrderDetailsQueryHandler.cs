using ImpulseSupportTool.Util.Messaging;
using ImpulseSupportTool.ServiceClients.Abstractions;
using ImpulseSupportTool.Models.Orders;

namespace ImpulseSupportTool.Queries.Orders.GetOrderDetails;

public sealed class GetOrderDetailsQueryHandler(IOrderServiceClient orderRepository)
    : IQueryHandler<GetOrderDetailsQuery, OrderResponse?>
{
    public async Task<OrderResponse?> Handle(GetOrderDetailsQuery query, CancellationToken cancellationToken)
        => await orderRepository.GetOrder(query.Request);
}
