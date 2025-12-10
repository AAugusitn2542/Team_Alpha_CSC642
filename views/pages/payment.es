<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment - Community Housing Platform</title>
  <link rel="stylesheet" href="/style.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
  <% include('../partials/header') %>

  <!-- Hero Section -->
  <div class="confirm-pay-hero">
    <h1>Complete Your Booking</h1>
    <p>Secure payment for your community housing</p>
  </div>

  <!-- Payment Container -->
  <div class="confirm-pay-container">
    <!-- Booking Summary -->
    <div class="booking-summary">
      <div class="community-preview">
        <img src="https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg" alt="Community">
      </div>

      <div class="community-info-box">
        <div class="community-label">SELECTED COMMUNITY</div>
        <h3>Modern Hillside Community</h3>
      </div>

      <div class="price-breakdown">
        <h3>Price Summary</h3>
        <div class="breakdown-item">
          <span>$150 × 15 nights</span>
          <span>$2,250.00</span>
        </div>
        <div class="breakdown-item">
          <span>Service Fee (10%)</span>
          <span>$225.00</span>
        </div>
        <div class="breakdown-item">
          <span>Taxes</span>
          <span>$202.50</span>
        </div>
        <div class="breakdown-divider"></div>
        <div class="breakdown-item total">
          <span>Total</span>
          <span>$2,677.50</span>
        </div>
      </div>

      <div class="payment-badges">
        <img src="https://cdn-icons-png.flaticon.com/128/349/349221.png" alt="Visa" class="payment-badge">
        <img src="https://cdn-icons-png.flaticon.com/128/349/349228.png" alt="Mastercard" class="payment-badge">
        <img src="https://cdn-icons-png.flaticon.com/128/349/349241.png" alt="PayPal" class="payment-badge">
      </div>
    </div>

    <!-- Payment Form -->
    <div class="payment-form-section">
      <form>
        <!-- Billing Information -->
        <div class="form-section">
          <h2>Billing Information</h2>
          <label for="fullname">Full Name</label>
          <input type="text" id="fullname" class="form-input" placeholder="John Doe" required>

          <label for="email">Email Address</label>
          <input type="email" id="email" class="form-input" placeholder="john@example.com" required>

          <label for="phone">Phone Number</label>
          <input type="tel" id="phone" class="form-input" placeholder="+1 (555) 123-4567" required>

          <label for="address">Billing Address</label>
          <input type="text" id="address" class="form-input" placeholder="123 Main Street" required>
        </div>

        <!-- Card Information -->
        <div class="form-section">
          <h2>Card Information</h2>
          <label for="cardname">Name on Card</label>
          <input type="text" id="cardname" class="form-input" placeholder="John Doe" required>

          <label for="cardnumber">Card Number</label>
          <input type="text" id="cardnumber" class="form-input" placeholder="1234 5678 9012 3456" required>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div>
              <label for="expiry">Expiry Date</label>
              <input type="text" id="expiry" class="form-input" placeholder="MM/YY" required>
            </div>
            <div>
              <label for="cvv">CVV</label>
              <input type="text" id="cvv" class="form-input" placeholder="123" required>
            </div>
          </div>
        </div>

        <!-- Terms -->
        <div class="terms-text">
          <input type="checkbox" id="terms" required>
          <label for="terms" style="display: inline; margin-left: 0.5rem;">
            I agree to the <a href="#" style="color: var(--primary-color);">Terms and Conditions</a> 
            and <a href="#" style="color: var(--primary-color);">Privacy Policy</a>
          </label>
        </div>

        <!-- Submit Button -->
        <button type="submit" class="btn-confirm">
          <i class="fas fa-lock"></i> Complete Payment - $2,677.50
        </button>

        <p style="text-align: center; color: var(--text-light); margin-top: 1rem; font-size: 0.9rem;">
          Your payment is secured and encrypted
        </p>
      </form>
    </div>
  </div>

  <% include('../partials/footer') %>

  <script>
    // Form submission
    document.querySelector('form').addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Payment processing is coming soon!');
    });

    // Card number formatting
    document.getElementById('cardnumber').addEventListener('input', function(e) {
      let value = e.target.value.replace(/\s/g, '');
      let formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ');
      e.target.value = formattedValue;
    });

    // Expiry date formatting
    document.getElementById('expiry').addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
      e.target.value = value;
    });
  </script>
</body>
</html>
