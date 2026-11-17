using ImpulseSupportTool.Commands.Access;
using ImpulseSupportTool.Data.Abstractions;
using ImpulseSupportTool.Models.Access;
using ImpulseSupportTool.Models.Requests;
using ImpulseSupportTool.Util.Results;
using Xunit;

namespace ImpulseSupportTool.Commands.UnitTests;

public sealed class RecordGuestCommandTests
{
    [Fact]
    public async Task Rejects_a_non_company_email_without_writing()
    {
        var store = new FakeGuestStore();
        var handler = new RecordGuestCommandHandler(store);

        var result = await handler.Handle(
            new RecordGuestCommand(new GuestLoginRequest
            {
                Email = "someone@example.com",
                Name = "Someone",
                Country = "US",
                Role = "Analyst",
            }),
            CancellationToken.None);

        Assert.Equal(400, result.StatusCode);
        Assert.Equal(0, store.AddCount);
    }

    [Fact]
    public async Task Saves_a_valid_guest_and_returns_created()
    {
        var store = new FakeGuestStore();
        var handler = new RecordGuestCommandHandler(store);

        var result = await handler.Handle(
            new RecordGuestCommand(new GuestLoginRequest
            {
                Email = "  Jane.Doe@IngramMicro.com ",
                Name = " Jane Doe ",
                Country = "US",
                Role = "Analyst",
            }),
            CancellationToken.None);

        Assert.Equal(201, result.StatusCode);
        Assert.Equal(1, store.AddCount);
        Assert.Equal("jane.doe@ingrammicro.com", store.LastAdded?.Email);
        Assert.Equal("Jane Doe", store.LastAdded?.Name);
    }

    private sealed class FakeGuestStore : IGuestStore
    {
        public int AddCount { get; private set; }

        public GuestLoginRecord? LastAdded { get; private set; }

        public Task<GuestLoginRecord> AddAsync(GuestLoginRecord record, CancellationToken cancellationToken)
        {
            AddCount++;
            LastAdded = record;
            return Task.FromResult(record);
        }

        public Task<GuestLoginRecord?> LatestByEmailAsync(string email, CancellationToken cancellationToken)
            => Task.FromResult<GuestLoginRecord?>(null);
    }
}
