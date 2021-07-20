const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate')
const PORT = 8080;





const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map(el => slugify(el.productName, { lower: true }));

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

      // overview page
    if(pathname === '/' || pathname === '/overview') {
      res.writeHead(200, {'content-type' :  'text/html'});
      const cardsHtml =  dataObj.map(el => replaceTemplate(tempCard, el)).join('');
      const output = tempOverview.replace('{%PRODUCT_CARDS%', cardsHtml) //insert tempOverview
      res.end(output)

      // product page
    } else if(pathname === '/product') {
      res.writeHead(200, {'content-type' :  'text/html'});
      const product = dataObj[query.id];
      const output = replaceTemplate(tempProduct, product)   
      res.end(output)

      // api page
    } else if(pathname === '/api') {
      res.writeHead(200, {'content-type' :  'application/json'});
      res.end(data);

      // not_found page
    } else {
      res.writeHead(404, {'content-type' :  'text/html'});
      res.end('<h1>Page not found</h1>')
    }
})

server.listen(PORT, 'localhost', () => {
  console.log('server started at port');
})


























   // switch(req.url) {
    //   case '/': 
    //   case '/overview':
    //   path += 'overview.html';
    //   res.writeHead(200, {"content-type": "text/html"})
    //   break;
    //   case '/product': 
    //   path += 'product.html';
    //   res.writeHead(200, {"content-type": "text/html"})
    //   break;
    //   default: 
    //   path += '404.html';
    //   res.writeHead(404, {"content-type": "text/html"})
    //   break;
    // }