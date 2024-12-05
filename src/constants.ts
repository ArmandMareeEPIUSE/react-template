const config = {
  server: {
    url: 'https://interviewer-service.gl7ouskkmcjf2.us-east-1.cs.amazonlightsail.com',
  },
};

if (process.env.NODE_ENV === 'development') {
  config.server.url = 'http://localhost:8080';
}

export default config;
