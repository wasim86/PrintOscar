using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SegishopAPI.Services;
using SegishopAPI.DTOs;
using System.Security.Claims;

namespace SegishopAPI.Controllers
{
    [ApiController]
    [Route("api/customer/payment-methods")]
    [Authorize]
    public class CustomerPaymentMethodsController : ControllerBase
    {
        private readonly ICustomerPaymentMethodService _paymentMethodService;

        public CustomerPaymentMethodsController(ICustomerPaymentMethodService paymentMethodService)
        {
            _paymentMethodService = paymentMethodService;
        }

        [HttpGet]
        public async Task<ActionResult<List<CustomerPaymentMethodDto>>> GetPaymentMethods()
        {
            var customerId = GetCustomerId();
            if (customerId == null)
                return Unauthorized();

            var paymentMethods = await _paymentMethodService.GetCustomerPaymentMethodsAsync(customerId.Value);
            return Ok(paymentMethods);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CustomerPaymentMethodDto>> GetPaymentMethod(int id)
        {
            var customerId = GetCustomerId();
            if (customerId == null)
                return Unauthorized();

            var paymentMethod = await _paymentMethodService.GetPaymentMethodByIdAsync(id, customerId.Value);
            if (paymentMethod == null)
                return NotFound();

            return Ok(paymentMethod);
        }

        [HttpPost]
        public async Task<ActionResult<CustomerPaymentMethodDto>> CreatePaymentMethod(CreateCustomerPaymentMethodDto createDto)
        {
            var customerId = GetCustomerId();
            if (customerId == null)
                return Unauthorized();

            if (!ModelState.IsValid)
            {
                var errors = ModelState
                    .Where(x => x.Value?.Errors.Count > 0)
                    .ToDictionary(
                        kvp => kvp.Key,
                        kvp => kvp.Value?.Errors.Select(e => e.ErrorMessage).ToArray()
                    );
                return BadRequest(new { message = "Validation failed", errors });
            }

            try
            {
                var paymentMethod = await _paymentMethodService.CreatePaymentMethodAsync(customerId.Value, createDto);
                return CreatedAtAction(nameof(GetPaymentMethod), new { id = paymentMethod.Id }, paymentMethod);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = "Validation error", error = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Failed to create payment method", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<CustomerPaymentMethodDto>> UpdatePaymentMethod(int id, UpdateCustomerPaymentMethodDto updateDto)
        {
            var customerId = GetCustomerId();
            if (customerId == null)
                return Unauthorized();

            var paymentMethod = await _paymentMethodService.UpdatePaymentMethodAsync(id, customerId.Value, updateDto);
            if (paymentMethod == null)
                return NotFound();

            return Ok(paymentMethod);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePaymentMethod(int id)
        {
            var customerId = GetCustomerId();
            if (customerId == null)
                return Unauthorized();

            var success = await _paymentMethodService.DeletePaymentMethodAsync(id, customerId.Value);
            if (!success)
                return NotFound();

            return NoContent();
        }

        [HttpPost("{id}/set-default")]
        public async Task<IActionResult> SetDefaultPaymentMethod(int id)
        {
            var customerId = GetCustomerId();
            if (customerId == null)
                return Unauthorized();

            var success = await _paymentMethodService.SetDefaultPaymentMethodAsync(customerId.Value, id);
            if (!success)
                return NotFound();

            return Ok(new { message = "Default payment method updated successfully" });
        }

        private int? GetCustomerId()
        {
            var customerIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (int.TryParse(customerIdClaim, out int customerId))
            {
                return customerId;
            }
            return null;
        }
    }
}
