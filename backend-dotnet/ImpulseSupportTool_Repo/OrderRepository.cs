using System.Data.Odbc;
using ImpulseSupportTool_Repo;

namespace OrderManagement.API.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly IConfiguration _configuration;

        public OrderRepository(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<OrderResponse> GetOrder(OrderRequest request)
        {
            Console.WriteLine($">>> QUERY PARAMS: PoNumber='{request.PoNumber}' CountryCode='{request.CountryCode}'");

            OrderResponse response = null;

            string password = _configuration["DB2:Password"];
            string connectionString = _configuration.GetConnectionString("DB2Connection");
            connectionString += $"PWD={password};";

            using OdbcConnection conn = new OdbcConnection(connectionString);
            await conn.OpenAsync();

            Console.WriteLine($">>> DB2 CONNECTION OPENED OK");

            // ✅ TRIM fixes trailing spaces in CHAR fixed-width columns
            string query = @"
                SELECT
                    CUST_CO_CD,
                    CUST_BR,
                    CUST_NBR,       
                    CUST_SFX,
                    CUST_PO_NBR,
                    CUST_PO_DT,
                    TAG_NBR,
                    PARTNER_ID,
                    CMB_BATCH_NBR,
                    IMI_ASGD_BR_NBR,                    
                    IMI_ASGD_ORDR_NBR,
                    STATE_CD,
                    IMI_CARR_CODE,
                    ORDR_SHP_FR_BR,
                    ORDR_STATUS,
                    HOLD_CD,
                    TERM_ID
                FROM Z1.EO_ORDR_HDR_INFO
                WHERE TRIM(CUST_PO_NBR) = ? AND TRIM(CUST_CO_CD) = ?
                FETCH FIRST 10 ROWS ONLY";

            using OdbcCommand cmd = new OdbcCommand(query, conn);

            // ✅ Also trim values coming from React just in case
            cmd.Parameters.Add("?", OdbcType.VarChar).Value = request.PoNumber.Trim();
            cmd.Parameters.Add("?", OdbcType.VarChar).Value = request.CountryCode.Trim();

            Console.WriteLine($">>> EXECUTING QUERY...");

            using OdbcDataReader reader = (OdbcDataReader)await cmd.ExecuteReaderAsync();

            Console.WriteLine($">>> READER HAS ROWS: {reader.HasRows}");

            if (await reader.ReadAsync())
            {
                Console.WriteLine($">>> ROW FOUND - mapping response...");
                response = new OrderResponse
                {
                    CustCoCd = reader["CUST_CO_CD"]?.ToString()?.Trim(),
                    CustBr = reader["CUST_BR"]?.ToString()?.Trim(),
                    CustNbr = reader["CUST_NBR"]?.ToString()?.Trim(),
<<<<<<< Updated upstream
                    CustSfx = reader["CUST_NBR"]?.ToString()?.Trim(),
=======
                    CustSfx = reader["CUST_SFX"]?.ToString()?.Trim(),
>>>>>>> Stashed changes
                    PoNumber = request.PoNumber.Trim(),
                    CustPoDt = reader["CUST_PO_DT"]?.ToString()?.Trim(),
                    TagNbr = reader["TAG_NBR"]?.ToString()?.Trim(),
                    PartnerId = reader["PARTNER_ID"]?.ToString()?.Trim(),
<<<<<<< Updated upstream
                    CmbBtchNbr = reader["CMB_BTCH_NBR"]?.ToString()?.Trim(),
=======
                    CmbBtchNbr = reader["CMB_BATCH_NBR"]?.ToString()?.Trim(),
>>>>>>> Stashed changes
                    ImiAsgdBrNbr = reader["IMI_ASGD_BR_NBR"]?.ToString()?.Trim(),
                    ImiAsgdOrdrNbr = reader["IMI_ASGD_ORDR_NBR"]?.ToString()?.Trim(),
                    StateCd = reader["STATE_CD"]?.ToString()?.Trim(),
                    ImiCarCd = reader["IMI_CARR_CODE"]?.ToString()?.Trim(),
<<<<<<< Updated upstream
                    OrdShFr = reader["ORD_SHIP_FR_BR"]?.ToString()?.Trim(),
=======
                    OrdShFr = reader["ORDR_SHP_FR_BR"]?.ToString()?.Trim(),
>>>>>>> Stashed changes
                    OrdSt = reader["ORDR_STATUS"]?.ToString()?.Trim(),
                    HoldCd = reader["HOLD_CD"]?.ToString()?.Trim(),
                    TermId = reader["TERM_ID"]?.ToString()?.Trim(),
                };
            }

            Console.WriteLine($">>> RESULT: {(response == null ? "NULL - no data found" : "SUCCESS - data returned")}");

            return response;
        }
    }
}