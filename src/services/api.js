import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://loan.microfinancedevelopmentprojectbangladesh.com";

const api = axios.create({
  baseURL,
});

/* ================= REQUEST INTERCEPTOR ================= */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const mode = localStorage.getItem("mode");

    if (mode) {
      config.headers["X-Client-Mode"] = mode;
    }

    /**
     * FormData হলে Content-Type manually সেট করা যাবে না।
     * Browser নিজে multipart boundary সেট করবে।
     */
    const isFormData = config.data instanceof FormData;

    if (isFormData) {
      delete config.headers["Content-Type"];
      delete config.headers["content-type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= RESPONSE INTERCEPTOR ================= */
api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;

    /*
     * Login request-এর 401 হলে এখানে redirect/reload করা যাবে না।
     *
     * /auth/login/user
     * → Login.jsx নিজে error popup দেখাবে।
     */
    const requestUrl = error.config?.url || "";

    const isLoginRequest =
      requestUrl.includes("/auth/login/user");

    if (status === 401 && !isLoginRequest) {
      localStorage.removeItem("access");
      localStorage.removeItem("mode");

      /*
       * window.location.href ব্যবহার না করে
       * history API ব্যবহার করলে full page reload হয় না।
       */
      if (window.location.pathname !== "/login") {
        window.history.replaceState({}, "", "/login");

        /*
         * React Router-কে route change detect করানোর জন্য
         * popstate event পাঠানো হচ্ছে।
         */
        window.dispatchEvent(new PopStateEvent("popstate"));
      }
    }

    return Promise.reject(error);
  }
);

export default api;



