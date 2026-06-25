const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: 'new',
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH, // هون بقرأ الـ ENV
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    }
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log('>>> امسح QR من واتساب <<<');
});

client.on('ready', () => console.log('✅ البوت اشتغل!'));
client.initialize();
