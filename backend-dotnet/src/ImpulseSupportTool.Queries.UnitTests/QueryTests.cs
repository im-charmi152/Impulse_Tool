using ImpulseSupportTool.Data.Abstractions;
using ImpulseSupportTool.Models.Analytics;
using ImpulseSupportTool.Models.Access;
using ImpulseSupportTool.Models.Orders;
using ImpulseSupportTool.Queries.Access;
using ImpulseSupportTool.Queries.Analytics;
using ImpulseSupportTool.Queries.Orders.GetOrderDetails;
using ImpulseSupportTool.ServiceClients.Abstractions;
using ImpulseSupportTool.Util;
using ImpulseSupportTool.Util.Messaging;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace ImpulseSupportTool.Queries.UnitTests;

public sealed class QueryTests
{
    [Fact]
    public async Task Dispatcher_routes_order_details_query_to_its_handler()
    {
        var expected = new OrderResponse { ImiAsgdOrdrNbr = "12345" };
        var services = new ServiceCollection()
            .AddMessaging()
            .AddRequestHandlers(typeof(GetOrderDetailsQueryHandler).Assembly)
            .AddSingleton<IOrderServiceClient>(new FakeOrderServiceClient(expected))
            .BuildServiceProvider();

        var dispatcher = services.GetRequiredService<IDispatcher>();
        var result = await dispatcher.Send(new GetOrderDetailsQuery(new OrderRequest { Environment = "Dev" }));

        Assert.Same(expected, result);
    }

    [Fact]
    public async Task Find_user_rejects_an_invalid_email()
    {
        var handler = new FindUserQueryHandler(new UnusedUserAccessStore());

        var result = await handler.Handle(new FindUserQuery("not-an-email"), CancellationToken.None);

        Assert.Equal(400, result.StatusCode);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(366)]
    public void Date_range_rejects_days_outside_1_to_365(int days)
    {
        var valid = AnalyticsDateRange.TryResolve(null, null, days, out _, out _, out var error);

        Assert.False(valid);
        Assert.Equal("days must be between 1 and 365.", error);
    }

    private sealed class FakeOrderServiceClient(OrderResponse response) : IOrderServiceClient
    {
        public Task<OrderResponse> GetOrder(OrderRequest request) => Task.FromResult(response);
    }

    private sealed class UnusedUserAccessStore : IUserAccessStore
    {
        public Task AppendAsync(UserAccessRecord record, CancellationToken cancellationToken)
            => throw new InvalidOperationException("Store should not be called for an invalid email.");

        public Task<UserAccessRecord?> LatestAsync(string email, CancellationToken cancellationToken)
            => throw new InvalidOperationException("Store should not be called for an invalid email.");
    }
}
