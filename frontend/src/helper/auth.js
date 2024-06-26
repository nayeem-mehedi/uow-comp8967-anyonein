const isLoggedIn = () => {
    return !!localStorage.getItem('token');
};

const getToken = () => {
    return localStorage.getItem('token');
};

export { isLoggedIn, getToken };