const compression = require('compression')
const express = require('express')

require('dotenv').config()
const port = process.env.SERVER_PORT || 3001

;(async () => {
  try {
    const server = express()
    server.use(compression())
    server.use(express.static('build', { index: false }))

    server.get('*', async (req, res) => {
      //
      /* serving _next static content using next.js handler */
      // return res.sendFile(__dirname + '/build/index.html')
      // try {
      //   const data = await fs.readFileSync(
      //     path.resolve(__dirname, 'build', 'index.html'),
      //     'utf-8'
      //   )

      //   const response = await axios.post(
      //     process.env.API_MEEYID_TENANT + '/v1/config',
      //     null,
      //     {
      //       headers: {
      //         'x-client-id': 'newCrm',
      //         'x-api-key': 'ee207614240d2e377cc87d3c1e227515',
      //       },
      //     }
      //   )

      //   const currentTenantId = req.headers['x-tenant-id'] || '9'
      //   const currentTenantInfo = response.data?.data?.[currentTenantId]

      //   const newData = data.replaceAll(
      //     process.env.REACT_APP_SDK_URL,
      //     currentTenantInfo?.authId?.sdk.url + '/sdk.js'
      //   )

      //   // res.sendFile(path.join(__dirname, 'build', 'index.html'))
      //   if (process.env.USE_ROOT_SDK) res.send(data)
      //   else res.send(newData)
      // } catch (error) {
      //   res.status(500).send('Have error')
      // }

      return res.sendFile(__dirname + '/build/index.html')
    })

    server.get('/*', async (req, res) => {
      //
      /* serving _next static content using next.js handler */
      // return res.sendFile(__dirname + '/build/index.html')
      return res.sendFile(__dirname + '/build/index.html')
    })

    server.listen(port, (err) => {
      if (err) throw err
    })
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
})()
