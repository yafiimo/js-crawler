const puppeteer = require("puppeteer");

class Browser {
  constructor() {
    this.browser = {};
    this.page = {};
  }

  initBrowser = async ({headless}) => {
    this.browser = await puppeteer.launch({
      headless: Boolean(headless),
      executablePath:
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    });
  }

  close = async () => {
    await this.browser.close()
  };

  createPage = async ({incognito}) => {
    if(incognito) {
      const _incognito = await this.browser.createIncognitoBrowserContext();
      this.page = await _incognito.newPage();
    } else {
      this.page = await this.browser.newPage()
    }

    this.page.on("console", consoleObj => {
      if (consoleObj._type !== "warning" && consoleObj._type !== "error") {
        console.log(consoleObj.text());
      }
    });
  };

  goToPage = async (url) => {
    await this.page.goto(url, { waitUntil: "domcontentloaded" });
  };

  reloadPage = async () => {
    await this.page.reload({ waitUntil: "domcontentloaded" });
  };

  clickItem = async (itemSelector) => {
    const item = await this.page.$(itemSelector);
    await item.click();
  };

  clickLink = async (itemSelector) => {
    try {
      await this.page.$eval(itemSelector, async (el) => {
        await el.click();
      });
      await this.page.waitForNavigation({ waitUntil: 'networkidle0' });
      return true;
    } catch(e) {
      return false;
    }
  };

  typeInInput = async (inputName, value) => {
    await this.page.click(`input[name=${inputName}]`);
    await this.page.keyboard.type(value);
  };

  selectItem = async (selector) => {
    const item = await this.page.$(selector);
    return item;
  };

  selectMultipleItems = async (selector) => {
    const items = await this.page.$$(selector);
    return items;
  };

  waitFor = async (seconds) => {
    await this.page.waitFor(seconds * 1000);
  };

  evaluate = async (evaluation) => {
    return await this.page.evaluate(evaluation);
  }

}

module.exports = Browser;