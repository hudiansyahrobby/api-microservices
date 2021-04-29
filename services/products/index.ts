import app from './app';

const PORT = process.env.PORT || 8083;

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
