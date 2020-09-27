// const crypto = require('crypto');

// const secret = 'abcdefg';
// const hash = crypto.createHmac('sha256', secret)
//                    .update('')
//                    .digest('dsa');
// console.log(hash);


const crypto = require('crypto');
const buf = crypto.randomBytes(8);
console.log(`${buf.length} bytes of random data: ${buf.toString('utf-8')}`);
// console.log('×æÉRçµ'.length)

