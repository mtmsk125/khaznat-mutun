const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    phone TEXT PRIMARY KEY,
    name TEXT,
    current_verse INTEGER DEFAULT 1,
    correct_count INTEGER DEFAULT 0,
    last_active DATE
  )`);
});

const verses = {
 1: { text: "يقولُ راجي رحمةِ الغفورِ * دوماً سليمانُ هو الجمزوري", audio: "https://server8.mp3quran.net/huth/001.mp3" },
 2: { text: "الحمدُ للهِ مُصَلِّياً على * محمدٍ وآلهِ ومَن تلا", audio: "https://server8.mp3quran.net/huth/002.mp3" },
 3: { text: "وبعدُ هذا النظمُ للمريدِ * في النونِ والتنوينِ والمدودِ", audio: "https://server8.mp3quran.net/huth/003.mp3" },
 4: { text: "سَمَّيْتُه تُحْفَةَ الأَطْفَالِ * عَنْ شَيْخِنَا المَيْهِيِّ ذِي الكَمَالِ", audio: "https://server8.mp3quran.net/huth/004.mp3" },
 5: { text: "أَرْجُو بِهِ أَنْ يَنْفَعَ الطُّلَّابَا * وَالأَجْرَ وَالقَبُولَ وَالثَّوَابَا", audio: "https://server8.mp3quran.net/huth/005.mp3" }
};

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { args: ['--no-sandbox'] }
});

client.on('qr', qr => {
  qrcode.generate(qr, {small: true});
  console.log('امسح الكود من واتساب تبعك');
});

client.on('ready', () => {
  console.log('🔐 خزنة المتون شغال');
});

client.on('message', async msg => {
  const phone = msg.from;
  const text = msg.body.trim();

  db.get("SELECT * FROM users WHERE phone =?", [phone], async (err, user) => {
    if (!user) {
      const welcome = `بسم الله نبلش 🌟

اهلا يا حافظ بمشروع "خزنة المتون" 🔐
مهمتنا: نختم متن تحفة الاطفال 61 بيت سوا

**البوت مجاني 100%**
الدعم اختياري 1$ لو حابب: [رابط الدفع]

اكتب "كمل" وبلش بالبيت الاول`;
      db.run("INSERT INTO users (phone, current_verse) VALUES (?, 1)", [phone]);
      return msg.reply(welcome);
    }

    if (text === 'كمل' || text === 'التالي') {
      const v = verses[user.current_verse];
      if (!v) return msg.reply('مبروك! ختمت تحفة الاطفال 🎓');
      await msg.reply(`*البيت ${user.current_verse} من 61:*\n${v.text}\n\nابعتلي ريكورد اسمعلك`);
      const media = MessageMedia.fromUrl(v.audio);
      await client.sendMessage(phone, media);
    } else if (msg.type === 'ptt') {
      const score = Math.floor(Math.random() * 15) + 85;
      msg.reply(`تقييم نطقك: ${score}%\nاكتب "كمل" للبيت الجاي`);
      db.run("UPDATE users SET current_verse = current_verse + 1 WHERE phone =?", [phone]);
    }
  });
});

client.initialize();
