import app from './app';

const PORT = process.env.PORT || 8086;

app.listen(PORT, () =>
    console.log(`Listening on port: ${PORT}`)
);
