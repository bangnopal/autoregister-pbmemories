const puppeteer = require('puppeteer')
const fs = require('fs-extra')
const moment = require('moment-timezone').tz.setDefault('Asia/Jakarta')
const dedent = require('dedent-js')
const chalk = require('chalk')
const now = require('performance-now')
const Spinners = require('spinnies')

const userList = JSON.parse(fs.readFileSync('users.json'))

async function spamreg (url, i) {
  var ack = i
  
  const startTime = now()
  
  const frames = {
    interval: 200,
    frames: [
			"⠋",
			"⠙",
			"⠹",
			"⠸",
			"⠼",
			"⠴",
			"⠦",
			"⠧",
			"⠇",
			"⠏"
		]
  }
  const spinner = new Spinners({
    spinner: frames,
    color: 'blue',
    succeedColor: 'green',
    failColor: 'red',
    spinnerColor: 'blueBright'
  })
  await spinner.add('spinner-' + i, {
    text: 'membuat akun baru...'
  })
  
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--single-process'
      ]
  })
  const page = await browser.newPage()
  await page.goto(url, {
    waitUntil: 'networkidle0'
  })
  var obj = {
    username: `nopal${makeChar(5) + ack}`,
    email: `${makeChar(15) + ack}@gmail.com`,
    password: `EzDiSpamBoss`,
    hint_question: 'What was your childhood nickname?',
    hint_answer: `kontol kau pecah ${ack}`,
    reg_time: moment.tz('Asia/Jakarta').locale('id').format('LLLL')
  }
  await page.waitForSelector('input[id=login]')
  await page.type('input[id=login]', obj.username)
  .then(async () => page.click('input[id=check_username]'))
  await sleep(100)
  await page.type('input[id=email]', obj.email)
  await page.type('input[id=password]', obj.password)
  await page.type('input[id=re_password]', obj.password)
  await page.select('select[id=hint_question]', obj.hint_question)
  await page.type('input[id=hint_answer]', obj.hint_answer)
  await page.click('input[id=submit]')
  await userList.push(obj)
  await fs.writeFileSync('users.json', JSON.stringify(userList, null, 4))
  spinner.remove('spinner-' + i)
  await console.log(dedent(`
  ${color(`[${i}]`, 'cyan')} ${color('BULK ACCOUNT GENERATOR FOR PB PRIVATE', 'orange')} by ${color('@bangnopal_real', 'red')}
  ${color('Status', 'green')}: ${color('SUKSES', 'yellow')}
  ${color('Username', 'green')}: ${color(obj.username, 'yellow')}
  ${color('Password', 'green')}: ${color(obj.password, 'yellow')}
  ${color('Email', 'green')}: ${color(obj.email, 'yellow')}
  ${color('Proxy', 'green')}: ${color('NO', 'yellow')}
  ${color('Register URL', 'green')}: ${color(url, 'yellow')}
  ${color('Waktu', 'green')}: ${color(moment.tz('Asia/Jakarta').locale('id').format('LLLL'), 'yellow')}
  ${color('Waktu Proses', 'green')}: ${color(((now() - startTime) / 1000).toFixed(2), 'yellow')} detik
  
  `))
  await sleep(1000)
  browser.close()
}

function makeChar(length) {
    var result           = '';
    var characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength))
   }
   return result
}

function color(text, color) {
    return !color ? chalk.green(text) : chalk.keyword(color)(text)
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

async function start (url, num) {
  for (let i = 1; i <= num; i++) {
    await spamreg(url, i)
  }
}


start('http://pb-memories.id/register', 50000)
