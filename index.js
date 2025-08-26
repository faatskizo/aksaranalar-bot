// IMPORT MODULE

const {makeWaSocket, useMultiFileAuthState } = require("@whiskeysockets/baileys")
const pino = require("pino")
const chalk = require("chalk")
const readline = require("readline")

// METODE PAIRING IN WHATSAPP
// JIKA TRUE = Pairing Code || JIKA FALSE = Scan QR
const usePairingCode = true

// PROMT INPUT DI TERMINAL
async function question(promt) {
    process.stdout.write(promt)
    const r1 = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    })



    return new Promise((resolve) => r1.question("", (ans) => {
        r1.close()
        resolve(ans)
    }))

}

// KONEKSI KE WHATSAPP
async function connectToWhatsapp() {
    console.log(chalk.blue("🧠 MEMULAI KONEKSI KE WHATSAPP"))

    // MENYIMPAN SESI LOGIN
    //AksaraNalarSesi FOLDER MENJADI TEMPAT MENYIMPAN SESI LOGIN
    const { state , saveCreds } = await useMultiFileAuthState("./AksaraNalarSesi")

    // MEMBUAT KONEKSI WHATSAPP
    const aksaraNalar = makeWaSocket({
        logger: pino ({ level: "silent"}),
        printQRInTerminal: !usePairingCode,
        auth: state,
        browser: ['Ubuntu', 'Chrome', '20.0.04'], // SIMULASI BROWSER
        version: [2, 3000, 1015901307], // VERSI WHATSAPP

    })

    // HANDLE KODE PAIRING
    if (usePairingCode && !lenwy.authState.creds.registered) {
        console.log(chalk.green("🧠 MASUKKAN NOMOR DENGAN AWAL 62"))
        const phoneNumber = await question(">")
        const code = await.aksaraNalar.requestPairingCode(phoneNumber.trim())
        console.log(chalk.cyan(`🧠 Pairing Code : ${code}`))
}
 
    // MENYIMPAN SESI LOGIN
    aksaraNalar.ev.on("creds.update", saveCreds)

    // INFORMASI KONEKSI
    aksaraNalar.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect } = update
        if ( connection === "close") {
            console.log(chalk.red("❌  KONEKSI TERPUTUS, MOHON SAMBUNGKAN ULANG"))
            connectToWhatsApp()
        } else if ( connection === "open") {
            console.log(chalk.green("✔  BOT WHATSAPP BERHASIL TERSAMBUNG"))
        }
    })

}


// JALANKAN KONEKSI WHATSAPP
connectToWhatsApp()

