
const http = require('http');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

const server = http.createServer((req, res) => {

    const adres = new URL(req.url, 'http://localhost:3000');

    if (adres.pathname === '/') {
        res.writeHead(200, {
            'Content-Type': 'text/plain; charset=utf-8'
        });

        res.end('Strona główna');
    }

    else if (adres.pathname === '/json') {
        res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8'
        });

        const dane = {
            imie: 'Jan',
            wiek: 18,
            miasto: 'Poznań'
        };

        res.end(JSON.stringify(dane));
    }

    else if (adres.pathname === '/html') {
        res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8'
        });

        res.end(`
            <!DOCTYPE html>
            <html lang="pl">
            <head>
                <meta charset="UTF-8">
                <title>Strona HTML</title>
            </head>
            <body>
                <h1>Witaj!</h1>
                <p>To jest HTML wygenerowany przez Node.js.</p>
            </body>
            </html>
        `);
    }

    else if (adres.pathname === '/plik') {
        const plik = path.join(__dirname, 'strona.html');

        fs.readFile(plik, 'utf8', (err, data) => {

            if (err) {
                res.writeHead(500);
                res.end('Błąd odczytu pliku');
                return;
            }

            res.writeHead(200, {
                'Content-Type': 'text/html; charset=utf-8'
            });

            res.end(data);
        });
    }

    else if (adres.pathname === '/get_params' && req.method === 'GET') {

        const params = Object.fromEntries(adres.searchParams.entries());

        console.log('Parametry GET:', params);

        const timestamp = Date.now();
        const nazwaPliku = `params_${timestamp}.json`;
        const sciezka = path.join(__dirname, nazwaPliku);

        fs.writeFile(sciezka, JSON.stringify(params, null, 2), 'utf8', (err) => {

            if (err) {
                res.writeHead(500, {
                    'Content-Type': 'application/json; charset=utf-8'
                });

                res.end(JSON.stringify({ error: 'Błąd zapisu pliku' }));
                return;
            }

            res.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8'
            });

            res.end(JSON.stringify({ ok: 'ok' }));
        });
    }

    else {

        const nazwaPliku = path.basename(decodeURIComponent(adres.pathname));
        const sciezka = path.join(__dirname, 'assets', nazwaPliku);

        fs.readFile(sciezka, (err, data) => {

            if (err) {
                res.writeHead(404, {
                    'Content-Type': 'application/json; charset=utf-8'
                });

                res.end(JSON.stringify({ error: 'Not Found' }));
                return;
            }

            const typMIME = mime.lookup(sciezka) || 'application/octet-stream';

            res.writeHead(200, {
                'Content-Type': typMIME
            });

            res.end(data);
        });
    }

});

server.listen(3000, () => {
    console.log('Serwer działa na porcie 3000');
});
