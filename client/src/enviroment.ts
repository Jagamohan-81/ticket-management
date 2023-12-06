export const environment = {
    baseUrl: 'http://localhost:8000/',
  };


export const localUser=()=>{
  const token = localStorage.getItem('token');
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  return { token, user };
}