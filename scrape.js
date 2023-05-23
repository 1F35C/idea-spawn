const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://store.steampowered.com/tag/browse');

  // Get all tag elements
  const tagElements = await page.$$('.tag_browse_tag');

  let tags = [];

  for (let tagElement of tagElements) {
    // Get tag name and ID
    const tagName = await page.evaluate(el => el.textContent, tagElement);
    const tagId = await page.evaluate(el => el.getAttribute('data-tagid'), tagElement);
    console.log(`Processing tag: ${tagName}`);

    // Click on the tag
    await tagElement.click();

    // Wait for a moment to allow the page to update
    await page.waitForTimeout(500);

    // Try to get the count, if the element exists
    let count = null;
    const countElement = await page.$('.browse_tag_game_total');
    if (countElement) {
      const countText = await page.evaluate(el => el.textContent, countElement);
      count = parseInt(countText.split(' ').pop().replace(/,/g, ''), 10);
    }

    tags.push({
      name: tagName,
      id: tagId,
      count: count
    });
  }

  // Write the data to tags.json
  fs.writeFileSync('tags.json', JSON.stringify(tags, null, 2));

  console.log("Finished processing all tags");

  await browser.close();
})();
