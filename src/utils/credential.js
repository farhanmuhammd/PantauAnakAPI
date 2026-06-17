export const generateDefaultCredential = (fullName) => {
    const username = fullName.trim().replace(/\s+/g, '').toLowerCase();
    const email = `${username}@app.com`;
    const password = `${username}@123`;
    return { username, email, password };
};