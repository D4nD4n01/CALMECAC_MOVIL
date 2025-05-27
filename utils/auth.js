export const getUserID = () => {
    const id = localStorage.getItem("userID");
    return id ? parseInt(id) : null;
  };