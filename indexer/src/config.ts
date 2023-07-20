export const getDevlopmentDB = () => ({
  host: process.env.DEV_HOST,
  port: +process.env.DEV_PORT,
  database: process.env.DEV_DATABASE,
  username: process.env.DEV_USERNAME,
  password: process.env.DEV_PASSWORD,
  synchronize: !!process.env.DEV_SYNC,
});

export const getTestingDB = () => ({
  host: process.env.TEST_HOST,
  port: +process.env.TEST_PORT,
  database: process.env.TEST_DATABASE,
  username: process.env.TEST_USERNAME,
  password: process.env.TEST_PASSWORD,
  synchronize: !!process.env.TEST_SYNC,
});

export const getInfuraKey = () => process.env.INFURA_API_KEY;
