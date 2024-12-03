### XUTILS FOR XSTRO

#### SETUP

```javascript

import {Xutils} from 'utils'

async function getFile() {
    const res = await Xutils.getBuffer('https://image.png')
    console.log(res)
    const file = Xutils.buffertoFile(res, 'image.png')
    return file
}
```
#### MADE BY ASTRO