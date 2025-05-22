import 'zone.js/node';
import { enableProdMode } from '@angular/core';
import { renderApplication } from '@angular/platform-server';  //error
import { provideServerRendering } from '@angular/platform-server'; //error
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import express from 'express';
import { join } from 'path';

if (process.env['NODE_ENV'] === 'production') {
  enableProdMode();
}

const app = express();  //error here in express
const port = process.env['PORT'] || 4000;
const distFolder = join(process.cwd(), 'dist/book-review-frontend/browser');

app.use(express.static(distFolder, { maxAge: '1y' }));

app.get('*.*', express.static(distFolder, { maxAge: '1y' }));

app.get('*', (req, res) => {
  renderApplication(() => bootstrapApplication(AppComponent, {
    providers: [
      provideServerRendering()
    ]
  }), {
    url: req.url,
    document: '<book-review-frontend></book-review-frontend>'
  }).then((html: string) => {
    res.set('Content-Type', 'text/html');
    res.send(html);
  }).catch((err: any) => {
    console.error(err);
    res.status(500).send('Server error');
  });
});

app.listen(port, () => {
  console.log(`Node Express server listening on http://localhost:${port}`);
});