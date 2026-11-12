const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {

    if (req.url === '/') {
        res.writeHead(200, {
            'Content-Type': 'text/plain; charset=utf-8'
        });

        res.end('Strona główna');
    }

    else if (req.url === '/json') {
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

    else if (req.url === '/html') {
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

    else if (req.url === '/plik') {
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

    else {
        res.writeHead(404, {
            'Content-Type': 'text/plain; charset=utf-8'
        });

        res.end('Nie znaleziono strony');
    }

});

server.listen(3000, () => {
    console.log('Serwer działa na porcie 3000');
});
