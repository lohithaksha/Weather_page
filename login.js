document.getElementById("loginButton").addEventListener("click", function() {
  login();
});

function login() {
  const usernameInput = document.getElementById("username").value;
  const passwordInput = document.getElementById("password").value;

  // Check if username is in uniqueData
  if (uniqueData.includes(usernameInput)) {
      document.getElementById("username").classList.remove("red-outline");
      document.getElementById("username").classList.add("green-outline");
  } else {
      document.getElementById("username").classList.remove("green-outline");
      document.getElementById("username").classList.add("red-outline");
  }

  // Check if username and password match sampleData
  if (sampleData[usernameInput] === passwordInput) {
      document.getElementById("password").classList.remove("red-outline");
      document.getElementById("password").classList.add("green-outline");
      
      // Redirect to next_page.html after successful login
      window.location.href = 'next_page.html';
  } else {
      document.getElementById("password").classList.remove("green-outline");
      document.getElementById("password").classList.add("red-outline");
  }
}
