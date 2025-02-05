const getAuthToken = () => {
    const cookies = document.cookie.split("; ");
    const token = cookies.find(cookie => cookie.startsWith("authToken="));
    return token ? token.split("=")[1] : null;
  };

  export default getAuthToken