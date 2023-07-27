import * as playwright from 'playwright-chromium'
import child_process from 'child_process'
import path from 'path'
import process from 'process'
import {promises as fs} from 'fs'
import os from 'os'

const context = await playwright.chromium.launchPersistentContext(await fs.mkdtemp(path.join(os.tmpdir(), 'pal')), {channel:'chrome', args:['--disable-blink-features=AutomationControlled', '--start-maximized'], headless:false, viewport:null})//default_args https://github.com/microsoft/playwright/blob/5faf6f9e69c2148e94c81675fb636eb31a02b5e7/src%2Fserver%2Fchromium%2Fchromium.ts#L78
context.setDefaultTimeout(0)
const lootably = await context.newPage()
await lootably.goto('https://members.zoombucks.com/#/')
await lootably.locator('input[name="email"]').fill('chaowen.guo1@gmail.com')
await lootably.locator('input[name="password"]').fill(process.argv.at(2))
await lootably.locator('button.btn-sign-in').click()
await lootably.waitForURL('https://members.zoombucks.com/#/home')
await lootably.goto('https://members.zoombucks.com/#/offers/watch_videos')
await lootably.goto(globalThis.JSON.parse(globalThis.atob(new globalThis.URL(await lootably.locator('a[href*=provider]').first().getAttribute('href')).searchParams.values().next().value)).url)
await lootably.waitForTimeout(1000 * 2)

//const searchParams = new globalThis.URL(await lootably.goto('https://wall.lootably.com/videos?placementID=ckmcaq0yg000c01z3dy7h6eyf&sid=clh5g7ncvcnee01x24gdlefrh').then(_ => _.url())).searchParams
//await lootably.waitForFunction(() => 'ramp' in globalThis && 'showRewardedVideo' in globalThis.ramp)
await lootably.screenshot({path:'screenshot.png'})
//while (true)
/*{
    const reward = lootably.locator('a[href*="50-1"]')
    await reward.waitFor()
    await lootably.waitForTimeout(1000 * 30)
    const playwireSessionCode = await globalThis.fetch('https://api.lootably.com/api/offerwall/playwire/generateSession', {method:'post', headers:{'content-type':'application/json'}, body:globalThis.JSON.stringify({placementID:searchParams.get('placementID'), rawPublisherUserID:searchParams.get('sid')})}).then(_ => _.json()).then(_ => _.data.playwireSessionCode)
    await lootably.evaluateHandle(([playwireSessionCode, placementID, sid]) => globalThis.ramp.showRewardedVideo({code:playwireSessionCode, userId:placementID + sid, callback:async _ => await globalThis.fetch('https://api.lootably.com/api/offerwall/playwire/redeemSession', {method:'post', headers:{'content-type':'application/json'}, body:globalThis.JSON.stringify({playwireSessionCode, placementID, rawPublisherUserID:sid})}).then(_ => _.json())}), [playwireSessionCode, searchParams.get('placementID'), searchParams.get('sid')])
    const rate = lootably.locator('a[href="https://www.trustpilot.com/evaluate/lootably.com"]+div>button')
    await rate.click()
}*/
await context.close()
