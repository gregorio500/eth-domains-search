
const { chromium } = require("playwright")
const fs = require("fs")

const url = "https://app.ens.domains/search/"

const appendData = (file, data) => {
    fs.appendFile(file, data+"\n", function(err) {
        if (err) {
            console.log("error during appending!!!--> "+err)
        } else {
          console.log(`${data} was appended to the ${file}`)
        }
    })
}

const readCheck = async () => {
    try {
        const list = await fs.readFileSync("./check.txt", {encoding:'utf8', flag:'r'})
        const names = await list.toLowerCase().toString().trim().split("\n")
        return names
    } catch(err) { console.log("error!!! "+err) }
}

const handleRoute = async page => {
    try {
        await page.route('**/*', route => {
            route.request().resourceType() === 'image' ? route.abort() : route.continue()
            // console.log(`>> : ${route.request().resourceType()} ${route.request().url()}`)
        })
    } catch(err) { console.log("that's error!!! "+err)}
}


const checkDomains = async () => {
    const browser = await chromium.launch({ headless: false, slowMo: 20 })
    const context = await browser.newContext()
    const page = await context.newPage()
    const names = await readCheck()
    handleRoute(page)
           
        for(let name of names) {
            await page.goto(url+name)
            console.log(url+name)

            await page.waitForSelector(".css-0", {visible: true, timeout: 0})  // available or unavailable text
            const ifAvailable = await page.locator(".css-0").innerText()
            const premiumSelector = await page.locator('xpath=//main/div[2]/a/p').allTextContents()                       
            const ifPremium =  await premiumSelector.map(word => word.trim().split(" ")).flat()[4]
            
            if(ifAvailable === 'Unavailable') {
                await page.waitForSelector("xpath=//main/div[2]/a/p", { timeout: 0 })
                const expiry = await page.locator("xpath=//main/div[2]/a/p").allTextContents()
                const nameAndExpiry = name+" "+expiry[0]
                const ifGrace = expiry[0].slice(0,5) 
                ifGrace === "Grace" ? appendData('./results/grace-period.txt', nameAndExpiry) : appendData('./results/expires-period.txt', nameAndExpiry)
            } 
            else if(ifAvailable === 'Available') { 
                if(ifPremium === 'premium') {
                    await page.click('xpath=//main/div[2]/a')
                    await page.waitForNavigation()
                    const selector = 'xpath=//main/div[2]/div[2]/div[4]/div[2]/div[2]/div[1]'
                    await page.waitForSelector(selector, { timeout: 0 })
                    const premiumExpire = await page.locator(selector).textContent()
                    appendData('./results/available-premium.txt', name+" "+premiumExpire)
                } else {
                    appendData('./results/available.txt', name)  //this is not a premium. Should be as a regular available name by default
                }
            } 

            await page.waitForTimeout(1000)
        }
        await browser.close()
}


const main = async () => {
    await checkDomains()
 }

main()
