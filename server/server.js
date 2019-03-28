const http = require('http')
const express = require('express')

const HTTP_PORT = process.env.PORT || process.argv[2] || 7007

// create server
const app = express()

app.get('/', function resetHandler(req, res) {
    res.write(`<!doctype html>
      <head>
        <script>
          window._scriptStartTime = performance.now()
          window._scriptStartTimeLegacy = Date.now()
        </script>
      </head>
      <body bgcolor=yellow>
      <h1>Streaming HTML parser demo</h1>
      <p>If:
        <br>1) this page loads first yellow, then turns lime, and
        <br>2) scriptStart < responseEnd, and
        <br>3) scriptStart << 3000 (try reloading if first load is slow),
        <br>then the streaming parser is working really well.<br>
         If the first paint you see is lime, it means HTML is only rendered on screen after responseEnd.</p>
      <p>
        See the code <a href="https://github.com/jakub-g/html-streaming-parser-test/blob/master/server/server.js">here</a>
        (the server flushes part of HTML immediately, and the rest after 3000ms delay)
      </p>
      <p>responseStart...<!-- server flush here -->
    `)

    setTimeout(function() {
      res.write(`responseEnd</p>

        <script>
        document.body.style.backgroundColor = 'lime'
        setTimeout(function() {
          var start, end, script;
          if (performance.getEntriesByType('navigation').length > 0) {
            start = Math.round(performance.getEntriesByType('navigation')[0].responseStart)
            end = Math.round(performance.getEntriesByType('navigation')[0].responseEnd)
            script = Math.round(window._scriptStartTime)
          } else {
            // Safari is the new IE
            start = performance.timing.responseStart - performance.timing.requestStart
            end = performance.timing.responseEnd - performance.timing.requestStart
            script = window._scriptStartTimeLegacy - performance.timing.requestStart
          }
          var msg = ''

          msg += '\\nresponseStart = ' + start
          msg += '\\nscriptStart   = ' + script
          msg += '\\nresponseEnd    = ' + end
          alert(msg)
        }, 0)
        </script>`)
      res.end()
    }, 3000)
})

http
  .createServer(app)
  .listen(HTTP_PORT, () => console.log(`Server listening on http://localhost:${HTTP_PORT}`));
