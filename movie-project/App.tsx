import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'styled-components/native';
import Index from './pages/Index';

export default function App() {
	const queryClient = new QueryClient();
	const theme = {
		main: 'mediumseagreen',
	};
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={theme}>
				<Index />
			</ThemeProvider>
		</QueryClientProvider>
	);
}
