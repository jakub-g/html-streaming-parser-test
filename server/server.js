const http = require('http')
const express = require('express')

const HTTP_PORT = process.env.PORT || process.argv[2] || 7007

// create server
const app = express()

app.get('/', function resetHandler(req, res) {
    res.write(`<!doctype html>
      <body bgcolor=yellow>
      <h1>Streaming HTML parser demo (looks like it's Chrome only)</h1>
      <p>If this page loads first yellow, then turns lime, streaming parser is working really well.<br>
         If the first paint you see is lime, it means HTML is only rendered on screen after responseEnd.</p>
      <script>window._scriptStartTime = performance.now()</script>
      <p>responseStart...
    `)

    setTimeout(function() {
      res.write(`responseEnd</p>

        <script>
        document.body.style.backgroundColor = 'lime'
        setTimeout(() => {
          let msg = ''
          msg += '\\nresponseStart = ' + Math.round(performance.getEntriesByType('navigation')[0].responseStart)
          msg += '\\nscriptStart   = ' + Math.round(window._scriptStartTime)
          msg += '\\nresponseEnd    = ' + Math.round(performance.getEntriesByType('navigation')[0].responseEnd)
          alert(msg)
        }, 0)
        </script>`)
      res.end()
    }, 3000)
})

http
  .createServer(app)
  .listen(HTTP_PORT, () => console.log(`Server listening on http://localhost:${HTTP_PORT}`));
