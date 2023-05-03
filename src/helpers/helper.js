export function checkLocalStorage() {
    if (localStorage.getItem("username")) return true;
    return false;
}