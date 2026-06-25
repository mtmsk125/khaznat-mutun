const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const chromium = require('@sparticuz/chromium');

async function startBot() {
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
        console.log('\n========== امسح QR من واتساب ==========\n');
    });

    client.on('ready', () => {
        console.log('✅ البوت اشتغل بنجاح واتصل بواتساب!');
    });

    client.on('message', msg => {
        console.log('رسالة جديدة من:', msg.from);
    });

    await client.initialize();
}

startBot().catch(console.error);
