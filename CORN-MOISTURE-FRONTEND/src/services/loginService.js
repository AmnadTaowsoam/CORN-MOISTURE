export async function login(username, password) {
  console.log("API Endpoint:", import.meta.env.VITE_REACT_APP_USER_ENDPOINT); // ตรวจสอบค่า endpoint
  console.log("Username:", username);
  console.log("Password:", password); // ตรวจสอบว่า password ถูกส่งไปถูกต้อง

  const response = await fetch(`${import.meta.env.VITE_REACT_APP_USER_ENDPOINT}/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username,
      password
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Login failed: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  
  // เก็บ token ใน localStorage
  if (data && data.accessToken) {
    localStorage.setItem('accessToken', data.accessToken);
  }

  return data;
}
