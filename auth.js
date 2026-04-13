// public/js/auth.js
(function() {
  const token = localStorage.getItem("tnm_token");
  if (!token && !window.location.pathname.includes("login.html")) {
    window.location.href = "login.html";
    return;
  }

  // Interceptador global do Fetch API para injetar o Authorization Bearer
  const originalFetch = window.fetch;
  window.fetch = async function() {
    let [resource, config] = arguments;
    if (!config) config = {};
    if (!config.headers) config.headers = {};
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Define JSON como padrão se não for upload de arquivo nativo
    if (!config.headers['Content-Type'] && !(config.body instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }

    const response = await originalFetch(resource, config);
    
    // Logout automático se o JWT expirar
    if (response.status === 401) {
      localStorage.removeItem("tnm_token");
      localStorage.removeItem("tnm_user");
      window.location.href = "login.html";
    }
    return response;
  };
})();
