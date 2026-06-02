import { QueryClient } from '@tanstack/react-query';

// Singleton QueryClient shared across the whole app.
// Exported so AuthContext can call queryClient.clear() on logout.
const queryClient = new QueryClient();

export default queryClient;
