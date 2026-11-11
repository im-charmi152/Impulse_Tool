# Impulse Tool

Web tool for tracing an Impulse order. A support user searches by customer PO number and country, then reviews the header, line items, processing flow, partner setup, and PO switch data on one screen.

Functional requirements are listed in [requirements.txt](requirements.txt).

Source imported from [im-charmi152/Impulse_Tool](https://github.com/im-charmi152/Impulse_Tool.git).

## Architecture

```text
Browser
  React 19 + Vite dashboard (my-dashboard)
        |
        |  VITE_USE_MOCK_API=true  -> services/mockApi.js
        |  VITE_USE_MOCK_API=false -> POST /api/order/GetOrder
        v
ASP.NET Core 8 API (backend-dotnet/src)
  ImpulseSupportTool.Api          controllers, Program.cs (HTTP in, HTTP out)
        |  dispatcher.Send(query or command)
        v
  ImpulseSupportTool.Queries      reads    (GetOrderDetailsQueryHandler, ...)
  ImpulseSupportTool.Commands     writes   (CreateApprovalRequestCommandHandler, ...)
        |                    |
        v                    v
  ImpulseSupportTool.Data
    Oracle/OrderRepository       reads the Oracle ODS (DB2_* tables)
    Sqlite/*                     our access logs (users, requests, guests)
    Analytics/*                  analytics queue and daily file writer
    Security/*                   encrypted admin vault
        |
        v
  ImpulseSupportTool.Models       shared shapes and rules   (no dependencies)
  ImpulseSupportTool.Util         CQRS dispatcher, ApiResult (used by all layers)

Oracle ODS
  ODS.ODS_ORDER
  ODS.ODS_ORDER_LINE
  ODS.DB2_OR_ORDER_STUS_CHGS
  ODS.DB2_EO_ORDR_HDR_INFO
  ODS.DB2_IE_PARTNER_SETUP
  ODS.DB2_IE_IN_PO_SW
```

The UI never talks to Oracle. It asks `services/api.js` for one consolidated object. That file either returns mock data or calls the API and passes the JSON through `services/mapOrderResponse.js`.

The order tables are named `DB2_*`, but they live in the Oracle ODS. The repository reads them with an Oracle connection and `SELECT` statements. Nothing opens a DB2 or ODBC connection.

### Clean Architecture in plain words

The API is split into layers by responsibility. Each layer may depend only on the layers listed under it, which keeps business rules independent of HTTP, databases, and the UI.

Five terms appear throughout the backend:

| Term | Simple meaning | Example |
| --- | --- | --- |
| **Controller** | Receives an HTTP call, sends one message, returns the answer. No business logic. | `OrderController`, `AccessController` |
| **Query** | A message that reads data and changes nothing. | `GetOrderDetailsQuery` |
| **Command** | A message that changes data. | `CreateApprovalRequestCommand` |
| **Handler** | Does the work for one query or command. One handler per use case. | `GetOrderDetailsQueryHandler` |
| **Dispatcher** | Finds the handler for a message and returns its result. | `Dispatcher` in `Util` |

This style is called **CQRS** (Command Query Responsibility Segregation). Reads and writes live in separate classes, so each one is small and easy to test. Handlers depend on interfaces such as `IUserAccessStore` and `IOrderRepository`, not on concrete classes, so unit tests can pass in fakes.

### How a request flows

Order search (a query):

```text
POST /api/order/GetOrder  {poNumber, countryCode, environment}
  -> OrderController            dispatcher.Send(new GetOrderDetailsQuery(...))
  -> Dispatcher                 finds GetOrderDetailsQueryHandler
  -> GetOrderDetailsQueryHandler  asks IOrderRepository for the order
  -> OrderRepository (Data)     picks the environment, reads Oracle
  -> OrderResponse (Models)     travels back up the same path
  -> 200 + JSON, or 404 "Order not found"
```

Access request (a command):

```text
POST /api/access/requests  {email, role, countries}
  -> AccessController           dispatcher.Send(new CreateApprovalRequestCommand(...))
  -> CreateApprovalRequestCommandHandler
        checks rules (AccessRules in Models), reads and writes via IApprovalStore (Data)
  -> SQLite file logs/radius-requests.db
  -> 201 + the new request
```

Analytics event (a command with a background step): the handler validates the event and places it on an in-memory queue. `AnalyticsLogWriter`, a background service, appends it to `logs/analytics/radius-usage-YYYY-MM-DD.jsonl`. The API answers `202 Accepted` immediately.

## Technical design

### Dashboard

| Piece | Role |
| --- | --- |
| `src/RootRouter.jsx` | Hash router for the dashboard and the four detail pages |
| `src/App.jsx` | Search page, result tabs, and export |
| `src/hooks/useOrderSearch.js` | States `idle`, `loading`, `success`, `empty`, `error`. Cancels the previous request and caches the last 20 searches |
| `src/services/api.js` | Chooses mock or live lookup |
| `src/services/orderApi.js` | Axios `POST` to `GetOrder` |
| `src/services/mapOrderResponse.js` | Maps the C# response into the shape the components render |
| `src/services/mockApi.js` | Offline sample order. `NOTFOUND` in any field returns no order |
| `src/data/navigation.js` | Search fields and the three flow definitions |
| `src/utils/auditLog.js` | In-browser record of each search |

Live search sends `poNumber`, `countryCode`, and `environment`. Country code is stored on the order as `COMPANY_CD`. Environment must be `Prod`, `Qa`, or `Dev`.

### API

The backend lives in `backend-dotnet/src`. Each folder is a separate .NET project, and projects reference each other with `<ProjectReference>`.

| Project | Role | Depends on |
| --- | --- | --- |
| `ImpulseSupportTool.Api` | Web host: controllers, `Program.cs` (wiring and startup), Swagger, CORS, `appsettings*.json`, `appsettings.Connections.json`, `logs/`, `Access/admins.enc` | Commands, Queries, Data, Util, Models |
| `ImpulseSupportTool.Queries` | Read handlers: order details, user and guest lookup, login checks, analytics reports and exports | Util, Data, Models |
| `ImpulseSupportTool.Commands` | Write handlers: record user and guest, create, approve and decline requests, password reset, record analytics event | Util, Data, Models |
| `ImpulseSupportTool.Data` | Store and repository interfaces, the Oracle order repository, SQLite stores, analytics queue and background writer, encrypted admin vault | Models |
| `ImpulseSupportTool.Models` | Order, access and analytics shapes, request bodies, options, `AccessRules` | nothing |
| `ImpulseSupportTool.Util` | CQRS dispatcher, handler interfaces, `ApiResult` | none beyond DI abstractions |
| `ImpulseSupportTool.Queries.UnitTests`, `ImpulseSupportTool.Commands.UnitTests` | xUnit tests for handlers | the matching layer |

Key files:

| File | Role |
| --- | --- |
| `Api/Controllers/OrderController.cs` | `POST /api/order/GetOrder` |
| `Queries/Orders/GetOrderDetails/GetOrderDetailsQueryHandler.cs` | Order lookup handler (replaced the old `OrderService`) |
| `Data/Abstractions/IOrderRepository.cs` | Contract for fetching an order |
| `Data/Oracle/OrderRepository.cs` | Opens Oracle and fills `OrderResponse` |
| `Data/Oracle/EnvironmentMapper.cs` | Builds the ODS connection for the selected environment |
| `Data/Oracle/ZoneMapper.cs` | Maps a country code to a DB2 zone (`Z1`–`Z4`) |
| `Models/Orders/OrderRequest.cs`, `OrderResponse.cs` | Request body and the order shape |
| `Util/Messaging/Dispatcher.cs` | Finds and runs the handler for each message |
| `Util/Results/ApiResult.cs` | Status code and body returned by handlers |
| `Api/Program.cs` | Loads the connections file, registers each layer, CORS policy `FrontendPolicy`, Swagger |

`GetOrder` returns `200` with the order, or `404` with `Order not found` when the header query has no row. Swagger is at `/swagger`.

Connection strings are in their own file, `src/ImpulseSupportTool.Api/appsettings.Connections.json`. It holds the three ODS connections (`ODSConnectionProd`, `ODSConnectionQa`, `ODSConnectionDev`) and the DB2 ODBC string. It contains no passwords. `Program.cs` loads it with `AddJsonFile`.

Oracle passwords are user secrets, not files in git:

- `ODSConnectionQa:Password`
- `ODSConnectionDev:Password`
- `ODSConnectionProd:Password`

The user-secrets id is `b7da84d9-96e6-47f8-823c-0dad566774cb`, stored in `src/ImpulseSupportTool.Api`.

Admin sign-in passwords are not in the dashboard. The API reads `backend-dotnet/src/ImpulseSupportTool.Api/Access/admins.enc`, an AES-256-GCM vault. `AdminVault:Key` in `appsettings.json` opens that file. Restart the API after changing it. Without a key, admin sign-in says it is not configured, and production sign-in still works.

## UI

The main screen is a header, a sidebar, and a search card. The card asks for customer PO number, country code, and environment. Search stays disabled until the PO and country are filled in. Recent searches are stored in the browser.

After a successful search the summary banner sits above these tabs:

| Tab | What it shows |
| --- | --- |
| Order Details | Header fields from `ODS.ODS_ORDER` |
| Line Items | Rows from `ODS.ODS_ORDER_LINE` |
| Processing Flow | Progress derived from the EO state code |
| Flow Trace Status | EDI, XEDI+MQ, and X4C system steps |
| PO Switch | Inbound PO switch rows |
| Setup & Configuration | Partner setup |
| Logs & Monitoring | Log and alert panels from the consolidated response |

The active tab can be exported as JSON or CSV.

Detail pages, opened from the result, use hash routes:

- `#/order-header-details`
- `#/line-item-details`
- `#/partner-setup-details`
- `#/po-switch-details`

Empty, loading, and error states are separate panels. Admin and production sign-in are kept in the browser session. Admin passwords are checked by the API and are not stored in the dashboard source.

## Backend

Runtime is .NET 8. The HTTP launch profile listens on `http://localhost:5298`.

### What the backend does

The backend is a **web API**. It is a program that waits for HTTP requests from the dashboard, does some work (usually reading Oracle or a local SQLite file), and returns JSON. It has no screens of its own. It is built with **ASP.NET Core**, Microsoft's web framework for .NET.

### Startup: `Program.cs`

Running the API executes `src/ImpulseSupportTool.Api/Program.cs` from top to bottom in three steps:

1. **Load configuration.** `AddJsonFile("appsettings.Connections.json")` adds the connection strings to the settings.
2. **Register services.** `builder.Services.Add...` tells the app which class fills each job (see [Dependency injection](#dependency-injection-di)).
3. **Build the app and start listening.** `builder.Build()` creates the app. Middleware runs for every request (CORS, a console log line, Swagger), then `app.MapControllers()` connects URLs to controllers, and `app.Run()` starts the server.

`Program.cs` is the only place where the layers are wired together. Nothing else decides which concrete class is used.

### Dependency injection (DI)

A class does not create the helpers it needs. It asks for them in its constructor, and ASP.NET hands them in. This is called **dependency injection**.

```csharp
public sealed class AccessController(IDispatcher dispatcher) : ControllerBase
```

The controller says "I need an `IDispatcher`". It does not know that the real class is `Dispatcher`. Registration in `Program.cs` links them:

| Call in `Program.cs` | What it registers |
| --- | --- |
| `AddMessaging()` | `IDispatcher` → `Dispatcher` |
| `AddCommands()` | every command handler in the Commands project |
| `AddQueries()` | every query handler in the Queries project, plus `AnalyticsLogLocation` |
| `AddData(...)` | `IOrderRepository` → `OrderRepository`, `EnvironmentMapper`, SQLite stores, analytics queue and writer, admin vault, analytics settings |

Two lifetimes are used:

- **Scoped**: one instance per HTTP request. Handlers and the order repository are scoped, so each request gets fresh objects.
- **Singleton**: one instance for the whole life of the app. The analytics queue, the SQLite stores, and the admin vault are singletons.

### The layers, with the files you will open

Each layer has one job. A layer may use the layers listed under it, and it must not do the jobs of the others.

| Layer | Project | Job | Example file | Must not |
| --- | --- | --- | --- | --- |
| Presentation | `Api` | Receive HTTP, send one message, return the answer | `Controllers/AccessController.cs` | contain business rules or open a database |
| Application (reads) | `Queries` | One class per read use case | `Orders/GetOrderDetails/GetOrderDetailsQueryHandler.cs` | know about HTTP types such as `IActionResult` |
| Application (writes) | `Commands` | One class per change use case | `Access/CreateApprovalRequestCommand.cs` | know about HTTP types |
| Domain | `Models` | Shapes of data and business rules | `Access/AccessRules.cs` | depend on any other project |
| Infrastructure (data) | `Data` | Real reads and writes to Oracle, SQLite and files | `Oracle/OrderRepository.cs`, `Sqlite/UserAccessLog.cs` | make business decisions |
| Shared plumbing | `Util` | The dispatcher and the result type | `Messaging/Dispatcher.cs`, `Results/ApiResult.cs` | hold any feature logic |

### One use case, step by step: order lookup

This is the path a single search takes. Each step is a small file.

**1. The controller receives the HTTP call.** It only forwards it:

```csharp
[HttpPost("GetOrder")]
public async Task<IActionResult> GetOrder([FromBody] OrderRequest request, CancellationToken cancellationToken)
{
    var result = await dispatcher.Send(new GetOrderDetailsQuery(request), cancellationToken);
    if (result == null) return NotFound("Order not found");
    return Ok(result);
}
```

**2. The query is a message.** It is a small record that carries the data and says what kind of message it is:

```csharp
public sealed record GetOrderDetailsQuery(OrderRequest Request) : IQuery<OrderResponse?>;
```

Read it as: "a question that asks for order details, and eventually answers with an `OrderResponse` (or nothing)."

**3. The handler does the work.** Each query has exactly one handler:

```csharp
public sealed class GetOrderDetailsQueryHandler(IOrderRepository orderRepository)
    : IQueryHandler<GetOrderDetailsQuery, OrderResponse?>
{
    public async Task<OrderResponse?> Handle(GetOrderDetailsQuery query, CancellationToken cancellationToken)
        => await orderRepository.GetOrder(query.Request);
}
```

The handler does not know about Oracle. It only knows the contract `IOrderRepository`.

**4. The repository talks to the database.** `OrderRepository` picks the environment with `EnvironmentMapper`, opens an Oracle connection, reads the header, lines, status changes, partner setup and PO switch rows, and fills one `OrderResponse` object.

**5. The answer travels back.** The `OrderResponse` returns through the handler and the dispatcher to the controller, which sends it as JSON.

### How the dispatcher finds the right handler

`Dispatcher` (in `Util`) is a small lookup service. For a message it does four things:

1. Look at the message's type, for example `GetOrderDetailsQuery`.
2. Build the matching handler interface, `IRequestHandler<GetOrderDetailsQuery, OrderResponse?>`.
3. Ask DI for an object that implements it.
4. Call its `Handle` method and return the result.

At startup, `AddRequestHandlers` scans each layer's assembly and registers every handler it finds. That is why adding a new handler class needs no extra registration line.

### Results and HTTP status codes: `ApiResult`

Command and query handlers return an `ApiResult`, not an HTTP response. It holds a status code and a body. The controller turns it into a real response with `ToActionResult(this)`.

| Helper | HTTP status | Typical use |
| --- | --- | --- |
| `ApiResult.Ok(body)` | 200 | A read succeeded |
| `ApiResult.Created(body)` | 201 | A new request or guest was saved |
| `ApiResult.Accepted(body)` | 202 | An analytics event was queued |
| `ApiResult.Problem(400, ...)` | 400 | Bad input, such as a non-company email |
| `ApiResult.Problem(401 / 403 / 404 / 503, ...)` | 401, 403, 404, 503 | Wrong password, pending request, not found, admin not configured |
| `ApiResult.File(path, ...)` | 200 with a file | Analytics log export |

Validation problems are returned as results, not thrown as exceptions. A bug or an unreachable database is an unexpected exception, and ASP.NET turns it into an HTTP `500`.

### Where the data lives

No database server runs for our own data. Everything is a file next to the API.

| File | Created by | Contains |
| --- | --- | --- |
| `logs/radius-users.db` | `UserAccessLog` | table `prod_users`: approved production users |
| `logs/radius-requests.db` | `ApprovalLog` | table `approval_requests`: access and password-reset requests |
| `logs/radius-guests.db` | `GuestLog` | table `guest_logins`: guest sign-ins |
| `logs/analytics/radius-usage-YYYY-MM-DD.jsonl` | `AnalyticsLogWriter` | one JSON object per line, one file per day |
| `Access/admins.enc` | you (encrypted) | admin logins, decrypted with `AdminVault:Key` |

Each SQLite store creates its own table the first time it is used. The Oracle ODS is read only: the repository runs `SELECT` statements against the ODS tables.

### Background work: analytics

Tab-view and search events are not written to disk in the request. The flow is:

```text
POST /api/analytics/events
  -> RecordAnalyticsEventCommandHandler   checks the event
  -> IAnalyticsEventQueue                 in-memory queue (bounded, so it cannot grow forever)
  -> AnalyticsLogWriter                   background service, runs for the life of the app,
                                          reads the queue and appends lines to the daily file
```

A **background service** is a class that keeps running while the app is alive. It lets the user get a fast `202 Accepted` without waiting for disk writes.

### Configuration and secrets

| Where | What goes there |
| --- | --- |
| `src/ImpulseSupportTool.Api/appsettings.Connections.json` | Connection strings with no passwords: the three ODS connections and the DB2 ODBC string |
| `src/ImpulseSupportTool.Api/appsettings.json` | Non-secret settings: `Analytics` folder, `AccessLog` file names, `AdminVault:Key` |
| `src/ImpulseSupportTool.Api/appsettings.Development.json` | Overrides used only in the Development environment |
| `dotnet user-secrets` | Oracle passwords: `ODSConnectionQa:Password`, `ODSConnectionDev:Password`, `ODSConnectionProd:Password` |

Settings are read through `IConfiguration`. Typed settings classes such as `AnalyticsOptions` and `AccessLogOptions` (in `Models/Options`) hold the values. When a connection is needed, `EnvironmentMapper` reads the matching connection string from `appsettings.Connections.json` and adds the password from user secrets.

### Tests

The two test projects check handlers in isolation. A handler gets a **fake** store, which is a small class that pretends to be the database and records what was asked. For example, `RecordGuestCommandTests` checks that a non-company email is rejected and that the fake store is never written to. Run them with `dotnet test ImpulseSupportTool_Repo.sln`.

### Suggested reading order

If you are new to the code, open the files in this order:

1. `src/ImpulseSupportTool.Api/Program.cs`: how everything is wired.
2. `src/ImpulseSupportTool.Api/Controllers/OrderController.cs`: the simplest controller.
3. `src/ImpulseSupportTool.Queries/Orders/GetOrderDetails/`: the query and its handler.
4. `src/ImpulseSupportTool.Data/Abstractions/IOrderRepository.cs`: the contract.
5. `src/ImpulseSupportTool.Data/Oracle/OrderRepository.cs`: the database code behind it.
6. `src/ImpulseSupportTool.Util/Messaging/Dispatcher.cs`: how messages find handlers.
7. `src/ImpulseSupportTool.Util/Results/ApiResult.cs`: how results become HTTP responses.
8. `src/ImpulseSupportTool.Api/Controllers/AccessController.cs`, then one command such as `src/ImpulseSupportTool.Commands/Access/CreateApprovalRequestCommand.cs`.
9. `src/ImpulseSupportTool.Models/Access/AccessRules.cs`: the business rules.
10. `src/ImpulseSupportTool.Data/Sqlite/`: how our own data is stored.
11. `src/ImpulseSupportTool.Queries.UnitTests/`: examples of testing.

### Words you will meet

| Word | Meaning |
| --- | --- |
| **Interface** | A contract listing what a class can do, such as `IUserAccessStore`. Names start with `I`. |
| **Class** | A blueprint for an object that holds data and behavior. |
| **Record** | A short class that is mostly data, such as the query and command messages. |
| **Async / await / Task** | Work that may take time, such as a database call. `await` waits for it without blocking the server. |
| **Middleware** | Code that runs for every request before or after the controller. |
| **Project reference** | A link from one `.csproj` to another, so one project can use the other's classes. |
| **NuGet package** | A library downloaded from the package feed, such as `Oracle.ManagedDataAccess.Core`. |
| **JSON / JSONL** | Text format for data. JSONL puts one JSON object on each line. |
| **Swagger** | A web page at `/swagger` that lists every endpoint and lets you try them. |

Request example:

```http
POST /api/order/GetOrder
Content-Type: application/json

{
  "poNumber": "CW22988",
  "countryCode": "MD",
  "environment": "Prod"
}
```

`countryCode` is the company code in `ODS.ODS_ORDER`. `environment` selects `ODSConnectionProd`, `ODSConnectionQa`, or `ODSConnectionDev` from `appsettings.Connections.json`, then appends the matching user-secret password.

Package versions are listed under [Dependencies and run commands](#dependencies-and-run-commands).

## Dependencies and run commands

Run the commands from the repository root unless a heading says otherwise. The dashboard can run on mock data with no API. The API is a separate process.

### Frontend (`my-dashboard`)

Runtime:

- Node.js 22
- npm 10

Install and start:

```bash
cd my-dashboard
npm ci
npm run dev
```

`npm run dev` starts Vite. Open the local URL it prints. Default mock settings in `my-dashboard/.env.local`:

```text
VITE_ORDER_API_BASE_URL=http://localhost:5298/api/order
VITE_USE_MOCK_API=true
```

With `VITE_USE_MOCK_API=true`, any PO returns the sample order. A PO that contains `NOTFOUND` shows the empty state.

Other frontend commands, still from `my-dashboard`:

```bash
npm run build
npm run lint
npm run preview
```

| Command | What it does |
| --- | --- |
| `npm ci` | Installs the lockfile in `my-dashboard/package-lock.json` |
| `npm run dev` | Dev server with hot reload (`vite`) |
| `npm run build` | Production build into `my-dashboard/dist` |
| `npm run preview` | Serves the production build |
| `npm run lint` | ESLint |

Dependencies from `my-dashboard/package.json`:

| Package | Version | Used for |
| --- | --- | --- |
| `react` | ^19.2.6 | UI |
| `react-dom` | ^19.2.6 | Browser rendering |
| `axios` | ^1.18.1 | `POST /api/order/GetOrder` |
| `lucide-react` | ^1.17.0 | Icons |
| `react-circle-flags` | ^0.0.30 | Country flags in the search card |
| `@tailwindcss/vite` | ^4.3.0 | Tailwind Vite plugin |
| `tailwindcss` | ^4.3.0 | Styles |
| `vite` | ^8.0.12 | Dev server and production build |
| `@vitejs/plugin-react` | ^6.0.1 | React transform in Vite |
| `eslint` | ^10.3.0 | Lint |
| `@eslint/js` | ^10.0.1 | ESLint base config |
| `eslint-plugin-react-hooks` | ^7.1.1 | Hooks lint rules |
| `eslint-plugin-react-refresh` | ^0.5.2 | React refresh lint rules |
| `globals` | ^17.6.0 | ESLint browser globals |
| `autoprefixer` | ^10.5.0 | CSS prefixes |
| `postcss` | ^8.5.15 | CSS processing |
| `@types/react` | ^19.2.14 | React type hints |
| `@types/react-dom` | ^19.2.3 | React DOM type hints |

### Backend (`backend-dotnet`)

Runtime:

- .NET SDK 8.0
- Network path to the ODS host for Prod, Qa, or Dev
- User-secret passwords for the three ODS connections

Restore, set passwords, and start the API:

```bash
cd backend-dotnet
dotnet restore ImpulseSupportTool_Repo.sln
dotnet user-secrets set "ODSConnectionQa:Password" "<qa-password>" --project src/ImpulseSupportTool.Api
dotnet user-secrets set "ODSConnectionDev:Password" "<dev-password>" --project src/ImpulseSupportTool.Api
dotnet user-secrets set "ODSConnectionProd:Password" "<prod-password>" --project src/ImpulseSupportTool.Api
dotnet run --project src/ImpulseSupportTool.Api --launch-profile http
```

The `http` profile listens on `http://localhost:5298`. Swagger is at `http://localhost:5298/swagger`.

Other backend commands, from `backend-dotnet`:

| Command | What it does |
| --- | --- |
| `dotnet build ImpulseSupportTool_Repo.sln` | Compiles every project |
| `dotnet test ImpulseSupportTool_Repo.sln` | Runs the unit tests |
| `dotnet run --project src/ImpulseSupportTool.Api --launch-profile https` | Same port, Development environment, HTTPS profile in `launchSettings.json` |
| `dotnet user-secrets set ... --project src/ImpulseSupportTool.Api` | Stores an ODS password outside the repo |

NuGet packages, by project:

| Project | Package | Version | Used for |
| --- | --- | --- | --- |
| `Api` | `Swashbuckle.AspNetCore` | 6.6.2 | Swagger UI at `/swagger` |
| `Data` | `Microsoft.Data.Sqlite` | 8.0.11 | SQLite access logs |
| `Data` | `Oracle.ManagedDataAccess.Core` | 23.26.300 | ODS Oracle connections and queries |
| `Data` | `System.Data.Odbc` | 10.0.8 | ODBC reference. The code does not open this connection today |
| `Util` | `Microsoft.Extensions.DependencyInjection.Abstractions` | 8.0.2 | Registration helpers |
| `Commands.UnitTests`, `Queries.UnitTests` | `xunit`, `xunit.runner.visualstudio`, `Microsoft.NET.Test.Sdk` | 2.9.2, 2.8.2, 17.11.1 | Unit tests |

The ASP.NET Core shared framework comes from the .NET 8 SDK (`Microsoft.NET.Sdk.Web`, `net8.0`). It is not a separate package reference.

### Dashboard against the API

Start the API first. Then point the UI at it:

```bash
cd my-dashboard
```

Set `my-dashboard/.env.local`:

```text
VITE_ORDER_API_BASE_URL=http://localhost:5298/api/order
VITE_USE_MOCK_API=false
```

Restart the dev server:

```bash
npm run dev
```

Search with a customer PO, a country code, and Prod, Qa, or Dev. The browser calls `http://localhost:5298/api/order/GetOrder`.

### Endpoints at a glance

| Area | Method and path | Handled by |
| --- | --- | --- |
| Orders | `POST /api/order/GetOrder` | `GetOrderDetailsQuery` |
| Access | `POST /api/access/users`, `GET /api/access/users` | `RecordUserCommand`, `FindUserQuery` |
| Access | `POST /api/access/login`, `POST /api/access/admin-login` | `LoginQuery`, `AdminLoginQuery` |
| Access | `POST /api/access/guests`, `GET /api/access/guests` | `RecordGuestCommand`, `FindGuestQuery` |
| Access | `GET /api/access/requests`, `POST /api/access/requests` | `ListRequestsQuery`, `CreateApprovalRequestCommand` |
| Access | `POST /api/access/requests/{id}/approve`, `.../decline` | `ApproveRequestCommand`, `DeclineRequestCommand` |
| Access | `POST /api/access/password-resets` | `CreatePasswordResetCommand` |
| Analytics | `POST /api/analytics/events` | `RecordAnalyticsEventCommand` |
| Analytics | `GET /api/analytics/summary`, `daily`, `export`, `recent-tabs` | the matching analytics queries |
| Debug | `GET /debug/routes` | lists registered endpoints |

## Repository layout

```text
Impulse_Tool/
  README.md                       this file
  requirements.txt                functional and runtime requirements
  my-dashboard/                   React + Vite UI
  backend-dotnet/
    ImpulseSupportTool_Repo.sln   solution file listing every project
    src/
      ImpulseSupportTool.Api/              web host, controllers, Program.cs, config files
      ImpulseSupportTool.Commands/         write-side handlers
      ImpulseSupportTool.Queries/          read-side handlers
      ImpulseSupportTool.Models/           shapes, options, access rules
      ImpulseSupportTool.Data/             Oracle order repository, SQLite stores,
                                           analytics writer, admin vault
      ImpulseSupportTool.Util/             CQRS dispatcher and ApiResult
      ImpulseSupportTool.Commands.UnitTests/
      ImpulseSupportTool.Queries.UnitTests/
```

## Known limitations

- The API has no authentication or authorization middleware yet, and CORS allows any origin.
- The `prod_users` SQLite table stores passwords in plain text.
- The admin vault key (`AdminVault:Key`) sits in `appsettings.json`, next to the encrypted vault file. Moving it to user secrets or an environment variable would protect it.
- Analytics reports read the log files directly from the Queries project. A later step could move that file access behind a store interface.
