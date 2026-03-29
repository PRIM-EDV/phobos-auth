const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// mkdir -p ./k8s/secrets
const dir = './k8s/secrets';
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

// openssl genpkey -algorithm RSA -out k8s/secrets/private_key.pem
const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
    }
});

// openssl rsa -pubout -in k8s/secrets/private_key.pem -out k8s/secrets/public_key.pem
fs.writeFileSync(path.join(dir, 'private_key.pem'), privateKey);
fs.writeFileSync(path.join(dir, 'public_key.pem'), publicKey);