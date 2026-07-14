using Microsoft.AspNetCore.Mvc;
//using OrderManagement.API.Models;
//using OrderManagement.API.Services;

namespace ImpulseSupportTool_Repo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _service;

        public OrderController(IOrderService service)
        {
            _service = service;
        }

        [HttpPost("GetOrder")]
        public async Task<IActionResult> GetOrder(
            [FromBody] OrderRequest request)
        {
            var result = await _service.GetOrderDetails(request);

            if (result == null)
            {
                return NotFound("Order not found");
            }

            return Ok(result);
        }
    }
}
