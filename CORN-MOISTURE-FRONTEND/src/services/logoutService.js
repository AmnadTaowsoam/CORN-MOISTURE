// logoutService.js
export function logout() {
    // ลบ token และข้อมูลที่เก็บไว้ใน localStorage
    localStorage.removeItem('accessToken');
    localStorage.clear(); // ล้างข้อมูลทั้งหมดใน localStorage หากต้องการ
  }
  