const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
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
    console.log('\n========================================');
    console.log('QR Code received');
    console.log('امسح الكود من واتساب تبعك: الأجهزة المرتبطة');
    console.log('========================================\n');
});

client.on('ready', () => {
    console.log('✅ البوت اشتغل بنجاح واتصل بواتساب!');
});

client.on('authenticated', () => {
    console.log('✅ تم تسجيل الدخول بنجاح');
});

client.on('auth_failure', msg => {
    console.error('❌ فشل تسجيل الدخول:', msg);
});

client.on('message', msg => {
    console.log('رسالة جديدة من:', msg.from, 'النص:', msg.body);
    
    // مثال رد تلقائي - احذفه اذا بدك
    if (msg.body === '!ping') {
        msg.reply('pong 🏓');
    }
});

client.initialize();
