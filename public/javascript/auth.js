document.addEventListener('DOMContentLoaded', function() {
  const userMenuBtn = document.getElementById('userMenuBtn');
  const userDropdown = document.getElementById('userDropdown');
  const loginModal = document.getElementById('loginModal');
  const signupModal = document.getElementById('signupModal');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');

  if (userMenuBtn && userDropdown) {
    userMenuBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      userDropdown.classList.toggle('show');
    });

    document.addEventListener('click', function(e) {
      if (!userMenuBtn.contains(e.target) && !userDropdown.contains(e.target)) {
        userDropdown.classList.remove('show');
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      const formData = new FormData(loginForm);
      const data = {
        email: formData.get('email'),
        password: formData.get('password')
      };

      try {
        const response = await fetch('/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
          window.location.href = result.redirect || '/';
        } else {
          const errorDiv = document.getElementById('loginError');
          errorDiv.textContent = result.error || 'Login failed';
          errorDiv.classList.add('show');
        }
      } catch (error) {
        console.error('Login error:', error);
        const errorDiv = document.getElementById('loginError');
        errorDiv.textContent = 'An error occurred. Please try again.';
        errorDiv.classList.add('show');
      }
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      const formData = new FormData(signupForm);
      const data = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        password: formData.get('password')
      };

      try {
        const response = await fetch('/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
          window.location.href = result.redirect || '/';
        } else {
          const errorDiv = document.getElementById('signupError');
          errorDiv.textContent = result.error || 'Signup failed';
          errorDiv.classList.add('show');
        }
      } catch (error) {
        console.error('Signup error:', error);
        const errorDiv = document.getElementById('signupError');
        errorDiv.textContent = 'An error occurred. Please try again.';
        errorDiv.classList.add('show');
      }
    });
  }

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('login') === 'true') {
    showLoginModal();
  }
});

function showLoginModal() {
  const modal = document.getElementById('loginModal');
  if (modal) {
    modal.classList.add('show');
    document.getElementById('loginError').classList.remove('show');
  }
}

function closeLoginModal() {
  const modal = document.getElementById('loginModal');
  if (modal) {
    modal.classList.remove('show');
  }
}

function showSignupModal() {
  const modal = document.getElementById('signupModal');
  if (modal) {
    modal.classList.add('show');
    document.getElementById('signupError').classList.remove('show');
  }
}

function closeSignupModal() {
  const modal = document.getElementById('signupModal');
  if (modal) {
    modal.classList.remove('show');
  }
}

window.onclick = function(event) {
  const loginModal = document.getElementById('loginModal');
  const signupModal = document.getElementById('signupModal');
  const successModal = document.getElementById('successModal');

  if (event.target === loginModal) {
    closeLoginModal();
  }
  if (event.target === signupModal) {
    closeSignupModal();
  }
  if (event.target === successModal) {
    closeSuccessModal();
  }
};
