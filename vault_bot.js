const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const chromium = require('@sparticuz/chromium');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: chromium.headless,
        args: chromium.args,
        executablePath: await chromium.executablePath()
    }
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log('\n>>> امسح QR من واتساب: الأجهزة المرتبطة <<<\n');
});

client.on('ready', () => {
    console.log('✅ البوت اشتغل بنجاح!');
});

client.initialize();
