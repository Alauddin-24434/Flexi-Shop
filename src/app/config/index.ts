// env config
const config = {
    PORT: process.env.PORT, 
    JWT_SECRET: {
      JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
      JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
      JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
      JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES_IN,
    },
  };
  
  export default config;
 