const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth({ dataPath: './session' }),
    puppeteer: {
        headless: 'new',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ]
    }
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log('\n========== امسح QR من واتساب ==========\n');
});

client.on('ready', () => {
    console.log('✅ البوت اشتغل بنجاح!');
});

client.on('message', msg => {
    console.log('رسالة من:', msg.from);
});

client.initialize();
