import cors from 'cors';
 
export const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
  credentials: true,
};
 
export default cors(corsOptions);