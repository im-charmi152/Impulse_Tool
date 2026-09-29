using Microsoft.Extensions.Configuration;

namespace ImpulseSupportTool_Repo
{
    public class EnviormentMapper
    {
        private readonly IConfiguration _configuration;

        public EnviormentMapper(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GetOdsConnectionString(string environment)
        {
            if (string.IsNullOrWhiteSpace(environment))
            {
                throw new ArgumentException(
                    "Environment is required. Expected Prod, Dev, or Qa.");
            }

            string connectionName = environment.Trim().ToUpperInvariant() switch
            {
                "PROD" => "ODSConnectionProd",
                "DEV" => "ODSConnectionDev",
                "QA" => "ODSConnectionQa",

                _ => throw new ArgumentException(
                    $"Invalid environment '{environment}'. " +
                    "Expected Prod, Dev, or Qa.")
            };

            string? connectionString =
                _configuration.GetConnectionString(connectionName);

            if (string.IsNullOrWhiteSpace(connectionString))
            {
                throw new InvalidOperationException(
                    $"ODS connection string '{connectionName}' is not configured.");
            }

            return connectionString;
        }
    }
}